/**
 * Planner 双作用域快照构建器（MOCK）。
 * global scope：跨项目排程与冲突；project scope：当前项目。
 */
import type { PlannerSnapshot } from "@chariot/types";
import { detectGlobalConflicts, detectProjectConflicts } from "./conflictDetector";

export function buildGlobalPlanningSnapshot(): PlannerSnapshot {
  const conflicts = detectGlobalConflicts();
  return {
    scope: "global",
    conflicts,
    suggestions:
      conflicts.length > 0
        ? ["（mock）建议为并行项目划分独立时间块", "（mock）优先解阻 blocked 项目"]
        : ["（mock）当前没有全局冲突，可以自由排程"],
    updatedAt: Date.now(),
  };
}

export function buildProjectPlanningSnapshot(
  workspaceId: string,
): PlannerSnapshot {
  const conflicts = detectProjectConflicts(workspaceId);
  return {
    scope: "project",
    conflicts,
    suggestions:
      conflicts.length > 0
        ? ["（mock）先处理冲突再安排新任务"]
        : ["（mock）本项目暂无冲突，按优先级推进即可"],
    updatedAt: Date.now(),
  };
}
