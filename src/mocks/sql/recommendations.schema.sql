-- =============================================================================
-- AI 读书雷达｜书籍推荐虚拟库表结构（Virtual SQL Schema）
-- =============================================================================
-- 说明：
-- 1. 本文件是无真实后端阶段的「虚拟 SQL」约定，用于定义推荐提交数据应落在哪张表。
-- 2. 当前运行时由 src/services/recommendationsService.ts 模拟 INSERT / SELECT，
--    数据持久化在浏览器 localStorage（键名见文件末尾），不进入正式雷达 books 数据。
-- 3. 未来接真实数据库时，应优先按本 schema 建表，再替换 service 实现，UI 无需改动。
-- =============================================================================

-- 已提交的用户推荐记录（不会自动进入正式雷达）
CREATE TABLE IF NOT EXISTS book_recommendations (
  id               TEXT PRIMARY KEY,                         -- 推荐记录 ID（UUID）
  title            TEXT NOT NULL,                            -- 书名
  author           TEXT NOT NULL,                            -- 作者
  domain           TEXT NOT NULL,                            -- 八大领域之一
  personal_score   INTEGER NOT NULL
                   CHECK (personal_score BETWEEN 1 AND 5),   -- 个人推荐指数（非正式雷达评分）
  reason           TEXT NOT NULL
                   CHECK (length(trim(reason)) BETWEEN 30 AND 300), -- 推荐理由
  status           TEXT NOT NULL DEFAULT 'recorded'
                   CHECK (status IN ('recorded')),           -- 当前仅「已记录」
  submitted_at     TEXT NOT NULL,                            -- ISO-8601 提交时间
  title_author_key TEXT NOT NULL,                            -- 归一化后的「书名::作者」，用于去重
  UNIQUE (title_author_key)
);

CREATE INDEX IF NOT EXISTS idx_book_recommendations_submitted_at
  ON book_recommendations (submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_book_recommendations_domain
  ON book_recommendations (domain);

-- 未提交草稿（单设备单草稿过渡方案；未来可按 user_id 扩展）
CREATE TABLE IF NOT EXISTS book_recommendation_drafts (
  id             TEXT PRIMARY KEY DEFAULT 'local_default', -- 本轮固定 local_default
  title          TEXT NOT NULL DEFAULT '',
  author         TEXT NOT NULL DEFAULT '',
  domain         TEXT NOT NULL DEFAULT '',                 -- 可为空字符串表示未选
  personal_score INTEGER NULL
                 CHECK (personal_score IS NULL OR personal_score BETWEEN 1 AND 5),
  reason         TEXT NOT NULL DEFAULT '',
  updated_at     TEXT NOT NULL                              -- ISO-8601 最近保存时间
);

-- =============================================================================
-- 运行时虚拟存储映射（非 SQL，供前端 service 使用）
-- =============================================================================
-- localStorage['ai-reading-radar:db.book_recommendations']
--   → JSON 数组，元素字段与 book_recommendations 列一一对应（snake_case）
-- localStorage['ai-reading-radar:db.book_recommendation_drafts']
--   → JSON 对象，字段与 book_recommendation_drafts 列一一对应
-- =============================================================================

-- 示例：提交一条推荐（真实后端时由 API 执行；当前由 recommendationsService.insertRecommendation 模拟）
-- INSERT INTO book_recommendations (
--   id, title, author, domain, personal_score, reason, status, submitted_at, title_author_key
-- ) VALUES (
--   'rec_xxx', '书名', '作者', 'AI 工程', 5, '……推荐理由……', 'recorded', '2026-07-18T00:00:00.000Z', '书名::作者'
-- );
