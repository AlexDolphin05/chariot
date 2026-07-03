# 源项目开荒级分析

> 基于 2026-07-03 对 `~/Desktop/HERMIT`、`~/Desktop/emergency-planner`、`~/Desktop/userkiller` 的实际代码阅读。
> 目标是支撑 Chariot 骨架决策，不是完整代码审计。

## HERMIT（系统认知层）

**技术栈**：TypeScript 全栈（React client + Express server + Drizzle），带大量测试。

**值得复用的能力**（都在 `server/` 下）：

- `deepSniff.ts`（698 行）：项目深度嗅探/ingest。有 `DeepSniffDepth`（lean/standard/deep）、`RiskArea`、`HealthScore`、`EnhancedProjectProfile` 等成熟抽象，`deepIngestProject()` 是核心入口。→ 对应 Chariot 的 `SniffSnapshot`。
- `contextPipeline.ts`：统一上下文管线（retrieval → code-tracing expansion → evidence formatting），`retrieveWithExpansion()` 是单一入口，已经过一轮去重重构。→ 对应 `module-hermit` 的 project scope runner。
- `projectIntelligence/`：`dependencyGraph.ts`、`symbolExtractor.ts`、`routeExtractor.ts`、`schemaExtractor.ts`、`semanticChunker.ts` 等，图结构能力齐全。→ 对应 Workbench 的 Project Map。
- `agenticIngest.ts`、`search/`（FTS5 + rerank）：检索与记忆相关抽象。

**不适合直接复用**：client 页面（与其账号体系/onboarding 深度耦合）、auth 相关（supabaseJwt / googleAuth / betaInvite）、entitlements 商业化逻辑。

**在 Chariot 中的角色**：`module-hermit` 的真实实现来源。双作用域中 project scope 直接对应 contextPipeline；board scope 需要新写一层跨项目聚合（HERMIT 目前是单项目视角，这是唯一需要新设计的部分）。

## emergency-planner（系统约束/排程层）

**技术栈**：TypeScript 全栈（与 HERMIT 同构：Express + Drizzle + React），测试覆盖好。

**值得复用的能力**（都在 `server/services/` 下）：

- `scheduler.ts`：硬约束排程引擎（"AI proposes, script enforces"），有 `Task` / `ScheduledTask` / `UnscheduledReason`（带结构化 reason code）等干净的类型，v0.4 已修过时区/负载均衡问题。
- `planningWindow.ts`：时间窗口抽象（`createPlanningWindow` / `isTaskWithinWindow` / `clampDeadlineToWindow`）。
- `autoBlocks.ts`：约束块生成 + `checkTimeConflicts()` + `getAvailableSlots()` —— 冲突检测语义的核心。
- `plannerSnapshot.ts`：**已经定义了与 Chariot 规范完全一致的 `PlannerSnapshot` / `PlannerConflict` 类型**（scope: global/project、四种冲突类型）。这不是巧合——它就是 Chariot planner contract 的原型，对接成本最低。

**不适合直接复用**：日历页面、登录/设置页、officeAssistant 对接。

**在 Chariot 中的角色**：`module-planner` 的真实实现来源。global scope 冲突检测已有 `plannerSnapshot.ts` 可以近乎直接搬；project scope 排程走 scheduler.ts。

## userkiller（系统自动化/世界层入口）

**技术栈**：Python Flask 后端 + React(JS) 前端 + Electron 壳。**与另两个项目技术栈异构，这是"只桥接不迁移"的根本原因。**

**值得抽象的语义**（不搬代码，搬概念）：

- `session_manager.py`：workflow session 抽象（会话即工作区目录 + sessions.json 索引）。
- `workflow_engine.py`：五模块流水线（PM → Planner → Preprocessor → Coder → Reviewer），有工作流日志和步骤状态。→ 对应 `UserkillerSessionStatus`。
- `template_manager.py`：模板保存/相似检测/文件兼容性映射 —— 自动化复用语义，第二阶段再接。
- `app.py`：REST API 完整（sessions / files / execute / status / templates），是天然的桥接面，完整清单见 `module-userkiller/src/legacyBridgeNotes.ts`。

**明确不做**：把 Python 核心重写成 JS。执行链依赖本地文件系统和子进程，重写风险高、收益低。

**在 Chariot 中的角色**：`module-userkiller` 只实现 HTTP adapter（contract 已定义），Chariot 负责展示会话/产物和触发执行。

## 汇总：三系统 → Chariot 映射

| 源项目 | 核心能力 | Chariot 落点 | 接入方式 |
|---|---|---|---|
| HERMIT | deepSniff / contextPipeline / projectIntelligence | module-hermit、Project Map | 抽库（同为 TS，可渐进搬） |
| emergency-planner | scheduler / autoBlocks / plannerSnapshot | module-planner | 抽库（类型已对齐） |
| userkiller | session / template / workflow REST API | module-userkiller | HTTP 桥接（不迁移） |

**一个值得注意的事实**：HERMIT 和 emergency-planner 技术栈同构（同一套脚手架），且 emergency-planner 里已出现 Chariot 风格的 snapshot 类型——两者的能力抽取可以共享一套模式；userkiller 是唯一的异构系统，边界必须保持在 HTTP 层。
