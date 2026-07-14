type ScoreBadgeProps = {
  score: number;
  votesCount?: number;
};

export function ScoreBadge({ score, votesCount }: ScoreBadgeProps) {
  return (
    <span className="inline-flex items-baseline gap-1 font-extrabold text-primary-dark">
      {score.toFixed(1)}
      <span className="text-xs font-semibold text-muted">/ 5{votesCount ? ` · ${votesCount} 位专业推荐` : ""}</span>
    </span>
  );
}
