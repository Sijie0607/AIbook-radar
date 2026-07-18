import type { BookItem } from "../../types/book";
import type { TooltipPosition } from "../../types/radar";
import { getDomainColor } from "../../constants/domains";

type RadarTooltipProps = {
  book: BookItem | null;
  position: TooltipPosition | null;
};

export function RadarTooltip({ book, position }: RadarTooltipProps) {
  if (!book || !position) {
    return null;
  }

  const color = getDomainColor(book.domain);

  return (
    <div
      className="pointer-events-none absolute z-20 w-[280px] rounded-panel border border-[#e4e7ec] bg-white p-3 shadow-[0_14px_30px_rgba(24,33,47,0.12)]"
      style={{
        left: Math.min(position.x + 22, 500),
        top: Math.max(position.y - 72, 18),
        borderLeftWidth: 3,
        borderLeftColor: color,
      }}
    >
      <p className="m-0 text-sm font-extrabold text-ink">{book.title}</p>
      <p className="mb-1.5 mt-1 text-xs text-muted">
        {book.author} · {book.recommendationScore.toFixed(1)} / 5
      </p>
      <p className="m-0 text-[11px] font-semibold" style={{ color }}>
        {book.domain}
      </p>
      <p className="mb-0 mt-2 text-xs leading-5 text-[#344054]">{book.reasonShort}</p>
    </div>
  );
}
