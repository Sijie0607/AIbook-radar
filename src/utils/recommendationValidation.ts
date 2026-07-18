import { isDuplicateRecommendation } from "../services/recommendationsService";
import type {
  BookRecommendationDraft,
  BookRecommendationRecord,
  RecommendationValidationErrors,
} from "../types/recommendation";
import type { RadarDomain } from "../types/book";

const RADAR_DOMAINS: RadarDomain[] = [
  "AI 工程",
  "产品方法论",
  "Agent 设计",
  "组织变革",
  "数据智能",
  "商业落地",
  "伦理治理",
  "前沿趋势",
];

export function isRadarDomain(value: string): value is RadarDomain {
  return (RADAR_DOMAINS as string[]).includes(value);
}

export function validateRecommendationDraft(
  draft: BookRecommendationDraft,
  records: BookRecommendationRecord[],
): RecommendationValidationErrors {
  const errors: RecommendationValidationErrors = {};
  const title = draft.title.trim();
  const author = draft.author.trim();
  const reasonLength = draft.reason.trim().length;

  if (!title) {
    errors.title = "请填写书名";
  }
  if (!author) {
    errors.author = "请填写作者";
  }
  if (!draft.domain || !isRadarDomain(draft.domain)) {
    errors.domain = "请选择一个最匹配的领域";
  }
  if (draft.personalScore === null || draft.personalScore < 1 || draft.personalScore > 5) {
    errors.personalScore = "请选择你的个人推荐指数";
  }
  if (reasonLength < 30) {
    errors.reason = "请补充长期价值、适合人群或阅读收获";
  } else if (reasonLength > 300) {
    errors.reason = "推荐理由过长，请压缩到 300 字以内";
  }
  if (title && author && isDuplicateRecommendation(title, author, records)) {
    errors.duplicate = "你已经推荐过这本书，本次无需重复提交";
  }

  return errors;
}

export function isRecommendationDraftSubmittable(
  draft: BookRecommendationDraft,
  records: BookRecommendationRecord[],
): boolean {
  return Object.keys(validateRecommendationDraft(draft, records)).length === 0;
}
