# Project Analysis

这是一份开荒级分析，只服务于 Chariot 第一阶段，不做无止尽代码阅读。

已确认桌面上存在这三个源项目：

- `/Users/alexdolphin/Desktop/HERMIT`
- `/Users/alexdolphin/Desktop/emergency-planner`
- `/Users/alexdolphin/Desktop/userkiller`

## 1. HERMIT

### 已确认的关键入口

- `server/contextAssembler.ts`
- `server/deepSniff.ts`
- `server/profileBuilder.ts`
- `server/contextPipeline.ts`
- `server/docparse.ts`
- `server/search/retrieve.ts`

### 适合复用的能力

- layered context building
- deep sniff / ingest / parsing
- project interpretation
- retrieval pipeline
- graph / relation structures
- workspace-oriented assistant orchestration

### 不适合直接复用的部分

- workflow 页面
- HERMIT 自己的布局模式
- 强耦合的 Brain 结果卡片
- 依赖现有项目模型的 detail 页面

### 在 Chariot 中的角色

HERMIT 是系统认知层。

当前在 Chariot 中应先表现为：

- `board scope` 嗅探入口
- `project scope` 上下文 builder
- `SniffSnapshot` 生产者

## 2. emergency-planner

### 已确认的关键入口

- `server/services/planningWindow.ts`
- `server/services/autoBlocks.ts`
- `server/services/scheduler.ts`
- `server/services/dateUtils.ts`
- `drizzle/schema.ts`

### 适合复用的能力

- planning window semantics
- conflict detection
- time constraints / auto blocks
- urgency and priority semantics
- project-scoped planner snapshot construction

### 不适合直接复用的部分

- 主页面流程
- onboarding
- 具体日历/周历视图
- 应用内能量管理 UI

### 在 Chariot 中的角色

emergency-planner 是系统约束/排程层。

当前在 Chariot 中应先表现为：

- `global scope` planner snapshot
- `project scope` planner snapshot
- conflict detector

## 3. userkiller

### 已确认的关键入口

- `backend/session_manager.py`
- `backend/workflow_engine.py`
- `backend/template_manager.py`
- `backend/modules/file_reader.py`
- `backend/app.py`

### 适合复用的能力

- session abstraction
- workflow execution state
- template semantics
- artifact loading
- file reading / workspace inventory

### 当前不该做的事

- 不做 Python 核心重写
- 不把 Electron / Flask 整体搬进壳层
- 不急着把全部执行逻辑改成 TypeScript

### 在 Chariot 中的角色

userkiller 是自动化工作流层。

当前在 Chariot 中应先表现为：

- `SessionAdapter`
- `ArtifactLoader`
- legacy bridge notes
- workbench 入口面板

## 4. 结论：哪些代码值得优先抽

### 先从 HERMIT 抽

- `contextAssembler.ts`
- `profileBuilder.ts`
- `deepSniff.ts`
- `contextPipeline.ts`

### 先从 emergency-planner 抽

- `planningWindow.ts`
- `autoBlocks.ts`
- `scheduler.ts`

### 先从 userkiller 抽

- `session_manager.py`
- `template_manager.py`
- `modules/file_reader.py`

## 5. 暂时只适配不迁移的区域

- HERMIT 页面和 workflow UI
- emergency-planner 页面与 onboarding
- userkiller Python 执行链
- Tia 负责的 Board 视觉系统

## 6. 对 Chariot 第一阶段的直接影响

这份分析直接决定了当前骨架的形态：

- Board 只做项目入口、全局嗅探入口、全局冲突占位
- Workbench 只做项目级上下文、planner、module host
- 所有真实能力先落到 `types + kernel + module contracts`
- 不做整页迁移
