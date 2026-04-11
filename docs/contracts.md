# Chariot Contracts

第一阶段最重要的工作不是做满功能，而是把共享 contract 做稳。

这些 contract 现在都定义在 `packages/types/src/index.ts`。

## ProjectCard

```ts
type ChariotProjectCard = {
  id: string
  title: string
  summary?: string
  tags: string[]
  status: "idle" | "active" | "blocked" | "done"
  priority?: number
  workspaceId: string
  boardPosition: { x: number; y: number }
  moduleHints?: string[]
}
```

它是 Board 层最小稳定单元。

当前用途：

- 画布上的项目对象
- active project 入口
- workbench 绑定入口

## Workspace

```ts
type ChariotWorkspace = {
  id: string
  projectId: string
  name: string
  metadata: Record<string, unknown>
  sniff?: SniffSnapshot
  planner?: PlannerSnapshot
}
```

它是壳层里“项目上下文容器”的最小版本。

当前用途：

- 绑定项目与 snapshot
- 记录源项目路径和角色
- 供 workbench 渲染

## SniffSnapshot

```ts
type SniffSnapshot = {
  scope: "board" | "project"
  summary: string
  entities: string[]
  relations: Array<{ from: string; to: string; type: string }>
  risks: string[]
  suggestions: string[]
  updatedAt: number
}
```

它是 Hermit 在 Chariot 里的最小通用输出。

为什么先定义这个：

- HERMIT 里的真实能力很多，但壳层只需要一个稳定结果形状
- Board 和 Workbench 都能消费同一类结果

## PlannerSnapshot

```ts
type PlannerSnapshot = {
  scope: "global" | "project"
  conflicts: Array<{
    id: string
    type: "time-overlap" | "dependency" | "resource" | "priority"
    message: string
    relatedProjectIds: string[]
  }>
  suggestions: string[]
  updatedAt: number
}
```

它是 Planner 在 Chariot 里的最小稳定输出。

为什么重要：

- 可以先接 mock conflict detection
- 后续再把 emergency-planner 的真实语义接进来
- Board 和 Workbench 都能共用

## Module Manifest

```ts
type ChariotModuleManifest = {
  id: string
  name: string
  kind: "core" | "planner" | "automation" | "insight"
  supports: Array<"board" | "workbench">
  description?: string
}
```

当前它用于：

- module registry
- `PlanetDock`
- workbench module 识别

## Scope Contracts

```ts
type BoardScope = {
  kind: "board"
  projectIds: string[]
  workspaceIds: string[]
  activeProjectId: string | null
}

type WorkspaceScope = {
  kind: "project"
  projectId: string
  workspaceId: string
}
```

这两个 scope contract 的意义是：

- Hermit 不会被写死成“只接受当前项目”
- Planner 也不会被写死成“只看单项目”

## Event Contract

当前最小事件联合类型包括：

- `board/project.open`
- `board/hermit.ask`
- `workspace/active.changed`
- `workbench/module.switch`
- `planner/conflicts.updated`

这些事件够支撑第一阶段的壳层联通。

## 为什么这些 contract 是第一阶段重点

如果没有这些 contract，后面会马上出现三个问题：

- HERMIT、planner、userkiller 的输出形状对不齐
- Board 和 Workbench 会各自长出不同的数据假设
- 迁移会退化成“把旧页面硬塞进新容器”

所以当前策略是先把 contract 做小、做清楚、做稳定，再接真实能力。
