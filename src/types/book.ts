export type RadarDomain =
  | "AI 工程"
  | "产品方法论"
  | "Agent 设计"
  | "组织变革"
  | "数据智能"
  | "商业落地"
  | "伦理治理"
  | "前沿趋势";

export type DifficultyLevel = "入门认知" | "方法实践" | "深度进阶";

export type ContentType = "book" | "article" | "report";

export type BookItem = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  cover: string;
  domain: RadarDomain;
  difficultyLevel: DifficultyLevel;
  sectorIndex: number;
  ringIndex: number;
  x: number;
  y: number;
  recommendationScore: number;
  reasonShort: string;
  reasonFull: string;
  fitFor: string;
  takeaways: string[];
  contentType: ContentType;
  tags: string[];
  votesCount: number;
  sourceNote: string;
};
