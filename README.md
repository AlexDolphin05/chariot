# Chariot

统一前端壳项目，整合 HERMIT、emergency-planner、userkiller 三个已有项目的能力。

## 为什么存在

Chariot 不是把三个系统硬拼到一起，而是建立一个统一空间界面：

- **Hermit** = 系统认知层（Global Hermit Bar + Workspace Hermit 面板，非单一输入框）
- **Emergency-Planner** = 系统约束/排程层（Global Planner Overlay + Project Planner Panel）
- **Board/Map** = 系统世界层（Board 为全局画布，Project Map 为局部地图主区域）

**注意**：Chariot 不是 dashboard。Board 是全局画布，不是 sidebar。Project Map 是主空间核心地图，不是辅助信息卡。

## 空间模式

- **Board Mode**（默认）：主视图为完整画布，项目对象散布在画布上，点击进入 Workspace Mode
- **Workspace Mode**：主视图为当前项目空间，Project Map 占据主区域，Workspace Hermit 常驻，Planet Dock 切换 Planner/Userkiller

## 当前阶段在做什么

- 完成 Alex 负责的开荒准备：monorepo 骨架、共享类型、内核、模块占位、最小可运行壳
- 空间语义正确：Board 画布、Workspace 项目空间、Hermit/Planner 分层
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
│   ├── kernel/           # Zustand store、EventBus、ModuleRegistry、WorkspaceRuntime、appViewMode
│   ├── ui/               # 共享 UI 基础、MapNode
│   ├── board/            # BoardCanvasView、GlobalPlannerOverlay
│   ├── workbench/        # WorkspaceView、ProjectMapView、PlanetDock
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
