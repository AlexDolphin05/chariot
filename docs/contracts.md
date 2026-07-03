# Chariot Contracts（第一阶段重点）

所有 contract 定义在 `packages/types/src/index.ts`，是跨 package 通信的唯一语言。

## ChariotProjectCard

Board 上的项目卡。`boardPosition` 为 Tia 的画布预留；当前占位布局刻意不用它，避免提前锁死视觉假设。`moduleHints` 提示该项目倾向的模块（如 userkiller 项目提示 automation）。

## ChariotWorkspace

打开项目卡后进入的工作区。持有两个快照槽位（`sniff` / `planner`），由模块生成、经 `snapshotSync` 写入。`metadata` 存源项目路径、技术栈等松散信息，不过早 schema 化。

## SniffSnapshot

Hermit 嗅探结果。`scope: "board" | "project"` 是双作用域设计的落点。字段（summary / entities / relations / risks / suggestions）对应 HERMIT `deepSniff.ts` 的 `EnhancedProjectProfile` 能力面，接真实实现时不需要改 contract。

## PlannerSnapshot

排程冲突快照。`scope: "global" | "project"`。冲突类型（time-overlap / dependency / resource / priority）与 emergency-planner 的 `plannerSnapshot.ts` **完全一致**（其代码中已有同名类型），未来可以直接对接。

## ChariotModuleManifest

模块自描述：`kind`（core / planner / automation / insight）+ `supports`（board / workbench）。PlanetDock 按 `supports` 过滤展示，未来第三方模块走同一注册入口。

## ChariotEvent

最小事件联合类型：

| 事件 | 发布者 | 订阅者（当前） |
|---|---|---|
| `board/project.open` | kernel runtime | bootstrap（触发快照生成） |
| `board/hermit.ask` | GlobalHermitBar | （预留给日志/历史记录） |
| `workspace/active.changed` | kernel runtime | （预留给 Tia 的画布高亮） |
| `workbench/module.switch` | kernel runtime | （预留） |
| `planner/conflicts.updated` | snapshotSync | （预留给全局提醒） |

## 为什么这些 contract 是第一阶段重点

1. **它们是三个系统的最大公约数**：项目、工作区、认知快照、排程快照，每个源系统都能映射进来。
2. **它们隔离了协作边界**：Alex 改内核/模块、Tia 改画布，只要 contract 不变就互不阻塞。
3. **它们让 mock → 真实的替换是局部的**：真实能力接入只替换 builder/adapter 实现，UI 和 store 不动。
