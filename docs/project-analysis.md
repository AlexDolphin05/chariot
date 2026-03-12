# Chariot 开荒级项目分析

本文档对 HERMIT、emergency-planner、userkiller 三个项目进行开荒级分析，用于支持 Chariot 统一壳的架构设计。分析重点：可复用能力、不适合直接复用的部分、值得抽象的数据结构、在 Chariot 中的角色。

---

## 一、HERMIT

**路径**: `~/Desktop/HERMIT`  
**技术栈**: React 19, TypeScript, Vite 7, Tailwind CSS 4, tRPC 11, Express, SQLite (better-sqlite3), Drizzle ORM, FTS5 搜索, OpenAI 兼容 API

### 目录结构概览

```
HERMIT/
├── client/src/           # React 应用
│   ├── components/       # UI (LayoutModeBar, WorkflowCanvas, BrainResultCard 等)
│   ├── pages/            # Home, Login, Projects, ProjectDetail, Workflow, PromptLibrary
│   ├── contexts/         # LanguageContext, ThemeContext
│   ├── hooks/            # useComposition, usePersistFn, useMobile
│   └── lib/              # trpc, utils, useMapTraces, useBrainState, riskCheck
├── server/               # Express + tRPC 后端
│   ├── _core/            # index, llm, context, env, trpc, map
│   ├── analyze/          # 静态分析 (imports, types, routes, metrics, conventions)
│   ├── search/           # retrieve, chunking, embedding, search
│   ├── skills/           # emergencyPlanner, userkiller 等技能
│   ├── deepSniff.ts      # 多阶段项目分析
│   ├── contextPipeline.ts # 检索 + 扩展 + 证据格式化
│   ├── contextAssembler.ts # 分层上下文 (system/project/memory/task/session)
│   ├── hermit.ts         # ingest, clarify, interview, compile, walkthrough, plan
│   ├── hermitBrain.ts    # 编排器 (explain/walkthrough/plan/interview)
│   ├── agenticIngest.ts  # 递归探索式 ingest
│   └── docparse.ts       # docx, xlsx, pdf 等文档解析
├── shared/               # types, const, errors
└── drizzle/              # schema
```

### 可复用能力

| 能力 | 位置 | 说明 |
|------|------|------|
| Context building | `contextAssembler.ts` | system/project/memory/task 分层上下文 |
| Sniff / ingest / parsing | `deepSniff.ts`, `agenticIngest.ts`, `docparse.ts` | 多阶段项目分析、文档解析 |
| Retrieval pipeline | `search/retrieve.ts`, `contextPipeline.ts` | FTS5 + 可选 embedding 混合检索 |
| Chunking | `search/chunking.ts` | 重叠文本分块 |
| Profile builder | `profileBuilder.ts` | ProjectProfile → LLM 上下文字符串 |
| Static analysis | `analyze/` | 依赖图、类型、路由、指标、约定 |
| Map / graph 相关结构 | `map.ts`, 依赖图 | 项目地图、关系图 |

### 不适合直接复用的页面/组件

| 组件 | 原因 |
|------|------|
| Workflow.tsx | ~2100 行，与 HERMIT 工作流强耦合，Brain 流式、布局模式、画布 |
| ProjectDetail.tsx | HERMIT 项目模型 (materials, profile, ingest) |
| HermitWorkflowDiagram | HERMIT 特定步骤流 |
| BrainResultCard, ExecutionResultCard | Brain 响应形状特定 |
| LayoutModeBar, WorkspaceLayout | HERMIT 布局模式 |
| WorkflowCanvas, WorkflowCanvasNode | HERMIT 工作流图 |

### 值得抽象的数据结构

- `ProjectProfile`, `GlossaryEntry`, `TechStack`, `Architecture`, `CodePattern`
- `MemoryEntry`, `TaskDecision`, `TaskStep`, `ActivePlan` (contextAssembler)
- `EvidenceItem`, `RetrieveResult`, `QueryIntent` (search)
- `ParsedDocument`, `ParsedTable` (docparse)
- `DependencyGraph`, `TypeDefinition`, `ApiEndpoint`, `FileMetrics` (analyze)

### Chariot 中的角色

**系统认知层**。提供 context building、sniff、ingest、parsing、map/graph 能力。Hermit 模块在 Chariot 中支持两种作用域：board scope（基于全部项目）和 project scope（基于当前 workspace）。

---

## 二、emergency-planner

**路径**: `~/Desktop/emergency-planner`  
**技术栈**: React 19, TypeScript, Vite 7, Tailwind CSS 4, tRPC 11, Fastify 5, MySQL 8, Drizzle ORM, DeepSeek API

### 目录结构概览

```
emergency-planner/
├── client/src/
│   ├── components/       # ai/, calendar/, energy/, onboarding/, task/, ui/
│   ├── pages/            # Home, Login, Admin, ApiManagement, NotFound
│   └── lib/              # trpc, utils
├── server/
│   ├── _core/            # env, cookies, oauth, trpc, vite, llm, appAuth
│   ├── services/
│   │   ├── autoBlocks.ts     # 时间块、冲突检测
│   │   ├── planningWindow.ts # 规划窗口、日边界
│   │   ├── scheduler.ts     # 硬约束调度器
│   │   ├── deepseek.ts      # AI 提取、解析、排程
│   │   └── dateUtils.ts
│   └── routers.ts
├── shared/
└── drizzle/              # schema
```

### 可复用能力

| 能力 | 位置 | 说明 |
|------|------|------|
| Planning window | `planningWindow.ts`, `dateUtils.ts` | 日期范围、日边界、时区 |
| Auto blocks | `autoBlocks.ts` | 睡眠/用餐/课程/阻塞块，`checkTimeConflicts` |
| Hard-constraint scheduler | `scheduler.ts` | 槽位查找、分块、deadline/weight 排序 |
| Conflict detection | `autoBlocks.ts` | `checkTimeConflicts` 检查时间重叠 |
| Task/constraint types | `autoBlocks.ts`, `scheduler.ts` | Task, AutoBlock, TimeConstraint |

### 不适合直接复用的页面/组件

| 组件 | 原因 |
|------|------|
| Home.tsx | ~2000 行，与 emergency-planner 流程强耦合 |
| AIChatPanel | DeepSeek + 课表导入等特定流程 |
| EnergyManager | emergency-planner 能量模型 |
| OnboardingWizard | 应用特定引导 |
| DayView/MonthView/YearView | 使用 drizzle schema 的 Task，样式特定 |

### 值得抽象的数据结构

- `Task` (id, title, estimatedDuration, weight, deadline, category, isUrgent)
- `AutoBlock` (id, title, type, date, startTime, endTime, priority, isHardConstraint)
- `TimeConstraint` (type: blocked|course|preferred, dayOfWeek, startTime, endTime)
- `PlanningWindowOutput` (windowStart, windowEnd, dailyBoundaries, timezone)
- `ScheduledTask` (Task + scheduledStart, scheduledEnd, breaks, conflicts)

### Chariot 中的角色

**系统约束/排程层**。提供 conflict detection、scheduling、planning window 能力。Planner 模块在 Chariot 中支持两种作用域：global scope（跨项目排程与冲突）和 project scope（当前项目排程与冲突）。

---

## 三、userkiller

**路径**: `~/Desktop/userkiller`  
**技术栈**: Python Flask 后端, React 18 JSX 前端, Vite 5, Electron, pandas, openpyxl, python-docx, PyPDF2, OpenAI SDK (DeepSeek)

### 目录结构概览

```
userkiller/
├── backend/              # Python Flask API
│   ├── app.py            # Flask 入口、REST 路由
│   ├── workflow_engine.py # PM→Planner→Preprocessor→Coder→Reviewer 流水线
│   ├── session_manager.py # Session CRUD、workspace 布局
│   ├── template_manager.py # Template CRUD、相似度、兼容性
│   └── modules/          # pm, planner, preprocessor, coder, reviewer, file_reader
├── frontend/             # React SPA (JSX，无 TypeScript)
│   └── src/components/   # TitleBar, SessionSidebar, WorkspacePanel, ChatArea, TemplateLibrary
└── electron/             # 桌面包装
```

### 可复用能力

| 能力 | 位置 | 说明 |
|------|------|------|
| Workflow engine | `workflow_engine.py` | PM→Planner→Coder→Reviewer 流水线，可配置模块 |
| Session abstraction | `session_manager.py` | workspace + output 布局，文件 CRUD，messages |
| Template system | `template_manager.py` | 保存/加载模板，相似度搜索，文件兼容性 |
| FileReader | `modules/file_reader.py` | 多格式读取、缓存、树构建 |
| Async execution + polling | `app.py` | ThreadPoolExecutor + 状态轮询模式 |

### 不适合直接复用

| 项目 | 原因 |
|------|------|
| Python 后端整体 | Chariot 第一阶段为纯前端壳，不迁移后端 |
| 中文 hardcoded prompts | 应外部化以支持 i18n |
| DeepSeek/Qianwen  specifics | 模型名、URL 写死，应可配置 |
| Flask 路由布局 | 与当前应用强耦合 |
| 内存中的 execution_status | 不适合多进程或分布式 |
| Electron backend spawn | 假设本地 Python，不适合远程/无服务器 |

### 值得抽象的数据结构

- `Session` (id, name, folder_name, workspace_path, output_path, messages)
- `WorkflowStep` (module, output, status, code?, details?)
- `Template` (id, name, description, code, file_info, output_files, usage_count, tags)
- `FileData` (files, file_tree, content_previews)
- `ExecutionStatus` (status: idle|executing|completed|error, result?, error?)

### Chariot 中的角色

**自动化工作流层**。只做 adapter interface，不全量迁移 Python。Chariot 中提供：session adapter、artifact loader、workflow 执行状态接口。暂时只做 mock 面板与 contract。

---

## 四、总结：Chariot 中的对应关系

| 项目 | Chariot 角色 | 复用策略 |
|------|--------------|----------|
| HERMIT | 系统认知层 | 提炼 context building、sniff、parsing、map 能力；不搬页面 |
| emergency-planner | 系统约束/排程层 | 提炼 planning window、conflict detection、scheduler 能力；不搬页面 |
| userkiller | 自动化工作流层 | 只做 adapter interface + mock；不重写 Python 核心 |

**原则**：不要复用页面，要复用能力。先统一模型（ProjectCard, Workspace, SniffSnapshot, PlannerSnapshot, ModuleManifest, EventBus），再统一功能。
