# Chariot 契约

第一阶段重点：统一模型。以下类型定义在 `@chariot/types` 中。

## ChariotProjectCard

项目卡片，用于 Board 展示。

```typescript
type ChariotProjectCard = {
  id: string;
  title: string;
  summary?: string;
  tags: string[];
  status: "idle" | "active" | "blocked" | "done";
  priority?: number;
  workspaceId: string;
  boardPosition: { x: number; y: number };
  moduleHints?: string[];
};
```

## ChariotWorkspace

工作区，关联项目与 sniff/planner 快照。

```typescript
type ChariotWorkspace = {
  id: string;
  projectId: string;
  name: string;
  metadata: Record<string, unknown>;
  sniff?: SniffSnapshot;
  planner?: PlannerSnapshot;
};
```

## SniffSnapshot

Hermit 嗅探结果快照。

```typescript
type SniffSnapshot = {
  scope: "board" | "project";
  summary: string;
  entities: string[];
  relations: Array<{ from: string; to: string; type: string }>;
  risks: string[];
  suggestions: string[];
  updatedAt: number;
};
```

## PlannerSnapshot

Planner 排程/冲突快照。

```typescript
type PlannerSnapshot = {
  scope: "global" | "project";
  conflicts: Array<{
    id: string;
    type: "time-overlap" | "dependency" | "resource" | "priority";
    message: string;
    relatedProjectIds: string[];
  }>;
  suggestions: string[];
  updatedAt: number;
};
```

## ChariotModuleManifest

模块元信息。

```typescript
type ChariotModuleManifest = {
  id: string;
  name: string;
  kind: "core" | "planner" | "automation" | "insight";
  supports: Array<"board" | "workbench">;
};
```

## ChariotEvent

最小事件联合类型。

- `board/project.open` — 打开项目
- `board/hermit.ask` — 全局 Hermit 提问
- `workspace/active.changed` — 当前 workspace 变更
- `workbench/module.switch` — 切换 workbench 模块
- `planner/conflicts.updated` — Planner 冲突更新

## 为什么这些 contract 是第一阶段重点

统一类型后，HERMIT、emergency-planner、userkiller 的适配层可以基于同一套模型工作，避免各项目数据结构不一致导致的集成成本。
