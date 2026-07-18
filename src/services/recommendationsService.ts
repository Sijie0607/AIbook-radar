import type { BookRecommendationDraft, BookRecommendationRecord } from "../types/recommendation";
import { createEmptyRecommendationDraft } from "../types/recommendation";

const RECORDS_KEY = "ai-reading-radar:recommendation-records";
const DRAFT_KEY = "ai-reading-radar:recommendation-draft";

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
    throw new Error("本地存储不可用");
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function normalizeRecommendationKey(title: string, author: string): string {
  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
  return `${normalize(title)}::${normalize(author)}`;
}

export function getRecommendationRecords(): BookRecommendationRecord[] {
  const records = readJson<BookRecommendationRecord[]>(RECORDS_KEY, []);
  return [...records].sort(
    (left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime(),
  );
}

export function saveRecommendationRecord(record: BookRecommendationRecord): BookRecommendationRecord[] {
  const records = getRecommendationRecords();
  const next = [record, ...records.filter((item) => item.id !== record.id)];
  writeJson(RECORDS_KEY, next);
  return next;
}

export function getRecommendationDraft(): BookRecommendationDraft {
  return readJson<BookRecommendationDraft>(DRAFT_KEY, createEmptyRecommendationDraft());
}

export function saveRecommendationDraft(draft: BookRecommendationDraft): void {
  writeJson(DRAFT_KEY, draft);
}

export function clearRecommendationDraft(): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.removeItem(DRAFT_KEY);
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
