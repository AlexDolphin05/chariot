import type { ChariotLocale, PlannerSnapshot } from "@chariot/types";
import { buildGlobalPlanningSnapshot } from "./snapshotBuilder";
import { buildProjectPlanningSnapshot } from "./snapshotBuilder";

export function detectGlobalConflicts(
  locale: ChariotLocale = "en",
): PlannerSnapshot {
  return buildGlobalPlanningSnapshot(locale);
}

export function detectProjectConflicts(
  workspaceId: string,
  locale: ChariotLocale = "en",
): PlannerSnapshot {
  return buildProjectPlanningSnapshot(workspaceId, locale);
}
