import type { RadarDomain } from "./book";

export type BookRecommendationDraft = {
  title: string;
  author: string;
  domain: RadarDomain | "";
  personalScore: number | null;
  reason: string;
};

export type BookRecommendationRecord = {
  id: string;
  title: string;
  author: string;
  domain: RadarDomain;
  personalScore: number;
  reason: string;
  status: "recorded";
  submittedAt: string;
};

export type RecommendationSubmitState = "idle" | "editing" | "submitting" | "success" | "error";

export type RecommendationValidationErrors = Partial<{
  title: string;
  author: string;
  domain: string;
  personalScore: string;
  reason: string;
  duplicate: string;
}>;

export function createEmptyRecommendationDraft(): BookRecommendationDraft {
  return {
    title: "",
    author: "",
    domain: "",
    personalScore: null,
    reason: "",
  };
}
