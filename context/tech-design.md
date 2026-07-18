# AI-Native 读书雷达｜技术设计基线

## 1. 技术栈

当前项目采用以下技术栈：

| 分类 | 技术 |
|---|---|
| 框架 | React 18 |
| 构建工具 | Vite |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 路由 | React Router v6 |
| 数据来源 | 本地 Mock JSON + mock service 函数 |

技术选型以当前代码事实为准，不在本文档中讨论替代方案。

## 2. 工程入口与路由

- `index.html` 是 Vite 页面入口，挂载 DOM 节点为 `#root`。
- `src/main.tsx` 创建 React 根节点，并通过 `createBrowserRouter` 注册路由。
- 当前只有一个路由：`/`。
- `/` 路由对应页面组件：`src/pages/HomePage.tsx`。

当前阶段只实现首页，不包含二级页面路由。

### 2.1 唯一展示页面与推荐前端落点（已确认）

当前产品只有一个可访问、可展示的页面：`index.html`（Vite 壳）→ `src/main.tsx` → `/` 路由 → `src/pages/HomePage.tsx`。

| 文件 / 目录 | 角色 | 是否承载业务实现 |
|---|---|---|
| `index.html` | Vite 壳：挂载 `#root` 并加载 `src/main.tsx` | 否，仅入口 |
| `archive/homepage-prototype.html` | 迁移前静态原型，已归档，不再作为可访问页面 | 否，不维护、不同步新功能 |
| `src/pages/HomePage.tsx` | `/` 路由页面，雷达首页宿主 | 是，作为推荐入口接入点 |
| `src/components/` + `src/services/` + `src/types/` | 推荐抽屉、表单、记录弹窗、service、类型 | 是，新增推荐相关模块 |

启动链路：

```text
index.html → src/main.tsx → src/pages/HomePage.tsx → radar/ui 组件 + services
```

原型文件处理原则（已确认，避免与正式页面并存造成混淆）：

- `homepage-prototype.html` 已移动到 `archive/homepage-prototype.html`，不再作为可直接打开测试的页面；
- 归档说明见 `archive/README.md`；
- 后续新功能（包括推荐能力）只在 `src/` 中实现，不回补进归档原型。

推荐功能接入时：

- 在 `HomePage` 接线顶部「推荐一本书」与底部「进入推荐」入口；
- 推荐状态与雷达筛选 / Hover / 选中状态隔离；
- 不把推荐表单或业务逻辑写进 `index.html`；
- 不改正式雷达 `BookItem` 与 `books.mock.json`。

产品与交互细则见 `context/features/book-recommendation.md`。

## 3. 目录分层约束

| 目录 | 职责 |
|---|---|
| `src/pages/` | 页面级容器，负责数据加载、页面状态和业务组件组合 |
| `src/components/radar/` | 雷达图首页相关业务组件 |
| `src/components/recommendation/` | 书籍推荐抽屉、表单、记录弹窗等业务组件（规划落点） |
| `src/components/ui/` | 通用基础 UI 组件 |
| `src/services/` | mock service 与未来 API 抽象 |
| `src/types/` | 业务实体、筛选器、视图状态等 TypeScript 类型 |
| `src/mocks/` | 首版本地 mock 数据 |

组件实现应保持边界清晰，避免把雷达图、筛选器、详情面板、图例写成单一巨型组件。

## 4. 数据流

当前首页数据流如下：

1. `HomePage` 首次渲染后调用 `getRadarBooks()`。
2. `getRadarBooks()` 位于 `src/services/booksService.ts`。
3. `booksService.ts` 从 `src/mocks/books.mock.json` 读取本地 mock 数据。
4. `HomePage` 将书籍数据、筛选状态、hover 状态、选中状态传给业务组件。
5. 业务组件只负责展示与交互回调，不直接读取 mock 数据。

该结构为未来从 mock service 迁移到真实 API 保留边界：优先替换 `services/` 层，不应让视图组件直接绑定远端接口或静态数据。

## 5. 类型设计

核心类型位于 `src/types/`：

| 类型 | 作用 |
|---|---|
| `BookItem` | 首页书籍或文字内容的完整数据结构 |
| `RadarDomain` | 八大主题领域枚举 |
| `DifficultyLevel` | 三层阅读难度枚举 |
| `ContentType` | 内容类型枚举 |
| `RadarFilterState` | 首页筛选状态 |
| `RadarViewState` | 页面视图状态 |
| `BookDetailPanelState` | 详情面板相关状态 |
| `TooltipPosition` | Hover 浮层坐标 |

TypeScript 使用 `strict` 模式，禁止在业务代码中滥用 `any`。新增数据结构时应先补充类型，再实现页面逻辑。

## 6. 首页组件边界

| 组件 | 当前职责 |
|---|---|
| `HomePage` | 管理数据加载、筛选、hover、选中、加载、空态、错误态 |
| `RadarCanvas` | 展示同心圆、八大领域标签、书籍点位与点位交互 |
| `RadarFilters` | 处理关键词、领域、难度、推荐指数筛选与清空 |
| `RadarTooltip` | 展示 Hover 时的短信息 |
| `BookDetailPanel` | 展示 Click 后的书籍详情信息 |
| `RadarLegend` | 解释点、方向、圈层和领域颜色 |
| `Button`、`Tag`、`ScoreBadge`、`EmptyState`、`Skeleton` | 提供基础 UI 表达 |

## 7. 状态模型

首页当前使用以下状态：

- `loading`：mock service 数据加载中。
- `default`：无筛选结果限制，展示全部书籍。
- `filtered`：用户已使用关键词、领域、难度或推荐指数筛选。
- `empty`：筛选条件下没有匹配书籍。
- `error`：数据加载失败。

交互状态包括：

- `hoveredBookId`：当前 Hover 的书籍点。
- `selectedBookId`：当前 Click 选中的书籍点。
- `tooltipPosition`：浮层展示坐标。

选中状态优先于 Hover 状态；筛选状态影响雷达点的可见程度。

## 8. 样式约束

- 样式主要通过 Tailwind CSS class 组织。
- 全局基础样式位于 `src/index.css`。
- Tailwind 主题扩展位于 `tailwind.config.ts`，包括主色、中性色、圆角、阴影和字体族。
- 页面当前优先支持桌面端展示，`body` 设置了最小宽度。
- 视觉风格应继续遵循 `context/ux-design-guidelines.md`：专业、克制、理性、有编辑感，避免电商感、论坛感、过度科幻感。

## 9. 当前技术注意点

- 雷达点位目前由 mock 数据中的 `x`、`y` 控制。
- `sectorIndex`、`ringIndex` 当前作为语义字段保留，尚未用于自动计算雷达位置。
- “推荐一本书”“查看完整书单”“评分说明”当前只是首页入口按钮，不对应已实现路由。
- 错误态依赖 `getRadarBooks()` 抛错，目前正常 mock service 不会主动触发错误。
- `archive/homepage-prototype.html` 是迁移前的静态 HTML 原型，已归档，React 实现以 `src/` 为准；书籍推荐等增量功能不得回写该原型文件，应在 `src/` 中实现，见第 2.1 节。

## 10. 验证命令

```bash
npm run typecheck
npm run build
```

本地开发：

```bash
npm run dev
```
