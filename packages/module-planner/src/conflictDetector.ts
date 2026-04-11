import type { PlannerSnapshot } from "@chariot/types";
import { buildGlobalPlanningSnapshot } from "./snapshotBuilder";
import { buildProjectPlanningSnapshot } from "./snapshotBuilder";

export function detectGlobalConflicts(): PlannerSnapshot {
  return buildGlobalPlanningSnapshot();
}

export function detectProjectConflicts(workspaceId: string): PlannerSnapshot {
  return buildProjectPlanningSnapshot(workspaceId);
}
