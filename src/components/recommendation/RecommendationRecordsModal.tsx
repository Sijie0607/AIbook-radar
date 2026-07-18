import type { BookRecommendationRecord } from "../../types/recommendation";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { RecommendationRecordCard } from "./RecommendationRecordCard";

type RecommendationRecordsModalProps = {
  open: boolean;
  records: BookRecommendationRecord[];
  latestSubmittedId: string | null;
  onClose: () => void;
  onRecommendAgain: () => void;
};

export function RecommendationRecordsModal({
  open,
  records,
  latestSubmittedId,
  onClose,
  onRecommendAgain,
}: RecommendationRecordsModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        aria-label="关闭推荐记录弹窗遮罩"
        className="absolute inset-0 bg-[#18212f]/40"
        onClick={onClose}
      />
      <section
        className="relative z-10 flex max-h-[min(820px,90vh)] w-[min(640px,100%)] flex-col overflow-hidden rounded-panel border border-line bg-white shadow-editorial"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recommendation-records-title"
      >
        <header className="border-b border-subtle px-5 py-4">
          <h2 id="recommendation-records-title" className="m-0 text-lg font-extrabold text-ink">
            推荐已记录
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-muted">
            这条推荐不会立即进入正式雷达，后续会作为候选记录处理。
          </p>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {records.length === 0 ? (
            <EmptyState title="暂无推荐记录" description="提交推荐后，这里会展示全部记录。" />
          ) : (
            records.map((record) => (
              <RecommendationRecordCard
                key={record.id}
                record={record}
                highlighted={record.id === latestSubmittedId}
              />
            ))
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-subtle px-5 py-4">
          <Button type="button" onClick={onClose}>
            关闭
          </Button>
          <Button type="button" variant="primary" onClick={onRecommendAgain}>
            再推荐一本
          </Button>
        </footer>
      </section>
    </div>
  );
}
