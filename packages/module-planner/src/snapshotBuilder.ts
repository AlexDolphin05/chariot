import type { PlannerSnapshot } from "@chariot/types";

const WORKSPACE_PLANNER_SNAPSHOTS: Record<string, Omit<PlannerSnapshot, "scope" | "updatedAt">> =
  {
    "workspace-hermit": {
      conflicts: [
        {
          id: "hermit-contract-priority",
          type: "priority",
          message:
            "Stabilize shared sniff and memory contracts before importing HERMIT-specific workflow UI.",
          relatedProjectIds: ["project-hermit"],
        },
      ],
      suggestions: [
        "Extract contextAssembler and profileBuilder semantics before any page migration.",
      ],
    },
    "workspace-planner": {
      conflicts: [
        {
          id: "planner-dependency-window",
          type: "dependency",
          message:
            "Planning window rules and conflict detection should land before any schedule-heavy screens.",
          relatedProjectIds: ["project-planner"],
        },
      ],
      suggestions: [
        "Map planningWindow.ts and autoBlocks.ts into a pure snapshot builder first.",
      ],
    },
    "workspace-userkiller": {
      conflicts: [
        {
          id: "userkiller-resource-bridge",
          type: "resource",
          message:
            "Userkiller remains adapter-only until its Python workflow/session surface is formalized.",
          relatedProjectIds: ["project-userkiller"],
        },
      ],
      suggestions: [
        "Keep session, artifact, and template contracts thin for phase one.",
      ],
    },
  };

export function buildGlobalPlanningSnapshot(): PlannerSnapshot {
  return {
    scope: "global",
    conflicts: [
      {
        id: "global-priority-contracts",
        type: "priority",
        message:
          "HERMIT and emergency-planner both need first-pass contract extraction; keep that work ahead of UI polish.",
        relatedProjectIds: ["project-hermit", "project-planner"],
      },
      {
        id: "global-resource-userkiller",
        type: "resource",
        message:
          "Userkiller should stay on the adapter path until session and artifact bridges are proven.",
        relatedProjectIds: ["project-userkiller"],
      },
    ],
    suggestions: [
      "Finish shared types and workspace runtime before migrating source logic.",
      "Let the board surface conflicts, and keep detailed scheduling inside the workbench.",
    ],
    updatedAt: Date.now(),
  };
}

export function buildProjectPlanningSnapshot(
  workspaceId: string
): PlannerSnapshot {
  const seed =
    WORKSPACE_PLANNER_SNAPSHOTS[workspaceId] ?? {
      conflicts: [],
      suggestions: ["Add a project planner mock for this workspace."],
    };

  return {
    scope: "project",
    conflicts: seed.conflicts,
    suggestions: seed.suggestions,
    updatedAt: Date.now(),
  };
}
