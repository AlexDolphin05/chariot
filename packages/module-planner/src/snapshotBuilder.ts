import type { ChariotLocale, PlannerSnapshot } from "@chariot/types";

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

export function buildGlobalPlanningSnapshot(
  locale: ChariotLocale = "en",
): PlannerSnapshot {
  if (locale === "zh-CN") {
    return {
      scope: "global",
      conflicts: [
        {
          id: "global-priority-contracts",
          type: "priority",
          message:
            "HERMIT 和 emergency-planner 都需要先完成第一轮 contract 抽取，优先级应高于 UI 打磨。",
          relatedProjectIds: ["project-hermit", "project-planner"],
        },
        {
          id: "global-resource-userkiller",
          type: "resource",
          message:
            "Userkiller 仍应保持 adapter 路线，直到 session 与 artifact bridge 稳定。",
          relatedProjectIds: ["project-userkiller"],
        },
      ],
      suggestions: [
        "先把共享类型和 workspace runtime 做稳，再接真实源项目能力。",
        "让 Board 负责全局冲突提醒，让 Workbench 负责项目级解释。",
      ],
      updatedAt: Date.now(),
    };
  }

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
  workspaceId: string,
  locale: ChariotLocale = "en",
): PlannerSnapshot {
  if (locale === "zh-CN") {
    const localizedSeeds: Record<string, Omit<PlannerSnapshot, "scope" | "updatedAt">> =
      {
        "workspace-hermit": {
          conflicts: [
            {
              id: "hermit-contract-priority",
              type: "priority",
              message:
                "在导入 HERMIT 的 workflow UI 之前，应先稳定 sniff 与 memory contract。",
              relatedProjectIds: ["project-hermit"],
            },
          ],
          suggestions: ["优先抽取 contextAssembler 与 profileBuilder 的语义。"],
        },
        "workspace-planner": {
          conflicts: [
            {
              id: "planner-dependency-window",
              type: "dependency",
              message:
                "planning window 规则与 conflict detection 应先于大块 schedule UI 落地。",
              relatedProjectIds: ["project-planner"],
            },
          ],
          suggestions: ["先把 planningWindow.ts 与 autoBlocks.ts 映射成纯 snapshot builder。"],
        },
        "workspace-userkiller": {
          conflicts: [
            {
              id: "userkiller-resource-bridge",
              type: "resource",
              message:
                "在 Python workflow/session surface 没稳定前，Userkiller 继续保持 adapter-only。",
              relatedProjectIds: ["project-userkiller"],
            },
          ],
          suggestions: ["第一阶段继续保持 session、artifact、template contract 的轻接口。"],
        },
      };

    const seed = localizedSeeds[workspaceId] ?? {
      conflicts: [],
      suggestions: ["为这个工作区补一条项目级 planner mock。"],
    };

    return {
      scope: "project",
      conflicts: seed.conflicts,
      suggestions: seed.suggestions,
      updatedAt: Date.now(),
    };
  }

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
