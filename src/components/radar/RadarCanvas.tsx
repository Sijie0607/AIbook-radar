import type { BookItem } from "../../types/book";
import type { DomainMeta } from "../../types/radar";
import { getDomainColor } from "../../constants/domains";

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
const radarRadius = 260;
const ringRadii = [110, 190, 260];
const ringLabels = [
  { text: "入门认知", x: 400, y: 292 },
  { text: "方法实践", x: 480, y: 292 },
  { text: "深度进阶", x: 568, y: 292 },
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
      width="800"
      height="600"
      viewBox="0 0 800 600"
      role="img"
      aria-label="AI 读书雷达图"
      className="max-w-full"
      onClick={onClearSelection}
    >
      <defs>
        <radialGradient id="nebula-core-green" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e3f20" stopOpacity="0.75" />
          <stop offset="35%" stopColor="#2e5930" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#4c7c4f" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#faf8f2" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle
        cx={center.x}
        cy={center.y}
        r={245}
        fill="url(#nebula-core-green)"
        opacity={0.4}
        className="pointer-events-none"
      />
      <circle
        cx={center.x}
        cy={center.y}
        r={145}
        fill="url(#nebula-core-green)"
        className="pointer-events-none origin-center animate-pulse-core-green"
        style={{ transformOrigin: `${center.x}px ${center.y}px` }}
      />
      <circle
        cx={center.x - 30}
        cy={center.y + 25}
        r={115}
        fill="url(#nebula-core-green)"
        className="pointer-events-none animate-pulse-core-green"
        style={{
          transformOrigin: `${center.x - 30}px ${center.y + 25}px`,
          animationDelay: "-4.5s",
        }}
      />

      {ringRadii.map((radius) => (
        <circle
          key={radius}
          cx={center.x}
          cy={center.y}
          r={radius}
          className="pointer-events-none fill-none stroke-[#d8d2c4]"
          strokeWidth={1}
        />
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
            className="pointer-events-none stroke-[#e0d9cb]"
            strokeWidth={1}
          />
        );
      })}

      {domains.map((domain, index) => {
        const angle = toRadians(-68 + index * 45);
        const labelRadius = 292;
        return (
          <text
            key={domain.name}
            x={center.x + Math.cos(angle) * labelRadius}
            y={center.y + Math.sin(angle) * labelRadius}
            textAnchor="middle"
            className="fill-[#5c564c] text-xs font-bold"
          >
            {domain.name}
          </text>
        );
      })}

      {ringLabels.map((label) => (
        <text key={label.text} x={label.x} y={label.y} className="fill-[#8a8376] text-xs font-semibold">
          {label.text}
        </text>
      ))}

      {books.map((book) => {
        const visible = visibleBookIds.has(book.id);
        const hovered = hoveredBookId === book.id;
        const selected = selectedBookId === book.id;
        const color = getDomainColor(book.domain);
        const nodeRadius = hovered || selected ? 12 : 4;

        return (
          <g
            key={book.id}
            className={`cursor-pointer transition-opacity ${visible ? "opacity-100" : "opacity-15"}`}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(book);
            }}
            onFocus={() => onHover(book)}
            onMouseEnter={() => onHover(book)}
            onMouseLeave={onLeave}
          >
            {(hovered || selected) && (
              <circle
                cx={book.x}
                cy={book.y}
                r={12}
                fill={color}
                opacity={0.3}
                className="pointer-events-none transition-all duration-200"
              />
            )}
            {selected ? (
              <>
                <circle
                  cx={book.x}
                  cy={book.y}
                  r={18}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  className="pointer-events-none animate-pulse-select-ring"
                />
                <circle
                  cx={book.x}
                  cy={book.y}
                  r={14}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={1}
                  opacity={0.7}
                  className="pointer-events-none animate-pulse-select-ring"
                  style={{ animationDelay: "-1.2s" }}
                />
              </>
            ) : null}
            <circle
              cx={book.x}
              cy={book.y}
              r={nodeRadius}
              fill={color}
              tabIndex={0}
              aria-label={`${book.title}，${book.domain}，${book.difficultyLevel}`}
              className="stroke-white stroke-[1.5] transition-all duration-200"
            />
          </g>
        );
      })}
    </svg>
  );
}

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}
