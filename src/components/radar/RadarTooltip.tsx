import type { BookItem } from "../../types/book";
import type { TooltipPosition } from "../../types/radar";

type RadarTooltipProps = {
  book: BookItem | null;
  position: TooltipPosition | null;
};

export function RadarTooltip({ book, position }: RadarTooltipProps) {
  if (!book || !position) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute z-20 w-[260px] rounded-panel border border-[#d0d8e2] bg-white p-3 shadow-[0_14px_30px_rgba(24,33,47,0.15)]"
      style={{
        left: Math.min(position.x + 22, 480),
        top: Math.max(position.y - 62, 18),
      }}
    >
      <p className="m-0 text-sm font-extrabold">{book.title}</p>
      <p className="mb-2 mt-1 text-xs text-muted">
        {book.author} · {book.recommendationScore.toFixed(1)} / 5
      </p>
      <p className="m-0 text-xs leading-5 text-[#344054]">{book.reasonShort}</p>
    </div>
  );
}
