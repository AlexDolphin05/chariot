# Next Steps For Alex

## 第一优先级

先把真实能力一点点替换掉当前 mock，而不是继续扩展壳层 UI。

建议顺序：

1. Hermit context builder
2. Planner conflict semantics
3. Userkiller session/artifact bridge
4. Workbench 的真实数据展示

## 你接下来优先改哪些文件

### Hermit

- `packages/module-hermit/src/contextBuilder.ts`
- `packages/module-hermit/src/runner.ts`
- `packages/kernel/src/snapshotSync.ts`

先把 HERMIT 的真实 context 层接进 `SniffSnapshot`。

### Planner

- `packages/module-planner/src/snapshotBuilder.ts`
- `packages/module-planner/src/conflictDetector.ts`
- `packages/workbench/src/PlannerPanel.tsx`

先把 emergency-planner 的纯语义接进 `PlannerSnapshot`。

### Userkiller

- `packages/module-userkiller/src/sessionAdapter.ts`
- `packages/module-userkiller/src/artifactLoader.ts`
- `packages/workbench/src/ModuleHost.tsx`

先把 userkiller 的 session / artifact surface 接进来，不碰执行核心。

## 从三个源项目该先抽什么

### 从 HERMIT 先抽

- `contextAssembler.ts`
- `profileBuilder.ts`
- `deepSniff.ts`

目标是让 `buildWorkspaceHermitContext()` 和 `buildBoardHermitContext()` 不再只是 mock。

### 从 emergency-planner 先抽

- `planningWindow.ts`
- `autoBlocks.ts`
- `scheduler.ts`

目标是让 `detectGlobalConflicts()` / `detectProjectConflicts()` 先变成真实语义，再考虑更复杂的排程。

### 从 userkiller 先抽

- `session_manager.py`
- `template_manager.py`
- `modules/file_reader.py`

目标是补齐 adapter，而不是重写 workflow engine。

## 你和 Tia 的对接点

当前最适合稳定下来给 Tia 用的接口是：

- `ChariotProjectCard`
- `SniffSnapshot`
- `PlannerSnapshot`
- `ChariotModuleManifest`
- `ChariotEvent`

Tia 接手 Board 视觉时，最好只消费这些 contract，不直接依赖源项目内部结构。

## 一个实际可执行的下一轮工作包

如果只做一轮高性价比迭代，建议是：

1. 把 HERMIT 的 `contextAssembler` 适配进 `module-hermit`
2. 把 emergency-planner 的 `autoBlocks` + `checkTimeConflicts` 适配进 `module-planner`
3. 保持 userkiller 继续 adapter-only
4. 让 `Workbench` 面板从 mock 文本升级为真实 snapshot 内容
