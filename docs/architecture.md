# Chariot 架构

## 总体架构

```text
┌──────────────────────────────────────────────────────┐
│  apps/web（壳 + bootstrap 接线）                       │
│  ┌──────────────┐  ┌───────────────────────────────┐ │
│  │ Board        │  │ Workbench                     │ │
│  │ (外层世界区)  │  │ (内层工作区)                    │ │
│  │ 项目卡        │  │ WorkspaceHeader               │ │
│  │ 全局冲突提示   │  │ ModuleHost → Hermit/Planner/  │ │
│  │              │  │              Userkiller 面板   │ │
│  │              │  │ ProjectMapPanel · PlanetDock  │ │
│  └──────────────┘  └───────────────────────────────┘ │
│  GlobalHermitBar（底部常驻，board scope）               │
├──────────────────────────────────────────────────────┤
│  kernel：store · event bus · module registry ·        │
│          workspace runtime · snapshot sync           │
├──────────────────────────────────────────────────────┤
│  modules：module-hermit · module-planner ·            │
│           module-userkiller（只依赖 types + kernel）   │
├──────────────────────────────────────────────────────┤
│  types：所有 contract 的唯一来源                        │
└──────────────────────────────────────────────────────┘
```

## 依赖方向（严格单向）

`types` ← `kernel` ← `modules` ← `board` / `workbench` ← `apps/web`

- 模块之间**互不依赖**，通信一律走 kernel 的 event bus。
- 模块产出（快照）通过 `snapshotSync` 写回 store，UI 只读 store。
- `apps/web/src/bootstrap.ts` 是唯一的接线点：注册模块、灌 seed、订阅事件。

## Board / Workbench / Kernel / Modules 的关系

- **Board**：全局视图。渲染 `store.projects`，点击卡片调 `openProject()`（kernel runtime），不自己管理状态。
- **Workbench**：项目视图。渲染 `activeWorkspace` 的快照数据；`PlanetDock` 调 `switchWorkbenchModule()` 切换 `ModuleHost` 内容。
- **Kernel**：唯一全局状态 + 事件 + 注册表。UI 的写操作全部经过 runtime 函数，保证事件正常广播。
- **Modules**：纯能力层，无 UI。产出快照（`SniffSnapshot` / `PlannerSnapshot`）或会话数据，当前全是 mock。

## Hermit 双作用域

Hermit 从设计上就有两条上下文路径，逻辑不写死"只接受当前项目"：

| scope | 上下文来源 | 入口 | 未来接入 |
|---|---|---|---|
| board | 全部项目 + 全局嗅探 | 底部 GlobalHermitBar | HERMIT 全局嗅探/跨项目推理 |
| project | 当前 workspace | Workbench HermitPanel | HERMIT contextPipeline（retrieve → evidence → answer） |

对应代码：`module-hermit/src/contextBuilder.ts` 的 `buildBoardHermitContext()` / `buildWorkspaceHermitContext(workspaceId)`，runner 同样成对。

## Planner 双作用域

| scope | 职责 | 入口 | 未来接入 |
|---|---|---|---|
| global | 跨项目冲突与排程提示 | Board 的 GlobalPlannerOverlay | emergency-planner 的跨项目冲突语义 |
| project | 当前项目排程与冲突 | Workbench PlannerPanel | scheduler.ts / autoBlocks.ts / planningWindow.ts |

对应代码：`module-planner/src/snapshotBuilder.ts` 与 `conflictDetector.ts`，全部成对提供 global/project 版本。

## 为什么先统一模型再统一功能

三个源项目各自有一套"项目/任务/会话"模型。如果先搬功能，每个功能都要在三套模型间做翻译，翻译逻辑会渗进 UI；后续 Tia 的画布再接进来时，还要再翻译一次。

先统一 `ChariotProjectCard` / `ChariotWorkspace` / 两种 Snapshot / `ChariotEvent`，意味着：

1. Tia 的 Board 视觉只依赖 contract，不依赖任何源项目细节；
2. 每个源项目的能力接入变成"实现一个 builder/adapter"，改动范围锁死在自己的 module package 里；
3. mock → 真实实现的替换点全部有明确标注（搜 `MOCK` / `占位` / `未来接入点`）。
