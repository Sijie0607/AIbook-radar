import type { BookItem } from "../../types/book";
import type { DomainMeta } from "../../types/radar";

type RadarCanvasProps = {
  books: BookItem[];
  visibleBookIds: Set<string>;
  domains: DomainMeta[];
  hoveredBookId: string | null;
  selectedBookId: string | null;
  onHover: (book: BookItem) => void;
  onLeave: () => void;
  onSelect: (book: BookItem) => void;
  onClearSelection: () => void;
};

const center = { x: 380, y: 300 };
const radarRadius = 250;
const ringRadii = [86, 166, 250];
const ringLabels = [
  { text: "入门认知", x: 392, y: 292 },
  { text: "方法实践", x: 468, y: 292 },
  { text: "深度进阶", x: 558, y: 292 },
];

export function RadarCanvas({
  books,
  visibleBookIds,
  domains,
  hoveredBookId,
  selectedBookId,
  onHover,
  onLeave,
  onSelect,
  onClearSelection,
}: RadarCanvasProps) {
  return (
    <svg
      width="760"
      height="600"
      viewBox="0 0 760 600"
      role="img"
      aria-label="AI 读书雷达图"
      onClick={onClearSelection}
    >
      {ringRadii.map((radius) => (
        <circle key={radius} cx={center.x} cy={center.y} r={radius} className="fill-none stroke-[#ccd5df]" />
      ))}

      {Array.from({ length: 8 }, (_, index) => {
        const angle = toRadians(-90 + index * 45);
        return (
          <line
            key={index}
            x1={center.x}
            y1={center.y}
            x2={center.x + Math.cos(angle) * radarRadius}
            y2={center.y + Math.sin(angle) * radarRadius}
            className="stroke-[#ccd5df]"
          />
        );
      })}

      {domains.map((domain, index) => {
        const angle = toRadians(-68 + index * 45);
        const labelRadius = 286;
        return (
          <text
            key={domain.name}
            x={center.x + Math.cos(angle) * labelRadius}
            y={center.y + Math.sin(angle) * labelRadius}
            textAnchor="middle"
            className="fill-[#475467] text-xs font-bold"
          >
            {domain.name}
          </text>
        );
      })}

      {ringLabels.map((label) => (
        <text key={label.text} x={label.x} y={label.y} className="fill-muted text-xs font-semibold">
          {label.text}
        </text>
      ))}

      {books.map((book) => {
        const visible = visibleBookIds.has(book.id);
        const hovered = hoveredBookId === book.id;
        const selected = selectedBookId === book.id;
        const radius = 6 + (book.recommendationScore - 3.8) * 3.8;
        return (
          <circle
            key={book.id}
            cx={book.x}
            cy={book.y}
            r={radius}
            fill={domainColor(book.domain, domains)}
            tabIndex={0}
            aria-label={`${book.title}，${book.domain}，${book.difficultyLevel}`}
            className={`cursor-pointer stroke-white stroke-2 transition ${
              visible ? "opacity-100" : "opacity-15"
            } ${hovered || selected ? "stroke-ink stroke-[3px]" : ""}`}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(book);
            }}
            onFocus={() => onHover(book)}
            onMouseEnter={() => onHover(book)}
            onMouseLeave={onLeave}
          />
        );
      })}
    </svg>
  );
}

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

function domainColor(domainName: string, domains: DomainMeta[]) {
  return domains.find((domain) => domain.name === domainName)?.color ?? "#176b87";
}
