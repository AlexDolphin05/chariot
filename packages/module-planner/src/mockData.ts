/**
 * MOCK: Planner 模块占位数据
 */
import type { PlannerSnapshot } from "@chariot/types";

export const mockGlobalPlannerSnapshot: PlannerSnapshot = {
  scope: "global",
  conflicts: [
    {
      id: "g1",
      type: "time-overlap",
      message: "project-a and project-b overlap on Wed 14:00",
      relatedProjectIds: ["project-a", "project-b"],
    },
  ],
  suggestions: ["Reschedule project-b to Thu", "Consider merging similar tasks"],
  updatedAt: Date.now(),
};

export const mockProjectPlannerSnapshot = (
  workspaceId: string
): PlannerSnapshot => ({
  scope: "project",
  conflicts: [
    {
      id: "p1",
      type: "dependency",
      message: `task-2 blocks task-3 in ${workspaceId}`,
      relatedProjectIds: [workspaceId],
    },
  ],
  suggestions: ["Complete task-2 first"],
  updatedAt: Date.now(),
});
