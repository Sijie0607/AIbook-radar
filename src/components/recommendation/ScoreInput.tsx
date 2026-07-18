type ScoreInputProps = {
  value: number | null;
  disabled?: boolean;
  onChange: (score: number) => void;
};

const SCORES = [1, 2, 3, 4, 5] as const;

export function ScoreInput({ value, disabled = false, onChange }: ScoreInputProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="m-0 text-sm font-semibold text-ink">个人推荐指数</p>
        <p className="m-0 text-xs text-muted">非正式雷达评分</p>
      </div>
      <div className="grid grid-cols-5 gap-2" role="group" aria-label="个人推荐指数">
        {SCORES.map((score) => {
          const selected = value === score;
          return (
            <button
              key={score}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onChange(score)}
              className={`min-h-11 rounded-panel border text-sm font-bold transition ${
                selected
                  ? "border-primary bg-primary text-white"
                  : "border-line bg-white text-ink hover:border-[#a7c6cb] hover:bg-[#f3fbfa]"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {score}
            </button>
          );
        })}
      </div>
    </div>
  );
}
