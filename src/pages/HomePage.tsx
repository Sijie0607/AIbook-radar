import { useEffect, useMemo, useState } from "react";
import { BookDetailPanel } from "../components/radar/BookDetailPanel";
import { BookList } from "../components/radar/BookList";
import { RadarCanvas } from "../components/radar/RadarCanvas";
import { RadarFilters } from "../components/radar/RadarFilters";
import { RadarLegend } from "../components/radar/RadarLegend";
import { RadarTooltip } from "../components/radar/RadarTooltip";
import { RecommendationDrawer } from "../components/recommendation/RecommendationDrawer";
import { RecommendationRecordsModal } from "../components/recommendation/RecommendationRecordsModal";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { DOMAIN_METAS } from "../constants/domains";
import { useBookRecommendation } from "../hooks/useBookRecommendation";
import { getRadarBooks } from "../services/booksService";
import type { BookItem, DifficultyLevel, RadarDomain } from "../types/book";
import type { RadarFilterState, RadarViewState, TooltipPosition } from "../types/radar";

const domains = DOMAIN_METAS;
const domainNames: RadarDomain[] = domains.map((domain) => domain.name);
const difficulties: DifficultyLevel[] = ["入门认知", "方法实践", "深度进阶"];

const initialFilters: RadarFilterState = {
  keyword: "",
  domains: [],
  difficultyLevels: [],
  minScore: null,
};

export function HomePage() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [viewState, setViewState] = useState<RadarViewState>("loading");
  const [filters, setFilters] = useState<RadarFilterState>(initialFilters);
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const recommendation = useBookRecommendation();

  useEffect(() => {
    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    return books.filter((book) => {
      const keywordMatched =
        !keyword ||
        [book.title, book.author, book.domain, book.difficultyLevel, ...book.tags]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const domainMatched = filters.domains.length === 0 || filters.domains.includes(book.domain);
      const difficultyMatched =
        filters.difficultyLevels.length === 0 || filters.difficultyLevels.includes(book.difficultyLevel);
      const scoreMatched = filters.minScore === null || book.recommendationScore >= filters.minScore;
      return keywordMatched && domainMatched && difficultyMatched && scoreMatched;
    });
  }, [books, filters]);

  const hasFilters =
    Boolean(filters.keyword.trim()) ||
    filters.domains.length > 0 ||
    filters.difficultyLevels.length > 0 ||
    filters.minScore !== null;
  const effectiveViewState: RadarViewState =
    viewState === "loading" || viewState === "error"
      ? viewState
      : filteredBooks.length === 0
        ? "empty"
        : hasFilters
          ? "filtered"
          : "default";
  const visibleBookIds = useMemo(() => new Set(filteredBooks.map((book) => book.id)), [filteredBooks]);
  const hoveredBook = books.find((book) => book.id === hoveredBookId) ?? null;
  const selectedBook = books.find((book) => book.id === selectedBookId) ?? null;

  async function loadBooks() {
    setViewState("loading");
    try {
      const result = await getRadarBooks();
      setBooks(result);
      setViewState("default");
    } catch {
      setViewState("error");
    }
  }

  function clearFilters() {
    setFilters(initialFilters);
  }

  function handleHover(book: BookItem) {
    setHoveredBookId(book.id);
    setTooltipPosition({ x: book.x, y: book.y });
  }

  function handleLeave() {
    setHoveredBookId(null);
    setTooltipPosition(null);
  }

  function handleSelectBook(book: BookItem) {
    setSelectedBookId(book.id);
    window.requestAnimationFrame(() => {
      const card = document.querySelector<HTMLElement>(`[data-book-id="${book.id}"]`);
      card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  return (
    <main className="mx-auto w-[min(1440px,calc(100vw-56px))] px-0 py-6">
      <header className="flex items-center justify-between gap-8 pb-5 pt-3.5">
        <div className="flex items-center gap-3.5">
          <div className="grid h-[42px] w-[42px] place-items-center rounded-panel border border-[#b7d2d5] bg-[#e9f5f4] font-extrabold text-primary-dark">
            AI
          </div>
          <div>
            <h1 className="m-0 text-xl font-extrabold">AI-Native 读书雷达</h1>
            <p className="mt-1 text-[13px] text-muted">由 AI 专业人群共建的长期价值学习书单</p>
          </div>
        </div>
        <nav className="flex items-center gap-2.5" aria-label="首页入口">
          <Button variant="primary" onClick={() => recommendation.openDrawer()}>
            推荐一本书
          </Button>
          <Button>查看完整书单</Button>
          <Button>评分说明</Button>
        </nav>
      </header>

      <section className="mb-4 grid grid-cols-[1fr_auto] items-end gap-5">
        <div>
          <p className="mb-2.5 text-[13px] font-bold text-primary-dark">面向 AI 学习者与转型从业者</p>
          <h2 className="m-0 max-w-[820px] text-4xl font-extrabold leading-tight">
            用一张雷达，看清 <span className="text-primary-dark">AI 书籍的领域、阶段与长期价值</span>
          </h2>
          <p className="mt-3.5 max-w-[780px] text-[15px] leading-7 text-muted">
            每本书由 AI 专业人群推荐与解释，帮助你判断现在该读什么、为什么值得读、适合放在学习路径的哪个位置。
          </p>
        </div>
        <div className="grid w-[520px] grid-cols-3 gap-2.5">
          <MechanismCard label="点" value="一本书或长文" />
          <MechanismCard label="方向" value="八大 AI 领域" />
          <MechanismCard label="圈层" value="入门到进阶" />
        </div>
      </section>

      <section className="overflow-hidden rounded-panel border border-line bg-white/90 shadow-editorial">
        <RadarFilters
          domains={domains}
          difficulties={difficulties}
          filters={filters}
          onClear={clearFilters}
          onFiltersChange={setFilters}
        />
        <div className="grid min-h-[710px] grid-cols-[1fr_360px]">
          <div className="relative border-r border-subtle bg-[#faf8f2] p-[18px] pb-5">
            <div className="mb-2.5 flex items-center justify-between gap-4">
              <div>
                <p className="m-0 text-[15px] font-extrabold">AI 学习路径雷达</p>
                <p className="mt-1 text-[13px] text-muted">
                  {resultMeta(effectiveViewState, filteredBooks.length, books.length)}
                </p>
              </div>
              <Button onClick={loadBooks}>刷新数据</Button>
            </div>
            <div className="relative grid h-[632px] place-items-center">
              <RadarCanvas
                books={books}
                domains={domains}
                hoveredBookId={hoveredBookId}
                selectedBookId={selectedBookId}
                visibleBookIds={visibleBookIds}
                onClearSelection={() => setSelectedBookId(null)}
                onHover={handleHover}
                onLeave={handleLeave}
                onSelect={handleSelectBook}
              />
              <RadarTooltip book={hoveredBook} position={tooltipPosition} />
              {effectiveViewState === "loading" ? <Skeleton /> : null}
              {effectiveViewState === "empty" ? (
                <div className="absolute inset-x-6 bottom-7 top-[76px] z-10 grid place-items-center rounded-panel border border-dashed border-[#d8d2c4] bg-[#faf8f2]/90">
                  <div className="max-w-[420px] text-center">
                    <h3 className="mb-2 text-lg font-extrabold">当前条件下暂无书籍</h3>
                    <p className="mb-4 text-sm leading-6 text-muted">
                      可以清空筛选，或降低推荐指数条件后继续探索。
                    </p>
                    <Button variant="primary" onClick={clearFilters}>
                      清空筛选
                    </Button>
                  </div>
                </div>
              ) : null}
              {effectiveViewState === "error" ? (
                <div className="absolute inset-x-6 bottom-7 top-[76px] z-10 grid place-items-center rounded-panel border border-dashed border-[#d8d2c4] bg-[#faf8f2]/90">
                  <div className="max-w-[420px] text-center">
                    <h3 className="mb-2 text-lg font-extrabold">数据暂不可用</h3>
                    <p className="mb-4 text-sm leading-6 text-muted">
                      本地 mock service 暂时没有返回数据，请重试。
                    </p>
                    <Button variant="primary" onClick={loadBooks}>
                      重试
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <aside className="flex max-h-[760px] flex-col bg-white" aria-label="雷达说明与书籍详情">
            <RadarLegend domains={domains} />
            <BookList books={filteredBooks} selectedBookId={selectedBookId} onSelect={handleSelectBook} />
            <BookDetailPanel book={selectedBook} />
          </aside>
        </div>
      </section>

      <section className="mt-[18px] grid grid-cols-3 gap-3.5" aria-label="辅助入口">
        <EntryCard
          action="进入推荐"
          primary
          title="推荐一本书"
          text="提交你认为具有长期价值的 AI 相关书籍，并说明它适合谁读。"
          onAction={() => recommendation.openDrawer()}
        />
        <EntryCard
          action="查看书单"
          title="查看完整书单"
          text="以列表方式查看全部书籍，可按领域、阶段和推荐指数继续筛选。"
        />
        <EntryCard
          action="了解规则"
          title="评分说明"
          text="推荐指数强调专业判断和长期价值，不以短期热度作为核心依据。"
        />
      </section>

      <RecommendationDrawer
        open={recommendation.isDrawerOpen}
        draft={recommendation.draft}
        domains={domainNames}
        errors={recommendation.validationErrors}
        submitError={recommendation.submitError}
        submitting={recommendation.submitState === "submitting"}
        canSubmit={recommendation.canSubmit}
        onChange={recommendation.updateDraft}
        onClear={recommendation.clearDraft}
        onClose={recommendation.closeDrawer}
        onSubmit={() => {
          void recommendation.submitRecommendation();
        }}
      />

      <RecommendationRecordsModal
        open={recommendation.isRecordsModalOpen}
        records={recommendation.records}
        latestSubmittedId={recommendation.latestSubmittedId}
        onClose={recommendation.closeRecordsModal}
        onRecommendAgain={recommendation.recommendAgain}
      />
    </main>
  );
}

type MechanismCardProps = {
  label: string;
  value: string;
};

function MechanismCard({ label, value }: MechanismCardProps) {
  return (
    <div className="rounded-panel border border-line bg-white/80 p-3">
      <p className="m-0 text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-extrabold">{value}</p>
    </div>
  );
}

type EntryCardProps = {
  title: string;
  text: string;
  action: string;
  primary?: boolean;
  onAction?: () => void;
};

function EntryCard({ title, text, action, primary = false, onAction }: EntryCardProps) {
  return (
    <article className="rounded-panel border border-line bg-white p-4">
      <h3 className="mb-2 text-[15px] font-extrabold">{title}</h3>
      <p className="mb-3.5 text-[13px] leading-6 text-muted">{text}</p>
      <Button variant={primary ? "primary" : "secondary"} onClick={onAction}>
        {action}
      </Button>
    </article>
  );
}

function resultMeta(viewState: RadarViewState, filteredCount: number, totalCount: number) {
  if (viewState === "loading") {
    return "正在加载专业推荐数据";
  }
  if (viewState === "error") {
    return "数据暂不可用";
  }
  if (viewState === "empty") {
    return "当前筛选没有匹配结果";
  }
  if (viewState === "filtered") {
    return `当前显示 ${filteredCount} 本书 · 已应用筛选条件`;
  }
  return `显示全部 ${totalCount} 本书 · 推荐指数强调长期价值`;
}
