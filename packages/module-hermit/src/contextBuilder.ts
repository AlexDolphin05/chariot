import type { SniffSnapshot } from "@chariot/types";

export type HermitContext = {
  scope: "board" | "project";
  summary: string;
  entities: string[];
  relations: Array<{ from: string; to: string; type: string }>;
  risks: string[];
  suggestions: string[];
};

type HermitWorkspaceSeed = Omit<HermitContext, "scope">;

const WORKSPACE_CONTEXTS: Record<string, HermitWorkspaceSeed> = {
  "workspace-hermit": {
    summary:
      "HERMIT is the cognition layer: layered context, deep sniff, project interpretation, and graph-shaped workspace memory.",
    entities: [
      "contextAssembler",
      "deepSniff",
      "profileBuilder",
      "contextPipeline",
      "project interpretation",
    ],
    relations: [
      { from: "contextAssembler", to: "profileBuilder", type: "feeds" },
      { from: "deepSniff", to: "contextPipeline", type: "enriches" },
      { from: "project interpretation", to: "workspace memory", type: "depends-on" },
    ],
    risks: [
      "Avoid dragging HERMIT workflow pages into Chariot; reuse the context pipeline instead.",
    ],
    suggestions: [
      "Start by extracting layered context and sniff snapshot builders.",
      "Keep board-scope and project-scope runners separate from UI.",
    ],
  },
  "workspace-planner": {
    summary:
      "Emergency Planner is the constraint layer: planning windows, conflict detection, urgency semantics, and scheduling snapshots.",
    entities: [
      "planningWindow",
      "autoBlocks",
      "checkTimeConflicts",
      "scheduler",
      "project semantics",
    ],
    relations: [
      { from: "planningWindow", to: "scheduler", type: "bounds" },
      { from: "autoBlocks", to: "checkTimeConflicts", type: "supplies" },
      { from: "urgency semantics", to: "project semantics", type: "refines" },
    ],
    risks: [
      "Do not port the full planner home page before the shared snapshot model is stable.",
    ],
    suggestions: [
      "Lift conflict detection into a pure planner module first.",
      "Keep global and project snapshots as separate entry points.",
    ],
  },
  "workspace-userkiller": {
    summary:
      "Userkiller is the automation layer: session state, workflow execution, artifacts, and template semantics behind a legacy Python bridge.",
    entities: [
      "session_manager",
      "workflow_engine",
      "template_manager",
      "artifact loader",
      "legacy bridge",
    ],
    relations: [
      { from: "session_manager", to: "workflow_engine", type: "owns" },
      { from: "workflow_engine", to: "artifact loader", type: "produces" },
      { from: "template_manager", to: "legacy bridge", type: "requires" },
    ],
    risks: [
      "Keep Userkiller adapter-only for phase one; avoid a premature Python-to-TS rewrite.",
    ],
    suggestions: [
      "Expose session and artifact contracts in TypeScript first.",
      "Treat templates and execution logs as artifacts, not UI pages.",
    ],
  },
};

export function buildBoardHermitContext(): HermitContext {
  return {
    scope: "board",
    summary:
      "Board scope is watching three capability domains: cognition, scheduling, and automation. Chariot should unify their contracts before any full visual migration.",
    entities: ["HERMIT", "emergency-planner", "userkiller", "board scope", "workbench scope"],
    relations: [
      { from: "HERMIT", to: "emergency-planner", type: "interprets-for" },
      { from: "emergency-planner", to: "userkiller", type: "constrains" },
      { from: "board scope", to: "workbench scope", type: "funnels-into" },
    ],
    risks: [
      "The shell can drift if model contracts stay implicit or UI-specific.",
      "Board visuals should remain placeholder-only until Tia owns that layer.",
    ],
    suggestions: [
      "Keep ProjectCard, Workspace, SniffSnapshot, and PlannerSnapshot stable.",
      "Use the board bar for cross-project sniffing and the workbench for project context.",
    ],
  };
}

export function buildWorkspaceHermitContext(workspaceId: string): HermitContext {
  const seed =
    WORKSPACE_CONTEXTS[workspaceId] ?? {
      summary: `Workspace ${workspaceId} is ready for a project-scope Hermit adapter.`,
      entities: ["workspace", "module manifest", "snapshot"],
      relations: [{ from: "workspace", to: "snapshot", type: "contains" }],
      risks: ["Mock fallback in use."],
      suggestions: ["Add a workspace-specific context builder."],
    };

  return {
    scope: "project",
    ...seed,
  };
}

export function toSniffSnapshot(ctx: HermitContext): SniffSnapshot {
  return {
    scope: ctx.scope,
    summary: ctx.summary,
    entities: ctx.entities,
    relations: ctx.relations,
    risks: ctx.risks,
    suggestions: ctx.suggestions,
    updatedAt: Date.now(),
  };
}

export function buildBoardSniffSnapshot(): SniffSnapshot {
  return toSniffSnapshot(buildBoardHermitContext());
}

export function buildWorkspaceSniffSnapshot(workspaceId: string): SniffSnapshot {
  return toSniffSnapshot(buildWorkspaceHermitContext(workspaceId));
}
