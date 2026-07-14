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
];

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

  return (
    <div className="grid grid-cols-[260px_1fr_auto] items-center gap-3.5 border-b border-subtle p-4">
      <input
        className="h-10 w-full rounded-panel border border-line px-3 text-sm text-ink outline-none transition focus:border-[#72aeb5] focus:ring-4 focus:ring-[#2f9f8f]/10"
        placeholder="搜索书名、作者或标签"
        type="search"
        value={filters.keyword}
        onChange={(event) => onFiltersChange({ ...filters, keyword: event.target.value })}
      />
      <div className="flex flex-wrap gap-2">
        {domains.map((domain) => (
          <FilterChip
            key={domain.name}
            active={filters.domains.includes(domain.name)}
            label={domain.name}
            onClick={() => toggleDomain(domain.name)}
          />
        ))}
        {difficulties.map((difficulty) => (
          <FilterChip
            key={difficulty}
            active={filters.difficultyLevels.includes(difficulty)}
            label={difficulty}
            onClick={() => toggleDifficulty(difficulty)}
          />
        ))}
        {scoreOptions.map((option) => (
          <FilterChip
            key={option.value}
            active={filters.minScore === option.value}
            label={option.label}
            onClick={() => toggleScore(option.value)}
          />
        ))}
      </div>
      <Button onClick={onClear}>清空筛选</Button>
    </div>
  );
}

type FilterChipProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

function FilterChip({ active, label, onClick }: FilterChipProps) {
  return (
    <button
      className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold transition ${
        active
          ? "border-primary bg-primary-soft text-primary-dark"
          : "border-line bg-white text-[#344054] hover:border-[#a7c6cb] hover:bg-[#f3fbfa]"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
