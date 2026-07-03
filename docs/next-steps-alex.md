# Alex 的下一步

## 立即验证（5 分钟）

```bash
cd ~/Desktop/Chariot
pnpm install
pnpm typecheck   # 应无错误
pnpm dev         # 打开 http://localhost:5173
```

验收点：左右布局、三张卡、点卡后右侧变化、PlanetDock 切模块、底部 Hermit 条能问答（mock）。

## 优先改的文件（按顺序）

1. **`packages/module-planner/src/conflictDetector.ts`** —— 第一个从 mock 换真实的地方。把 emergency-planner 的 `plannerSnapshot.ts` 逻辑搬过来（类型已对齐，成本最低，能最快建立"mock → 真实"的替换范式）。
2. **`packages/module-hermit/src/mockSniff.ts`** —— 第二个替换点。先做一个"读取本地项目目录 → 产出 SniffSnapshot"的极简版（可参考 HERMIT `deepSniff.ts` 的 `collectCodePaths` + 文件分类，不必上模型）。
3. **`packages/module-userkiller/src/sessionAdapter.ts`** —— 起一个真实 userkiller 后端，把 `listSessions` 换成 `GET /api/sessions`，验证桥接假设。
4. **`packages/kernel/src/seed.ts`** —— 当上面任何一步产生真实数据后，让 seed 支持从真实来源初始化。

## 从源项目抽能力的顺序建议

1. emergency-planner：`plannerSnapshot.ts` → `autoBlocks.ts`（checkTimeConflicts）→ `scheduler.ts`（最重，最后抽）
2. HERMIT：`projectIntelligence/fileClassifier.ts` + `dependencyGraph.ts`（Project Map 需要）→ `contextPipeline.ts`（需要模型和检索基建，放后面）
3. userkiller：只按 legacyBridgeNotes.ts 里的顺序接 API，不抽代码

注意：HERMIT / emergency-planner 的 server 代码依赖 Express + Drizzle 环境，抽取时先复制纯函数部分（scheduler、planningWindow、fileClassifier 都接近纯函数），不要把 db 依赖带进来。

## 和 Tia 的对接

- Tia 的工作区在 `packages/board`，她可以整体重写 `BoardPane` / `BoardProjectCard` 的视觉，只要：
  - 数据仍从 `useKernelStore` 读；
  - 打开项目仍调 `openProject(projectId)`；
  - 卡片定位用 `card.boardPosition`（数据层已就位）。
- `GlobalHermitBar` 的位置和行为 contract（底部常驻、board scope）不要动，视觉可以随便改。
- 交接时给她看：`docs/contracts.md` + `packages/types/src/index.ts`，这两个文件就是全部接口。

## 已知债务 / 刻意的省略

- 事件订阅目前只有 bootstrap 用了 `board/project.open`，其余事件已定义未消费（预留）。
- `ModuleHost` 是 switch 硬编码，模块多了以后改成 registry 驱动的组件映射。
- 没有测试。第一个该测的是 kernel 的 runtime + eventBus（纯逻辑，好测）。
- 没有 lint 配置。需要时加 eslint flat config，别在骨架期引入。
