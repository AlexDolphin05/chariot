/**
 * Planner 快照构建器
 * 支持 global scope 和 project scope
 * 未来接入 emergency-planner 的 autoBlocks / scheduler
 */
import type { PlannerSnapshot } from "@chariot/types";

/** MOCK: 构建全局排程快照 */
export function buildGlobalPlanningSnapshot(): PlannerSnapshot {
  return {
    scope: "global",
    conflicts: [
      {
        id: "c1",
        type: "time-overlap",
        message: "[MOCK] project-a and project-b overlap on Wed 14:00",
        relatedProjectIds: ["project-a", "project-b"],
      },
    ],
    suggestions: ["[MOCK] Reschedule project-b to Thu"],
    updatedAt: Date.now(),
  };
}

/** MOCK: 构建项目级排程快照 */
export function buildProjectPlanningSnapshot(
  workspaceId: string
): PlannerSnapshot {
  return {
    scope: "project",
    conflicts: [
      {
        id: "c2",
        type: "dependency",
        message: `[MOCK] task-2 depends on task-1 in ${workspaceId}`,
        relatedProjectIds: [workspaceId],
      },
    ],
    suggestions: ["[MOCK] Complete task-1 before task-2"],
    updatedAt: Date.now(),
  };
}
