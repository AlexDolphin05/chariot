import type { PlannerSnapshot } from "@chariot/types";
import {
  buildGlobalPlanningSnapshot,
  buildProjectPlanningSnapshot,
} from "./snapshotBuilder";

export const mockGlobalPlannerSnapshot: PlannerSnapshot =
  buildGlobalPlanningSnapshot();

export function mockProjectPlannerSnapshot(
  workspaceId: string,
): PlannerSnapshot {
  return buildProjectPlanningSnapshot(workspaceId);
}
