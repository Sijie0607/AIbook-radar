import seedRows from "../mocks/recommendations.seed.json";
import type { BookRecommendationDraft, BookRecommendationRecord } from "../types/recommendation";
import { createEmptyRecommendationDraft } from "../types/recommendation";
import type { RadarDomain } from "../types/book";
import {
  DRAFT_ROW_ID,
  RECOMMENDATION_DRAFT_STORAGE_KEY,
  RECOMMENDATION_STORAGE_KEY,
  fromRecommendationDraft,
  toRecommendationDraft,
  toRecommendationRecord,
  type BookRecommendationDraftRow,
  type BookRecommendationRow,
} from "./virtualDb/recommendationTables";

const seedRecommendationRows = seedRows as BookRecommendationRow[];

function canUseStorage(): boolean {
  try {
    const probe = "__ai_reading_radar_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) {
    throw new Error("虚拟库本地存储不可用，推荐暂未写入 book_recommendations");
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

function ensureRecommendationTable(): BookRecommendationRow[] {
  if (!canUseStorage()) {
    return [...seedRecommendationRows];
  }

  migrateLegacyRecommendationStorage();

  const existing = window.localStorage.getItem(RECOMMENDATION_STORAGE_KEY);
  if (existing === null) {
    writeJson(RECOMMENDATION_STORAGE_KEY, seedRecommendationRows);
    return [...seedRecommendationRows];
  }
  try {
    const parsed = JSON.parse(existing) as BookRecommendationRow[];
    return Array.isArray(parsed) ? parsed : [...seedRecommendationRows];
  } catch {
    writeJson(RECOMMENDATION_STORAGE_KEY, seedRecommendationRows);
    return [...seedRecommendationRows];
  }
}

/** 兼容旧版扁平 localStorage 键，迁移到虚拟表存储键 */
function migrateLegacyRecommendationStorage(): void {
  const legacyRecordsKey = "ai-reading-radar:recommendation-records";
  const legacyDraftKey = "ai-reading-radar:recommendation-draft";
  const hasNewTable = window.localStorage.getItem(RECOMMENDATION_STORAGE_KEY) !== null;
  const legacyRaw = window.localStorage.getItem(legacyRecordsKey);

  if (!hasNewTable && legacyRaw) {
    try {
      const legacyRecords = JSON.parse(legacyRaw) as BookRecommendationRecord[];
      if (Array.isArray(legacyRecords)) {
        const rows: BookRecommendationRow[] = legacyRecords.map((record) => ({
          id: record.id,
          title: record.title,
          author: record.author,
          domain: record.domain,
          personal_score: record.personalScore,
          reason: record.reason,
          status: "recorded",
          submitted_at: record.submittedAt,
          title_author_key: normalizeRecommendationKey(record.title, record.author),
        }));
        writeJson(RECOMMENDATION_STORAGE_KEY, rows);
      }
    } catch {
      // 忽略损坏的旧数据
    }
    window.localStorage.removeItem(legacyRecordsKey);
  }

  const hasNewDraft = window.localStorage.getItem(RECOMMENDATION_DRAFT_STORAGE_KEY) !== null;
  const legacyDraftRaw = window.localStorage.getItem(legacyDraftKey);
  if (!hasNewDraft && legacyDraftRaw) {
    try {
      const legacyDraft = JSON.parse(legacyDraftRaw) as BookRecommendationDraft;
      writeJson(RECOMMENDATION_DRAFT_STORAGE_KEY, fromRecommendationDraft(legacyDraft));
    } catch {
      // 忽略损坏的旧草稿
    }
    window.localStorage.removeItem(legacyDraftKey);
  }
}

export function normalizeRecommendationKey(title: string, author: string): string {
  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
  return `${normalize(title)}::${normalize(author)}`;
}

/**
 * 模拟：
 * SELECT * FROM book_recommendations ORDER BY submitted_at DESC;
 */
export function selectAllRecommendations(): BookRecommendationRow[] {
  return [...ensureRecommendationTable()].sort(
    (left, right) => new Date(right.submitted_at).getTime() - new Date(left.submitted_at).getTime(),
  );
}

/**
 * 模拟：
 * INSERT INTO book_recommendations (...) VALUES (...);
 * 若 title_author_key 冲突则抛错（对应 UNIQUE 约束）。
 */
export function insertRecommendation(input: {
  id: string;
  title: string;
  author: string;
  domain: RadarDomain;
  personalScore: number;
  reason: string;
  submittedAt?: string;
}): BookRecommendationRecord {
  const title = input.title.trim();
  const author = input.author.trim();
  const reason = input.reason.trim();
  const titleAuthorKey = normalizeRecommendationKey(title, author);
  const rows = ensureRecommendationTable();

  if (rows.some((row) => row.title_author_key === titleAuthorKey)) {
    throw new Error("UNIQUE constraint failed: book_recommendations.title_author_key");
  }

  const row: BookRecommendationRow = {
    id: input.id,
    title,
    author,
    domain: input.domain,
    personal_score: input.personalScore,
    reason,
    status: "recorded",
    submitted_at: input.submittedAt ?? new Date().toISOString(),
    title_author_key: titleAuthorKey,
  };

  writeJson(RECOMMENDATION_STORAGE_KEY, [row, ...rows]);
  return toRecommendationRecord(row);
}

/**
 * 兼容旧调用：写入虚拟表后返回全部记录。
 */
export function saveRecommendationRecord(record: BookRecommendationRecord): BookRecommendationRecord[] {
  insertRecommendation({
    id: record.id,
    title: record.title,
    author: record.author,
    domain: record.domain,
    personalScore: record.personalScore,
    reason: record.reason,
    submittedAt: record.submittedAt,
  });
  return getRecommendationRecords();
}

export function getRecommendationRecords(): BookRecommendationRecord[] {
  return selectAllRecommendations().map(toRecommendationRecord);
}

/**
 * 模拟：
 * SELECT * FROM book_recommendation_drafts WHERE id = 'local_default';
 */
export function getRecommendationDraft(): BookRecommendationDraft {
  const row = readJson<BookRecommendationDraftRow | null>(RECOMMENDATION_DRAFT_STORAGE_KEY, null);
  if (!row) {
    return createEmptyRecommendationDraft();
  }
  return toRecommendationDraft(row);
}

/**
 * 模拟：
 * INSERT ... ON CONFLICT(id) DO UPDATE（草稿 upsert）
 */
export function saveRecommendationDraft(draft: BookRecommendationDraft): void {
  writeJson(RECOMMENDATION_DRAFT_STORAGE_KEY, fromRecommendationDraft(draft));
}

/**
 * 模拟：
 * DELETE FROM book_recommendation_drafts WHERE id = 'local_default';
 */
export function clearRecommendationDraft(): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.removeItem(RECOMMENDATION_DRAFT_STORAGE_KEY);
}

export function isDuplicateRecommendation(
  title: string,
  author: string,
  records: BookRecommendationRecord[] = getRecommendationRecords(),
): boolean {
  const normalizedTitle = title.trim();
  const normalizedAuthor = author.trim();
  if (!normalizedTitle || !normalizedAuthor) {
    return false;
  }
  const key = normalizeRecommendationKey(normalizedTitle, normalizedAuthor);
  return records.some(
    (record) => normalizeRecommendationKey(record.title, record.author) === key,
  );
}

/** 调试 / 文档用：返回当前虚拟表名与存储键 */
export function getRecommendationStorageMeta() {
  return {
    recommendationTable: "book_recommendations",
    draftTable: "book_recommendation_drafts",
    draftRowId: DRAFT_ROW_ID,
    recommendationStorageKey: RECOMMENDATION_STORAGE_KEY,
    draftStorageKey: RECOMMENDATION_DRAFT_STORAGE_KEY,
    schemaPath: "src/mocks/sql/recommendations.schema.sql",
  };
}
