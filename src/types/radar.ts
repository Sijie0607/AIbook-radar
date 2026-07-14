import type { DifficultyLevel, RadarDomain } from "./book";

export type DomainMeta = {
  name: RadarDomain;
  color: string;
};

export type RadarFilterState = {
  keyword: string;
  domains: RadarDomain[];
  difficultyLevels: DifficultyLevel[];
  minScore: number | null;
};

export type RadarViewState = "loading" | "default" | "filtered" | "empty" | "error";

export type BookDetailPanelState = {
  selectedBookId: string | null;
  hoveredBookId: string | null;
};

export type TooltipPosition = {
  x: number;
  y: number;
};
