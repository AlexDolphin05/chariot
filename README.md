# Chariot

Chariot 是一个统一前端壳项目，用来把桌面上的 `HERMIT`、`emergency-planner`、`userkiller` 三个系统接到同一个工作空间里。

第一阶段目标不是把三个项目整页搬进来，而是先把共享模型、内核、模块契约和可运行壳层搭稳：

- `HERMIT` 提供系统认知层能力
- `emergency-planner` 提供约束与排程层能力
- `userkiller` 提供自动化会话与产物层能力

当前实现只覆盖 Alex 负责的开荒准备，不做 Tia 负责的完整 Board 视觉系统、post-it 动画或完整业务迁移。

## 为什么存在

三个源项目都已经有自己的页面、状态模型和交互假设，但 Chariot 需要的是一个统一壳，而不是三个应用的拼接页。

第一阶段优先统一这些 contract：

- `ChariotProjectCard`
- `ChariotWorkspace`
- `SniffSnapshot`
- `PlannerSnapshot`
- `ChariotModuleManifest`
- `ChariotEvent`

在这个基础上，Board 可以做全局嗅探和冲突提示，Workbench 可以做项目级工作流与模块入口。

## 当前阶段做了什么

- 建好 `pnpm workspace` monorepo
- 建好 `apps/web` 主壳
- 建好共享类型、kernel、事件总线、module registry、workspace runtime
- 建好 `board` / `workbench` 骨架
- 建好 `module-hermit` / `module-planner` / `module-userkiller` 占位模块
- 写入项目分析、架构、契约、下一步文档
- 接通 mock 项目卡切换 active workspace 的最小闭环

## 目录结构

```text
chariot/
├── apps/
│   └── web/                    # Vite + React 主应用壳
├── packages/
│   ├── types/                  # 共享 contract
│   ├── kernel/                 # store, event bus, module registry, runtime
│   ├── ui/                     # panel shell, map node, tokens, placeholders
│   ├── board/                  # BoardPane, BoardProjectCard, GlobalHermitBar
│   ├── workbench/              # WorkbenchPane, ProjectMapPanel, PlanetDock
│   ├── module-hermit/          # board/project context builder 与 runner 占位
│   ├── module-planner/         # global/project snapshot 与冲突占位
│   └── module-userkiller/      # session/artifact adapter contract 占位
├── docs/
│   ├── architecture.md
│   ├── contracts.md
│   ├── next-steps-alex.md
│   └── project-analysis.md
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## 如何启动

```bash
pnpm install
pnpm dev
```

默认访问地址是 [http://localhost:5173](http://localhost:5173)。

### 当前最小可运行行为

- 页面是固定左右布局：左侧 `BoardPane`，右侧 `WorkbenchPane`
- 底部常驻 `Global Hermit` 输入条
- 预置三张 mock 项目卡：`HERMIT`、`Emergency Planner`、`Userkiller`
- 点击任意项目卡会更新 `activeProjectId` / `activeWorkspaceId`
- 右侧会同步显示该项目的标题、Hermit mock 信息、Planner mock 信息、Project Map 占位
- `PlanetDock` 提供 `Hermit` / `Planner` / `Userkiller` 模块入口

## 与三个源项目的关系

### HERMIT

Chariot 会优先复用它的上下文构建、嗅探、项目解释、检索和图结构能力，不直接复用 workflow 页面。

### emergency-planner

Chariot 会优先复用它的 planning window、conflict detection、scheduler、task semantics，不直接复用日历和 onboarding 页面。

### userkiller

Chariot 当前只保留 session / artifact / workflow bridge contract，不重写 Python 核心执行链。

详见 [docs/project-analysis.md](docs/project-analysis.md)。

## 当前边界

当前仓库只完成 Alex 这边的开荒准备：

- 做统一骨架
- 做 contract
- 做 module interface
- 做 mock runtime

当前不做：

- Tia 负责的完整 Board 美术和交互系统
- post-it 复杂动画
- userkiller Python 核心迁移
- 后端服务整合
