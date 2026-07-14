import type { DomainMeta } from "../../types/radar";

type RadarLegendProps = {
  domains: DomainMeta[];
};

export function RadarLegend({ domains }: RadarLegendProps) {
  return (
    <section className="border-b border-subtle p-4">
      <h2 className="text-[15px] font-extrabold">如何阅读这张雷达</h2>
      <div className="mt-3.5 grid gap-2.5">
        <div className="flex items-center gap-2.5 text-sm text-[#475467]">
          <span className="h-3 w-3 rounded-full bg-primary" />
          每个点代表一本值得阅读的内容
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[#475467]">
          <span className="h-3.5 w-3.5 rounded-[3px] border-l-[5px] border-primary bg-[#e7f0f8]" />
          颜色与方位表示八大领域
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[#475467]">
          <span className="h-[22px] w-[22px] rounded-full border border-[#9aa7b7]" />
          内外圈表示阅读阶段
        </div>
      </div>
      <div className="mt-3.5 grid grid-cols-2 gap-2">
        {domains.map((domain) => (
          <div key={domain.name} className="flex min-w-0 items-center gap-2 text-xs text-[#344054]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: domain.color }} />
            <span>{domain.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
