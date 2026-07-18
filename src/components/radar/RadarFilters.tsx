import type { ReactNode } from "react";
import type { DifficultyLevel, RadarDomain } from "../../types/book";
import type { DomainMeta, RadarFilterState } from "../../types/radar";
import { Button } from "../ui/Button";

type RadarFiltersProps = {
  domains: DomainMeta[];
  difficulties: DifficultyLevel[];
  filters: RadarFilterState;
  onFiltersChange: (filters: RadarFilterState) => void;
  onClear: () => void;
};

const scoreOptions = [
  { label: "4 分以上", value: 4 },
  { label: "4.5 分以上", value: 4.5 },
] as const;

export function RadarFilters({ domains, difficulties, filters, onFiltersChange, onClear }: RadarFiltersProps) {
  function toggleDomain(domain: RadarDomain) {
    const nextDomains = filters.domains.includes(domain)
      ? filters.domains.filter((item) => item !== domain)
      : [...filters.domains, domain];
    onFiltersChange({ ...filters, domains: nextDomains });
  }

  function toggleDifficulty(difficulty: DifficultyLevel) {
    const nextLevels = filters.difficultyLevels.includes(difficulty)
      ? filters.difficultyLevels.filter((item) => item !== difficulty)
      : [...filters.difficultyLevels, difficulty];
    onFiltersChange({ ...filters, difficultyLevels: nextLevels });
  }

  function toggleScore(score: number) {
    onFiltersChange({ ...filters, minScore: filters.minScore === score ? null : score });
  }

  const hasActiveFilters =
    Boolean(filters.keyword.trim()) ||
    filters.domains.length > 0 ||
    filters.difficultyLevels.length > 0 ||
    filters.minScore !== null;

  return (
    <div className="space-y-3.5 border-b border-subtle bg-white/70 p-4">
      <div className="grid grid-cols-[minmax(220px,260px)_1fr_auto] items-center gap-3.5">
        <input
          className="h-10 w-full rounded-panel border border-[#e4e7ec] bg-white px-3 text-sm text-ink outline-none transition focus:border-[#a7c6cb] focus:ring-4 focus:ring-[#2e5930]/10"
          placeholder="搜索书名、作者或标签"
          type="search"
          value={filters.keyword}
          onChange={(event) => onFiltersChange({ ...filters, keyword: event.target.value })}
        />
        <p className="m-0 text-[13px] text-muted">可同时组合领域、难度与推荐指数；同类内可多选，条件取交集。</p>
        <Button onClick={onClear} disabled={!hasActiveFilters}>
          清空筛选
        </Button>
      </div>

      <div className="grid gap-3">
        <FilterGroup
          title="书籍类型"
          description="按八大 AI 学习与实践领域筛选，可多选"
          ariaLabel="按书籍类型（领域）筛选"
        >
          {domains.map((domain) => (
            <FilterChip
              key={domain.name}
              active={filters.domains.includes(domain.name)}
              label={domain.name}
              accentColor={domain.color}
              onClick={() => toggleDomain(domain.name)}
            />
          ))}
        </FilterGroup>

        <FilterGroup
          title="学习难度"
          description="按入门认知、方法实践、深度进阶筛选，可多选"
          ariaLabel="按学习难度筛选"
        >
          {difficulties.map((difficulty) => (
            <FilterChip
              key={difficulty}
              active={filters.difficultyLevels.includes(difficulty)}
              label={difficulty}
              onClick={() => toggleDifficulty(difficulty)}
            />
          ))}
        </FilterGroup>

        <FilterGroup
          title="推荐指数"
          description="按评分高低筛选，与领域、难度可同时生效"
          ariaLabel="按推荐指数筛选"
        >
          {scoreOptions.map((option) => (
            <FilterChip
              key={option.value}
              active={filters.minScore === option.value}
              label={option.label}
              onClick={() => toggleScore(option.value)}
            />
          ))}
        </FilterGroup>
      </div>
    </div>
  );
}

type FilterGroupProps = {
  title: string;
  description: string;
  ariaLabel: string;
  children: ReactNode;
};

function FilterGroup({ title, description, ariaLabel, children }: FilterGroupProps) {
  return (
    <div className="grid grid-cols-[112px_1fr] items-start gap-3 rounded-panel border border-[#ebe6dc] bg-[#faf8f2]/80 px-3.5 py-3">
      <div className="pt-0.5">
        <p className="m-0 text-sm font-extrabold text-ink">{title}</p>
        <p className="mt-1 text-[11px] leading-4 text-muted">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
        {children}
      </div>
    </div>
  );
}

type FilterChipProps = {
  active: boolean;
  label: string;
  onClick: () => void;
  accentColor?: string;
};

function FilterChip({ active, label, onClick, accentColor }: FilterChipProps) {
  const activeStyle = active
    ? accentColor
      ? {
          borderColor: accentColor,
          color: accentColor,
          backgroundColor: `${accentColor}20`,
        }
      : {
          borderColor: "#2e5930",
          color: "#1e3f20",
          backgroundColor: "#2e593020",
        }
    : undefined;

  return (
    <button
      className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold transition ${
        active ? "" : "border-[#e4e7ec] bg-white text-[#344054] hover:border-[#a7c6cb] hover:bg-[#f3fbfa]"
      }`}
      style={activeStyle}
      onClick={onClick}
      type="button"
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
