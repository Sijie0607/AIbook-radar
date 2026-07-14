import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
};

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex rounded-full border border-line bg-[#f9fafb] px-2.5 py-1 text-xs font-semibold text-[#475467]">
      {children}
    </span>
  );
}
