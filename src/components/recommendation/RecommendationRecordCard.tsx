import type { BookRecommendationRecord } from "../../types/recommendation";
import { Tag } from "../ui/Tag";

type RecommendationRecordCardProps = {
  record: BookRecommendationRecord;
  highlighted?: boolean;
};

export function RecommendationRecordCard({ record, highlighted = false }: RecommendationRecordCardProps) {
  return (
    <article
      className={`rounded-panel border p-3.5 ${
        highlighted ? "border-primary bg-primary-soft" : "border-line bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="m-0 text-[15px] font-extrabold text-ink">{record.title}</h3>
          <p className="mt-1 text-sm text-muted">{record.author}</p>
        </div>
        {highlighted ? (
          <span className="shrink-0 rounded-full border border-primary bg-white px-2.5 py-1 text-xs font-semibold text-primary-dark">
            刚刚提交
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Tag>{record.domain}</Tag>
        <Tag>已记录，待后续处理</Tag>
        <span className="inline-flex items-baseline gap-1 text-sm font-extrabold text-primary-dark">
          {record.personalScore.toFixed(1)}
          <span className="text-xs font-semibold text-muted">/ 5 · 个人推荐指数</span>
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-ink">{record.reason}</p>
      <p className="mt-2 text-xs text-muted">提交时间：{formatSubmittedAt(record.submittedAt)}</p>
    </article>
  );
}

function formatSubmittedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
