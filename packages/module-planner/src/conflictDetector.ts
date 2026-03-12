/**
 * Planner 冲突检测占位
 * 未来接入 emergency-planner 的 checkTimeConflicts / scheduler
 */
import type { PlannerSnapshot } from "@chariot/types";
import { buildGlobalPlanningSnapshot } from "./snapshotBuilder";
import { buildProjectPlanningSnapshot } from "./snapshotBuilder";

/** MOCK: 检测全局冲突 */
export function detectGlobalConflicts(): PlannerSnapshot {
  return buildGlobalPlanningSnapshot();
}

/** MOCK: 检测项目内冲突 */
export function detectProjectConflicts(workspaceId: string): PlannerSnapshot {
  return buildProjectPlanningSnapshot(workspaceId);
}
