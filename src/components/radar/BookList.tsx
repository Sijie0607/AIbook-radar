import type { BookItem } from "../../types/book";
import { getDomainColor, getDomainSoftBackground } from "../../constants/domains";

type BookListProps = {
  books: BookItem[];
  selectedBookId: string | null;
  onSelect: (book: BookItem) => void;
};

export function BookList({ books, selectedBookId, onSelect }: BookListProps) {
  if (books.length === 0) {
    return (
      <section className="border-b border-subtle px-4 py-3" aria-label="筛选结果列表">
        <p className="m-0 text-[13px] text-muted">当前筛选下暂无书籍</p>
      </section>
    );
  }

  return (
    <section className="max-h-[220px] overflow-y-auto border-b border-subtle" aria-label="筛选结果列表">
      <ul className="m-0 list-none p-0">
        {books.map((book) => {
          const color = getDomainColor(book.domain);
          const selected = selectedBookId === book.id;
          return (
            <li key={book.id}>
              <button
                type="button"
                data-book-id={book.id}
                onClick={() => onSelect(book)}
                className={`flex w-full items-stretch gap-0 border-b border-subtle text-left transition last:border-b-0 ${
                  selected ? "bg-[#f3f1ea]" : "bg-white hover:bg-[#f7f5ef]"
                }`}
              >
                <span className="w-1 shrink-0 self-stretch" style={{ backgroundColor: color }} aria-hidden />
                <span className="flex min-w-0 flex-1 flex-col gap-1.5 px-3 py-2.5">
                  <span className="flex items-start justify-between gap-2">
                    <span className="truncate text-[13px] font-extrabold text-ink">{book.title}</span>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        color,
                        backgroundColor: getDomainSoftBackground(book.domain),
                        border: `1px solid ${color}`,
                      }}
                    >
                      {book.difficultyLevel}
                    </span>
                  </span>
                  <span className="truncate text-[11px] text-muted">
                    {book.author} · {book.recommendationScore.toFixed(1)} / 5 · {book.domain}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
