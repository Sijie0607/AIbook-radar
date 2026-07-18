import type { RadarDomain } from "../../types/book";
import type { BookRecommendationDraft, BookRecommendationRecord } from "../../types/recommendation";

/**
 * 与 src/mocks/sql/recommendations.schema.sql 中 book_recommendations 列一一对应。
 */
export type BookRecommendationRow = {
  id: string;
  title: string;
  author: string;
  domain: RadarDomain;
  personal_score: number;
  reason: string;
  status: "recorded";
  submitted_at: string;
  title_author_key: string;
};

/**
 * 与 book_recommendation_drafts 列一一对应。
 */
export type BookRecommendationDraftRow = {
  id: string;
  title: string;
  author: string;
  domain: string;
  personal_score: number | null;
  reason: string;
  updated_at: string;
};

export const RECOMMENDATION_TABLE = "book_recommendations" as const;
export const RECOMMENDATION_DRAFT_TABLE = "book_recommendation_drafts" as const;
export const DRAFT_ROW_ID = "local_default" as const;

export const RECOMMENDATION_STORAGE_KEY = "ai-reading-radar:db.book_recommendations";
export const RECOMMENDATION_DRAFT_STORAGE_KEY = "ai-reading-radar:db.book_recommendation_drafts";

export function toRecommendationRecord(row: BookRecommendationRow): BookRecommendationRecord {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    domain: row.domain,
    personalScore: row.personal_score,
    reason: row.reason,
    status: row.status,
    submittedAt: row.submitted_at,
  };
}

export function toRecommendationDraft(row: BookRecommendationDraftRow): BookRecommendationDraft {
  return {
    title: row.title,
    author: row.author,
    domain: (row.domain as BookRecommendationDraft["domain"]) || "",
    personalScore: row.personal_score,
    reason: row.reason,
  };
}

export function fromRecommendationDraft(
  draft: BookRecommendationDraft,
  updatedAt: string = new Date().toISOString(),
): BookRecommendationDraftRow {
  return {
    id: DRAFT_ROW_ID,
    title: draft.title,
    author: draft.author,
    domain: draft.domain,
    personal_score: draft.personalScore,
    reason: draft.reason,
    updated_at: updatedAt,
  };
}
