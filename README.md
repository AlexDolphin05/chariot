# Chariot

Chariot 是一个统一前端壳项目，用来整合桌面上的三个已有系统：

- **HERMIT** → 系统认知层（嗅探、上下文构建、项目解释）
- **emergency-planner** → 系统约束/排程层（时间窗口、冲突检测、排程）
- **userkiller** → 系统自动化层（workflow session、执行状态、artifact）

## 为什么存在

三个系统各自有完整的页面和状态模型，直接拼页面只会得到一个缝合怪。Chariot 的做法是：**不复用页面，复用能力**——先统一数据模型（contract），再把各系统的能力以模块形式接进统一壳。

Chariot 有两个空间：

1. **外层 Board / Canvas**：项目卡、全局 Hermit 输入框、全局排程冲突提示。完整画布视觉由 Tia 负责，当前只有占位布局。
2. **内层 Workbench / Workspace**：打开某个项目后的工作区，包含 Workspace Hermit、Project Planner、Project Map、Userkiller 入口。由 Alex 负责。

## 当前阶段（Stage 1）

只完成 Alex 这边的开荒准备：统一骨架 + contract + module interface + mock runtime。

- ✅ pnpm monorepo，全 TypeScript
- ✅ 共享类型（`@chariot/types`）
- ✅ 内核（store / event bus / module registry / workspace runtime）
- ✅ Board / Workbench 占位骨架
- ✅ Hermit / Planner / Userkiller 三个模块的壳与 mock
- ❌ 不做：Tia 的 Board 视觉系统、post-it 动画、业务功能迁移、userkiller Python 核心重写、后端服务

## 目录结构

```text
chariot/
├── apps/
│   └── web/                  # Vite + React 主壳（唯一的 app，无后端）
├── packages/
│   ├── types/                # 共享 contract（所有 package 的类型来源）
│   ├── kernel/               # store、event bus、module registry、runtime、snapshot sync
│   ├── ui/                   # PanelShell、Placeholder、语义 tokens
│   ├── board/                # BoardPane、BoardProjectCard、GlobalHermitBar、GlobalPlannerOverlay
│   ├── workbench/            # WorkbenchPane、各模块面板、PlanetDock、ModuleHost
│   ├── module-hermit/        # Hermit 双作用域 context builder + mock runner
│   ├── module-planner/       # Planner 双作用域 snapshot builder + mock 冲突检测
│   └── module-userkiller/    # session/artifact adapter contract + legacy bridge notes
└── docs/                     # 架构、契约、项目分析、下一步
```

## 如何启动

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm typecheck  # 类型检查
pnpm build      # 生产构建
```

### 最小可运行行为

- 左侧 Board 区：三张 mock 项目卡（HERMIT / Emergency Planner / Userkiller）+ 全局冲突提示条
- 右侧 Workbench 区：点击项目卡后显示该项目的 Hermit / Planner / Project Map 面板
- 右侧 PlanetDock：在 Hermit / Planner / Userkiller 模块间切换
- 底部常驻 Global Hermit 输入框：board scope 的 mock 问答

## 与三个源项目的关系

| 源项目 | Chariot 中的角色 | 复用策略 |
|---|---|---|
| HERMIT | `module-hermit` | 提炼 deepSniff / contextPipeline / projectIntelligence 能力，页面不搬 |
| emergency-planner | `module-planner` | 类型已与其 plannerSnapshot.ts 对齐；scheduler / autoBlocks / planningWindow 是首批要抽的能力 |
| userkiller | `module-userkiller` | 只做 HTTP 桥接 contract，Python 核心不迁移 |

详见 [docs/project-analysis.md](docs/project-analysis.md)。

## 当前边界

本仓库当前只覆盖 Alex 的开荒部分。Tia 的 Board 视觉系统将在 `packages/board` 内展开，数据与事件 contract 已就位（`ChariotProjectCard.boardPosition`、`board/*` 事件）。
