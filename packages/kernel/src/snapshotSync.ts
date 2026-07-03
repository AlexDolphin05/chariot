/**
 * Snapshot Sync — 模块产出的快照写回 store 的唯一通道。
 * module-hermit / module-planner 生成快照后调这里，不直接摸 store 内部结构。
 */
import type { PlannerSnapshot, SniffSnapshot } from "@chariot/types";
import { eventBus } from "./eventBus";
import { getKernelState } from "./store";

export function syncWorkspaceSniff(
  workspaceId: string,
  snapshot: SniffSnapshot,
): void {
  getKernelState().patchWorkspace(workspaceId, { sniff: snapshot });
}

export function syncWorkspacePlanner(
  workspaceId: string,
  snapshot: PlannerSnapshot,
): void {
  getKernelState().patchWorkspace(workspaceId, { planner: snapshot });
  eventBus.publish({
    type: "planner/conflicts.updated",
    payload: { workspaceId, snapshot },
  });
}

export function syncGlobalPlanner(snapshot: PlannerSnapshot): void {
  getKernelState().setGlobalPlanner(snapshot);
  eventBus.publish({
    type: "planner/conflicts.updated",
    payload: { workspaceId: null, snapshot },
  });
}
