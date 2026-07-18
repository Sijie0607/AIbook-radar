import type { BookRecommendationDraft, RecommendationValidationErrors } from "../../types/recommendation";
import type { RadarDomain } from "../../types/book";
import { Button } from "../ui/Button";
import { RecommendationForm } from "./RecommendationForm";

type RecommendationDrawerProps = {
  open: boolean;
  draft: BookRecommendationDraft;
  domains: RadarDomain[];
  errors: RecommendationValidationErrors;
  submitError: string | null;
  submitting: boolean;
  canSubmit: boolean;
  onChange: (next: BookRecommendationDraft) => void;
  onClear: () => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function RecommendationDrawer({
  open,
  draft,
  domains,
  errors,
  submitError,
  submitting,
  canSubmit,
  onChange,
  onClear,
  onClose,
  onSubmit,
}: RecommendationDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="关闭推荐抽屉遮罩"
        className="absolute inset-0 bg-[#18212f]/35"
        onClick={onClose}
      />
      <aside
        className="relative z-10 flex h-full w-[min(460px,100vw)] flex-col border-l border-line bg-white shadow-editorial"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recommendation-drawer-title"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-subtle px-5 py-4">
          <div>
            <h2 id="recommendation-drawer-title" className="m-0 text-lg font-extrabold text-ink">
              推荐一本 AI 书籍
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-muted">
              提交后写入虚拟表 book_recommendations，不会立即进入正式雷达
            </p>
          </div>
          <Button type="button" variant="ghost" onClick={onClose} aria-label="关闭推荐抽屉">
            关闭
          </Button>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">
          <RecommendationForm
            draft={draft}
            domains={domains}
            errors={errors}
            submitError={submitError}
            submitting={submitting}
            canSubmit={canSubmit}
            onChange={onChange}
            onClear={onClear}
            onCancel={onClose}
            onSubmit={onSubmit}
          />
        </div>
      </aside>
    </div>
  );
}
