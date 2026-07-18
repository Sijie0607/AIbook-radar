# AI读书雷达 (AI Reading Radar) 交互设计规格书

本规格书是一份**AI模型可读性高（AI-Parseable）**、结构严密、逻辑完整的交互设计说明文档。它基于“AI读书雷达”最新的视觉与系统架构编写，旨在帮助开发模型或设计模型深度理解本应用的视觉表现、数据结构、交互行为与状态机控制。

---

## 一、 项目概述与核心概念

### 1.1 核心价值命题
“AI读书雷达”是一款专为AI与数字化前沿探索者设计的知识雷达。它通过将复杂的图书、文章及研究报告分类映射至**8大核心领域**，并在中央呈现一个**深邃有机的森林墨绿星云（Forest-Green Nebula Core）**，实现多维知识分布的可视化，帮助用户一目了然地捕捉前沿知识分布。

### 1.2 目标用户与使用场景
- **AI 开发者与产品经理**：通过雷达图快速筛选和发现“AI工程”、“Agent设计”、“产品方法论”等维度的深度书籍。
- **组织变革者与商业分析师**：跟踪“组织变革”、“商业落地”和“伦理治理”方向的思想演进。

---

## 二、 视觉规范与色彩系统 (Visual & Theme System)

应用采用了高品质的**人文雅致温润色彩体系**，背底使用温和柔美的暖乳白，搭配深邃的森林墨绿中央星云，形成高对比度、极具专业感的学术与科技质感。

### 2.1 全局背景色 (Global Background)
- **色值**：`#faf8f2`（温润暖奶麦色/轻量宣纸色）
- **适用范围**：整个 HTML 视口背景、底层支撑色。

### 2.2 领域色彩系统 (8 Domains Color Palette)
8大领域采用高饱和度微调、中等明度、实色（Solid）的雅致中国传统色彩，与右侧的详情列表、左侧雷达交互点的色块完全一致：

| 领域名称 (Domain Name) | 色彩定位 | 十六进制色值 (HEX) | 视觉感官说明 |
| :--- | :--- | :--- | :--- |
| **AI 工程** | 钴蓝色 | `#4a7bb0` | 严谨、系统、工程化支撑 |
| **产品方法论** | 玫瑰豆沙红 | `#bf6b77` | 人文、构建、策略 |
| **Agent 设计** | 暮色青绿 | `#518f8a` | 智能、自治、共生 |
| **组织变革** | 丁香灰紫 | `#9678a6` | 演化、动态、韧性 |
| **数据智能** | 苔藓草木绿 | `#869e6b` | 增长、自然、深度 |
| **商业落地** | 暖沙土黄 | `#c6965d` | 实际、沉淀、价值 |
| **伦理治理** | 暮色浆果红 | `#945d7a` | 约束、人文、沉思 |
| **前沿趋势** | 经典群青 | `#6b70ad` | 探索、星空、未来 |

### 2.3 星云核心渐变 (Central Nebula Gradient)
中央摒弃了生硬的几何色块或跳动的粒子，采用**纯净有机的森林墨绿渐变核心（Pure Glowing Forest-Green Nebula）**。它柔和自然，具有呼吸感：
- **渐变点 (Radial Gradient)**:
  - 核心点 (0%): `#1e3f20` (Opacity: 0.75) —— 深邃森林绿
  - 中间层 (35%): `#2e5930` (Opacity: 0.50) —— 盎然竹叶绿
  - 边缘过渡 (70%): `#4c7c4f` (Opacity: 0.22) —— 雅致草木绿
  - 消失点 (100%): `#faf8f2` (Opacity: 0.0) —— 完美融合背景
- **核心尺寸**：
  - 底层大星云：半径 `245px` (Opacity: 40%)
  - 动态呼吸主核心：半径 `145px`
  - 异步呼吸副核心（错位偏置）：半径 `115px`，位移 `(-30px, +25px)`，动画延迟 `-4.5s`

---

## 三、 数据结构与状态模型 (Data & State Models)

### 3.1 核心实体类型 (TypeScript)

```typescript
// 领域类型定义
export type RadarDomain = 
  | "AI 工程" 
  | "产品方法论" 
  | "Agent 设计" 
  | "组织变革" 
  | "数据智能" 
  | "商业落地" 
  | "伦理治理" 
  | "前沿趋势";

// 知识点/图书项
export interface RadarItem {
  id: string;
  title: string;
  author: string;
  domain: RadarDomain;
  level: "核心" | "前沿" | "外围"; // 映射雷达图由内向外的圈层
  score: number;                   // 评分，影响雷达点的极径
  angle: number;                   // 极角 (0 - 360)
  publishDate: string;             // 出版日期
  tags: string[];                  // 核心标签
  summary: string;                 // 内容提要/金句
  rating: number;                  // 用户打分 (1-5)
}
```

### 3.2 交互状态机定义 (Global UI State)

```typescript
export interface RadarFilterState {
  searchQuery: string;             // 搜索过滤
  domains: RadarDomain[];          // 激活的领域列表 (多选，空代表全选)
  levels: ("核心" | "前沿" | "外围")[]; // 深度层级多选
}

export interface RadarViewState {
  selectedItemId: string | null;   // 当前在雷达/列表中点击选中的知识点ID
  hoveredItemId: string | null;    // 当前鼠标悬停的知识点ID
  zoomScale: number;               // 画布缩放比例 (1.0 基准)
}
```

---

## 四、 核心交互组件规格 (Interactive Components Spec)

### 4.1 墨绿星云雷达画布 (Radar Canvas)

#### 【视觉规格】
- **画布容器**：采用 SVG 动态计算尺寸（标准 $800 \times 600$ 空间，自适应），中心点设为 $(380, 300)$，外圈半径为 $260px$。
- **同心圆网格（深度圈层）**：
  - **核心层**（内圈半径 $110px$）：经典著作、底层地基。
  - **前沿层**（中圈半径 $190px$）：行业趋势、演进方向。
  - **外围层**（外圈半径 $260px$）：交叉领域、前沿探索。
- **星云动画**：内嵌 CSS `@keyframes pulse-core-green`。核心通过 `scale(0.88)` 至 `scale(1.08)`、`opacity(0.45)` 至 `opacity(0.70)` 呈现 $9s$ 的轻盈呼吸动画，没有机械线条，也没有跳动粒子的嘈杂，保持界面的宁静与高级感。

#### 【雷达数据节点交互 (Radar Node Interaction)】
- **静止状态**：节点是一个直径为 $8px$ 的实心圆点，其填充色等于所属领域的**特有实色**（例如 AI工程填充 `#4a7bb0`）。
- **Hover/悬浮状态**：
  1. 节点半径平滑过渡至 $12px$。
  2. 外侧浮现一个直径为 $24px$、透明度为 $30\%$ 的同色柔光环。
  3. 鼠标指针变为 `pointer`。
  4. 触发全局 Tooltip，展示图书基本信息（标题、作者、评分、所属领域）。
- **Click/选中状态**：
  1. 激活卡片浮现：右侧列表及详情页立即平滑滚动并高亮该图书。
  2. 雷达图中该点周围浮现一个白色细描边双重呼吸环。

---

### 4.2 莫兰迪过滤器控制栏 (Radar Filters)

#### 【过滤芯片 (Filter Chip)】
- **状态逻辑**：
  - **激活态（Selected）**：背景色自动变为该领域专属实色的 $12.5\%$ 透明度（即 `color + "20"`），边框为该专属实色，文本色为该专属实色。这保证了视觉上的柔和和对齐。
  - **未激活态（Unselected）**：边框为 `#e4e7ec`，背景色为纯白 `#ffffff`，文本色为 `#344054`。
- **交互回馈**：悬浮未激活态时，边框颜色渐变为 `#a7c6cb`，背景略微带有一层温润的薄荷奶黄色 `#f3fbfa`。

---

### 4.3 知识列表与深度卡片 (Book Lists & Card Details)

#### 【右侧列表卡片规格】
- 每个卡片左侧包含一条高度 $100\%$ 的竖线，其颜色**严格绑定领域色彩**。
- 支持全文模糊搜索。当雷达点被选中时，右侧卡片平滑滚动进入视口（使用 `scrollIntoView({ behavior: 'smooth' })`）。
- 卡片右上角用小微章（Badge）标记深度层级（“核心”、“前沿”、“外围”），微章底色与对应领域的实色轻量半透明融合。

---

## 五、 AI 友好的模型解析指南 (For AI Model Comprehension)

当其他 AI 代理或前端模型读取此仓库以进行样式继承、功能重构或多端迁移时，请严格遵守以下映射规则（AI Style Bindings）：

```json
{
  "style_inheritance": {
    "theme_mode": "warm-light",
    "global_background": "#faf8f2",
    "central_gradient_stop_colors": ["#1e3f20", "#2e5930", "#4c7c4f", "#faf8f2"],
    "domain_color_binding": {
      "AI 工程": "#4a7bb0",
      "产品方法论": "#bf6b77",
      "Agent 设计": "#518f8a",
      "组织变革": "#9678a6",
      "数据智能": "#869e6b",
      "商业落地": "#c6965d",
      "伦理治理": "#945d7a",
      "前沿趋势": "#6b70ad"
    }
  },
  "visual_constraints": {
    "no_gradients_on_elements": true,
    "elements_use_solid_colors_from_domain_binding": true,
    "nebula_pulsing_animation_speed": "9s",
    "strictly_no_particles_or_lines_in_background": true
  },
  "interactive_rules": {
    "filter_chip_active_background_opacity": "12.5%",
    "hover_effect_node_expansion_px": 12,
    "canvas_interaction_trigger_scroll": true
  }
}
```

---

*AI读书雷达 - 2026 匠心构建，极简呈现。*
