import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-panel border border-dashed border-[#cfd7e2] p-5 text-center text-muted">
      <div>
        <h3 className="mb-2 text-base font-bold text-ink">{title}</h3>
        <p className="mx-auto mb-4 max-w-[300px] text-sm leading-6">{description}</p>
        {action}
      </div>
    </div>
  );
}
