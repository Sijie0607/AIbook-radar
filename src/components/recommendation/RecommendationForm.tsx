import type { ReactNode } from "react";
import type { BookRecommendationDraft, RecommendationValidationErrors } from "../../types/recommendation";
import type { RadarDomain } from "../../types/book";
import { Button } from "../ui/Button";
import { ScoreInput } from "./ScoreInput";

type RecommendationFormProps = {
  draft: BookRecommendationDraft;
  domains: RadarDomain[];
  errors: RecommendationValidationErrors;
  submitError: string | null;
  submitting: boolean;
  canSubmit: boolean;
  onChange: (next: BookRecommendationDraft) => void;
  onClear: () => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function RecommendationForm({
  draft,
  domains,
  errors,
  submitError,
  submitting,
  canSubmit,
  onChange,
  onClear,
  onCancel,
  onSubmit,
}: RecommendationFormProps) {
  const reasonLength = draft.reason.trim().length;

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {submitError ? (
          <div className="rounded-panel border border-[#f0c7c0] bg-[#fff7f5] px-3 py-2.5 text-sm text-[#9b3b2e]">
            {submitError}
          </div>
        ) : null}
        {errors.duplicate ? (
          <div className="rounded-panel border border-[#f0c7c0] bg-[#fff7f5] px-3 py-2.5 text-sm text-[#9b3b2e]">
            {errors.duplicate}
          </div>
        ) : null}

        <Field label="书名" error={errors.title}>
          <input
            value={draft.title}
            disabled={submitting}
            onChange={(event) => onChange({ ...draft, title: event.target.value })}
            className={inputClassName(Boolean(errors.title))}
            placeholder="例如：Building LLM Applications"
          />
        </Field>

        <Field label="作者" error={errors.author}>
          <input
            value={draft.author}
            disabled={submitting}
            onChange={(event) => onChange({ ...draft, author: event.target.value })}
            className={inputClassName(Boolean(errors.author))}
            placeholder="作者姓名"
          />
        </Field>

        <Field label="所属领域" error={errors.domain}>
          <div className="grid grid-cols-2 gap-2">
            {domains.map((domain) => {
              const selected = draft.domain === domain;
              return (
                <button
                  key={domain}
                  type="button"
                  disabled={submitting}
                  aria-pressed={selected}
                  onClick={() => onChange({ ...draft, domain })}
                  className={`min-h-10 rounded-panel border px-3 text-left text-sm font-semibold transition ${
                    selected
                      ? "border-primary bg-primary-soft text-primary-dark"
                      : "border-line bg-white text-ink hover:border-[#a7c6cb]"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {domain}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="" error={errors.personalScore}>
          <ScoreInput
            value={draft.personalScore}
            disabled={submitting}
            onChange={(personalScore) => onChange({ ...draft, personalScore })}
          />
        </Field>

        <Field label="推荐理由" error={errors.reason}>
          <textarea
            value={draft.reason}
            disabled={submitting}
            rows={7}
            onChange={(event) => onChange({ ...draft, reason: event.target.value })}
            className={`${inputClassName(Boolean(errors.reason))} resize-none leading-6`}
            placeholder="请说明这本书为什么具有长期价值，适合什么阶段的人阅读，以及它能帮助解决什么学习问题。"
          />
          <div className="mt-1.5 flex items-center justify-between gap-3 text-xs text-muted">
            <span>需体现长期价值、适合人群与学习问题（30-300 字）</span>
            <span className={reasonLength > 300 ? "text-[#9b3b2e]" : ""}>{reasonLength} / 300</span>
          </div>
        </Field>
      </div>

      <footer className="shrink-0 border-t border-subtle bg-white px-5 py-4 shadow-[0_-8px_24px_rgba(24,33,47,0.06)]">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Button type="button" variant="ghost" disabled={submitting} onClick={onClear}>
            清空表单
          </Button>
          <Button type="button" disabled={submitting} onClick={onCancel}>
            取消
          </Button>
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          className={`w-full min-h-11 text-base ${!canSubmit && !submitting ? "opacity-80" : ""}`}
          aria-label="提交推荐"
        >
          {submitting ? "提交中…" : "提交推荐"}
        </Button>
        {!canSubmit && !submitting ? (
          <p className="mt-2 text-center text-xs text-muted">请先补全书名、作者、领域、个人推荐指数与 30-300 字理由</p>
        ) : null}
      </footer>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-semibold text-ink">{label}</span> : null}
      {children}
      {error ? <span className="mt-1.5 block text-xs text-[#9b3b2e]">{error}</span> : null}
    </label>
  );
}

function inputClassName(hasError: boolean): string {
  return `w-full rounded-panel border px-3 py-2.5 text-sm text-ink outline-none transition ${
    hasError
      ? "border-[#e2a79c] bg-[#fff9f8] focus:border-[#c97868]"
      : "border-line bg-white focus:border-primary"
  } disabled:cursor-not-allowed disabled:opacity-60`;
}
