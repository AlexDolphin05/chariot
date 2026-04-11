import type { PlannerSnapshot, SniffSnapshot } from "@chariot/types";
import { publish } from "./eventBus";
import { useKernelStore } from "./store";

export function syncWorkspaceSniffSnapshot(
  workspaceId: string,
  snapshot: SniffSnapshot,
): void {
  useKernelStore.getState().updateWorkspace(workspaceId, (workspace) => ({
    ...workspace,
    sniff: snapshot,
  }));
}

export function syncWorkspacePlannerSnapshot(
  workspaceId: string,
  snapshot: PlannerSnapshot,
): void {
  useKernelStore.getState().updateWorkspace(workspaceId, (workspace) => ({
    ...workspace,
    planner: snapshot,
  }));

  publish({
    type: "planner/conflicts.updated",
    payload: {
      workspaceId,
      snapshot,
    },
  });
}

export function syncWorkspaceSnapshots(
  workspaceId: string,
  snapshots: {
    sniff?: SniffSnapshot;
    planner?: PlannerSnapshot;
  },
): void {
  if (snapshots.sniff) {
    syncWorkspaceSniffSnapshot(workspaceId, snapshots.sniff);
  }

  if (snapshots.planner) {
    syncWorkspacePlannerSnapshot(workspaceId, snapshots.planner);
  }
}
