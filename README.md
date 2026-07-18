# AI-Native 读书雷达

AI-Native 读书雷达是一个面向 AI 学习者的长期价值型书单与学习路径参考产品。

它通过 AI 专业人群共建推荐与评分，围绕主题领域、难度层级、推荐指数和推荐理由，帮助用户快速判断哪些 AI 相关书籍值得读、适合什么阶段读，以及为什么值得投入时间。

## 当前能力

当前版本已实现桌面端首页原型：

- 展示 AI 读书雷达首页；
- 展示八大 AI 学习与实践领域；
- 展示入门认知、方法实践、深度进阶三层阅读阶段；
- 雷达点位代表书籍或文字类内容；
- Hover 书籍点查看短推荐理由；
- Click 书籍点查看右侧详情面板；
- 支持关键词、领域、难度、推荐指数筛选；
- 支持加载态、空结果态和错误态基础模型；
- 支持从首页发起书籍推荐：右侧抽屉表单、校验提交、推荐记录弹窗；
- 推荐记录写入虚拟 SQL 表 `book_recommendations`（schema：`src/mocks/sql/recommendations.schema.sql`），运行时由 localStorage 模拟持久化，刷新可恢复且不进入正式雷达；
- 保留“查看完整书单”“评分说明”入口。

当前版本不是完整产品系统。完整书单和评分说明仍是入口，不是已实现页面。

## 本地运行

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

类型检查：

```bash
npm run typecheck
```

生产构建：

```bash
npm run build
```

## 技术栈

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router v6
- 本地 Mock JSON + mock service 函数

## 目录结构

```text
.
├── archive/
│   ├── README.md               # 归档说明
│   └── homepage-prototype.html # 迁移前静态原型，已归档，不作为展示页面
├── context/
│   ├── system-overview.md
│   ├── ux-design-guidelines.md
│   ├── homepage-design-spec.md
│   ├── tech-design.md
│   └── features/
│       └── book-recommendation.md
├── src/
│   ├── components/
│   │   ├── radar/
│   │   ├── recommendation/   # 书籍推荐业务组件
│   │   └── ui/
│   ├── hooks/                # 推荐流程等页面状态 hook
│   ├── mocks/
│   │   ├── books.mock.json
│   │   ├── recommendations.seed.json
│   │   └── sql/
│   │       └── recommendations.schema.sql  # 推荐虚拟 SQL 表结构
│   ├── pages/
│   ├── services/
│   │   ├── booksService.ts
│   │   ├── recommendationsService.ts      # 模拟 INSERT/SELECT
│   │   └── virtualDb/                     # 虚拟表列映射
│   ├── types/
│   ├── utils/                # 推荐表单校验等纯函数
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

**当前只有一个可访问、可展示的页面：`index.html`**（挂载 `src/main.tsx` → `/` 路由 → `src/pages/HomePage.tsx`）。迁移前的静态原型已归档为 `archive/homepage-prototype.html`，不再作为展示或测试页面，也不会同步新功能。正式前端实现以 `src/` 为准。书籍推荐的接入点为 `src/pages/HomePage.tsx`，详见 `context/tech-design.md` 第 2.1 节与 `context/features/book-recommendation.md` 第 14.0 节。

## 文档入口

- `context/system-overview.md`：产品定位、Persona、AS-IS 瓶颈、关键假设。
- `context/ux-design-guidelines.md`：全站视觉与交互规范。
- `context/homepage-design-spec.md`：首页范围、结构、组件、交互、状态和数据字段。
- `context/tech-design.md`：当前工程技术栈、目录约束、数据流、类型基线与推荐功能前端落点。
- `context/features/book-recommendation.md`：书籍推荐产品 Brief、交互与实现约束。

## 迭代边界

当前首页只负责帮助用户理解和探索 AI 读书雷达，不展开：

- 后台系统；
- 用户体系；
- 复杂评分机制；
- 历史版本对比；
- 完整社区功能；
- 二级页面详情设计。

后续迭代前，应先确认当前 React 首页实现是否作为稳定基线，并将相关改动提交进版本记录。
