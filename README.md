# Chariot

统一前端壳项目，整合 HERMIT、emergency-planner、userkiller 三个已有项目的能力。

## 为什么存在

Chariot 不是把三个系统硬拼到一起，而是建立一个统一前端壳：

- **Hermit** = 系统认知层（context building、sniff、parsing、map）
- **Emergency-Planner** = 系统约束/排程层（conflict detection、scheduling）
- **Board/Map** = 系统世界层（项目卡片、画布，由 Tia 负责视觉）

## 当前阶段在做什么

- 完成 Alex 负责的开荒准备：monorepo 骨架、共享类型、内核、模块占位、最小可运行壳
- 不实现 Tia 的完整 Board 视觉
- 不迁移 userkiller Python 核心
- 先统一模型，再统一功能

## 目录结构

```
chariot/
├── apps/
│   └── web/              # 主应用壳
├── packages/
│   ├── types/            # 共享类型
│   ├── kernel/           # Zustand store、EventBus、ModuleRegistry、WorkspaceRuntime
│   ├── ui/               # 共享 UI 基础
│   ├── board/            # Board 运行时占位
│   ├── workbench/        # 工作区核心
│   ├── module-hermit/    # Hermit 模块壳
│   ├── module-planner/   # Planner 模块壳
│   └── module-userkiller/ # Userkiller 模块接口占位
└── docs/
```

## 如何启动

```bash
pnpm install
pnpm dev
```

访问 http://localhost:5173/

## 与三个项目的关系

| 项目 | 角色 | 复用策略 |
|------|------|----------|
| HERMIT | 系统认知层 | 提炼 context building、sniff、parsing 能力；不搬页面 |
| emergency-planner | 系统约束/排程层 | 提炼 planning window、conflict detection 能力；不搬页面 |
| userkiller | 自动化工作流层 | 只做 adapter interface + mock；不重写 Python |

详见 [docs/project-analysis.md](docs/project-analysis.md)。

## 当前边界

只完成 Alex 这边的开荒准备。Tia 负责的 Board 完整视觉、post-it 动画/交互等后续接入。
