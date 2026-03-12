# Alex 下一步工作

## 优先修改的文件

1. **packages/module-hermit** — 从 HERMIT 抽取 `contextAssembler`、`profileBuilder`、`deepSniff` 能力，替换 mock
2. **packages/module-planner** — 从 emergency-planner 抽取 `autoBlocks`、`checkTimeConflicts`、`scheduler` 能力，替换 mock
3. **packages/kernel** — 完善 snapshot sync helpers，连接 Hermit/Planner 模块与 workspace 状态

## 从 HERMIT 先抽的能力

- `contextAssembler.ts` — 分层上下文 (system/project/memory/task)
- `profileBuilder.ts` — ProjectProfile → LLM 上下文字符串
- `search/retrieve.ts` — 检索管道
- `docparse.ts` — 文档解析（可选，按需）

## 从 emergency-planner 先抽的能力

- `planningWindow.ts` — 规划窗口、日边界
- `autoBlocks.ts` — 时间块、`checkTimeConflicts`
- `scheduler.ts` — 硬约束调度

## 与 Tia 对接

- **Board 区**：当前为占位骨架。Tia 负责项目卡片/post-it 的完整视觉、画布交互、Global Planner Overlay 的展示。
- **Project Map**：当前为占位。Tia 负责地图/依赖图视觉。
- **契约**：保持 `ChariotProjectCard`、`SniffSnapshot`、`PlannerSnapshot` 等类型稳定，Tia 的 UI 消费这些数据即可。

## 后续模块接入顺序建议

1. Hermit — 先接 context building，再接 LLM
2. Planner — 先接 conflict detection，再接 scheduler
3. Userkiller — 保持 adapter 接口，待 Python 后端可调用时再实现 bridge
