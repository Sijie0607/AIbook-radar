import type { BookItem } from "../../types/book";
import type { ReactNode } from "react";
import { getDomainColor, getDomainSoftBackground } from "../../constants/domains";
import { EmptyState } from "../ui/EmptyState";
import { ScoreBadge } from "../ui/ScoreBadge";
import { Tag } from "../ui/Tag";

type BookDetailPanelProps = {
  book: BookItem | null;
  domainColor?: string;
};

export function BookDetailPanel({ book, domainColor }: BookDetailPanelProps) {
  if (!book) {
    return (
      <section className="flex-1 p-[18px]">
        <EmptyState
          title="选择一本书查看推荐理由"
          description="Hover 可以快速扫读，Click 后会在这里固定展示适合人群、阅读收获和长期价值。"
        />
      </section>
    );
  }

  const color = domainColor ?? getDomainColor(book.domain);

  return (
    <section className="flex flex-1 overflow-hidden">
      <div className="w-1 shrink-0 self-stretch" style={{ backgroundColor: color }} aria-hidden />
      <div className="flex-1 overflow-y-auto p-[18px]">
        <div className="grid grid-cols-[82px_1fr] items-start gap-3.5">
          <div
            className="h-[110px] w-[82px] rounded-md shadow-[inset_0_-26px_0_rgba(0,0,0,0.06)]"
            style={{ backgroundColor: book.cover }}
          />
          <div>
            <div className="flex items-start justify-between gap-2">
              <h2 className="m-0 text-xl font-extrabold leading-snug">{book.title}</h2>
              <span
                className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  color,
                  backgroundColor: getDomainSoftBackground(book.domain),
                  border: `1px solid ${color}`,
                }}
              >
                {book.difficultyLevel}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-5 text-muted">
              {book.subtitle}
              <br />
              {book.author}
            </p>
            <div className="mt-3">
              <ScoreBadge score={book.recommendationScore} votesCount={book.votesCount} />
            </div>
          </div>
        </div>

        <div className="my-4 flex flex-wrap gap-2">
          <Tag>{book.domain}</Tag>
          <Tag>{contentTypeLabel(book.contentType)}</Tag>
        </div>

        <DetailBlock title="推荐理由">
          <p>{book.reasonFull}</p>
        </DetailBlock>
        <DetailBlock title="适合人群">
          <p>{book.fitFor}</p>
        </DetailBlock>
        <DetailBlock title="阅读收获">
          <ul className="m-0 list-disc pl-5">
            {book.takeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </DetailBlock>
        <DetailBlock title="标签">
          <div className="flex flex-wrap gap-2">
            {book.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </DetailBlock>
        <DetailBlock title="专业来源">
          <p>{book.sourceNote}</p>
        </DetailBlock>
      </div>
    </section>
  );
}

type DetailBlockProps = {
  title: string;
  children: ReactNode;
};

function DetailBlock({ title, children }: DetailBlockProps) {
  return (
    <div className="mt-3.5 border-t border-subtle pt-3.5 text-[13px] leading-6 text-[#475467]">
      <h3 className="mb-2 text-sm font-extrabold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function contentTypeLabel(type: BookItem["contentType"]) {
  const labels: Record<BookItem["contentType"], string> = {
    book: "书籍",
    article: "长文",
    report: "报告",
  };
  return labels[type];
}
