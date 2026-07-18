# 归档说明

## `homepage-prototype.html`

这是迁移前的静态 HTML 原型，早于当前 React 实现产出，仅作历史参考。

- **不是**当前产品的展示页面，也不是交付载体。
- 已停止同步维护：书籍推荐（推荐抽屉、提交校验、推荐记录弹窗）等后续能力只在 React 实现（`src/`）中落地，这里不会补齐。
- 唯一正式展示页面是 `index.html`（通过 `src/main.tsx` 挂载 React 应用，`/` 路由对应 `src/pages/HomePage.tsx`）。

如需查看当前功能，请运行：

```bash
npm run dev
```

然后访问终端输出的本地地址，不要再打开本目录下的静态原型文件作为功能页面。
