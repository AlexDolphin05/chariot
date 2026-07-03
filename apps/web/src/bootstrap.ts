/**
 * Bootstrap — 应用启动时的接线层：
 *   1. 注册内建模块
 *   2. 灌入 mock seed 数据
 *   3. 订阅事件，把模块产出的快照写回 kernel
 * 模块之间不直接依赖，全部经由 kernel 的 event bus + snapshot sync。
 */
import {
  eventBus,
  registerModule,
  seedKernel,
  syncGlobalPlanner,
  syncWorkspacePlanner,
  syncWorkspaceSniff,
} from "@chariot/kernel";
import { hermitManifest, buildMockProjectSniff } from "@chariot/module-hermit";
import {
  plannerManifest,
  buildGlobalPlanningSnapshot,
  buildProjectPlanningSnapshot,
} from "@chariot/module-planner";
import { userkillerManifest } from "@chariot/module-userkiller";

let booted = false;

export function bootstrapChariot(): void {
  if (booted) return; // 防止 React StrictMode / HMR 重复接线
  booted = true;

  // 1. 模块注册
  registerModule(hermitManifest);
  registerModule(plannerManifest);
  registerModule(userkillerManifest);

  // 2. mock 数据
  seedKernel();

  // 3. 事件接线：打开项目 → 生成该项目的 sniff / planner 快照
  eventBus.subscribe("board/project.open", ({ payload }) => {
    syncWorkspaceSniff(payload.workspaceId, buildMockProjectSniff(payload.workspaceId));
    syncWorkspacePlanner(
      payload.workspaceId,
      buildProjectPlanningSnapshot(payload.workspaceId),
    );
  });

  // 4. 启动时生成一次全局 planner 快照（global scope 冲突检测）
  syncGlobalPlanner(buildGlobalPlanningSnapshot());
}
