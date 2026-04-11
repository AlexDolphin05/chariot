import type { ChariotLocale, SniffSnapshot } from "@chariot/types";

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

export function buildBoardHermitContext(locale: ChariotLocale = "en"): HermitContext {
  if (locale === "zh-CN") {
    return {
      scope: "board",
      summary:
        "Board 作用域正在同时观察三个能力域：认知、排程和自动化。Chariot 应先统一它们的契约，再谈完整视觉迁移。",
      entities: ["HERMIT", "emergency-planner", "userkiller", "board scope", "workbench scope"],
      relations: [
        { from: "HERMIT", to: "emergency-planner", type: "interprets-for" },
        { from: "emergency-planner", to: "userkiller", type: "constrains" },
        { from: "board scope", to: "workbench scope", type: "funnels-into" },
      ],
      risks: [
        "如果共享 contract 不先稳定，壳层很容易再次漂移成旧页面拼接。",
        "Board 视觉目前应继续保持占位，不要提前进入完整美术实现。",
      ],
      suggestions: [
        "先稳定 ProjectCard、Workspace、SniffSnapshot 和 PlannerSnapshot。",
        "把全局嗅探放在底部输入条，把项目级解释留给右侧 Workbench。",
      ],
    };
  }

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

export function buildWorkspaceHermitContext(
  workspaceId: string,
  locale: ChariotLocale = "en",
): HermitContext {
  if (locale === "zh-CN") {
    const localizedContexts: Record<string, HermitWorkspaceSeed> = {
      "workspace-hermit": {
        summary:
          "HERMIT 是认知层：分层上下文、深度嗅探、项目解释，以及面向工作区的记忆与图结构。",
        entities: ["contextAssembler", "deepSniff", "profileBuilder", "contextPipeline", "project interpretation"],
        relations: [
          { from: "contextAssembler", to: "profileBuilder", type: "feeds" },
          { from: "deepSniff", to: "contextPipeline", type: "enriches" },
          { from: "project interpretation", to: "workspace memory", type: "depends-on" },
        ],
        risks: ["不要把 HERMIT 的 workflow 页面直接搬进 Chariot，应先复用上下文链条。"],
        suggestions: ["优先抽 layered context 与 sniff snapshot builder。", "保持 board / project 两种 runner 独立于 UI。"],
      },
      "workspace-planner": {
        summary:
          "Emergency Planner 是约束层：planning window、冲突检测、紧急度语义和排程快照。",
        entities: ["planningWindow", "autoBlocks", "checkTimeConflicts", "scheduler", "project semantics"],
        relations: [
          { from: "planningWindow", to: "scheduler", type: "bounds" },
          { from: "autoBlocks", to: "checkTimeConflicts", type: "supplies" },
          { from: "urgency semantics", to: "project semantics", type: "refines" },
        ],
        risks: ["在共享 snapshot 稳定前，不要先迁移 planner 主页面。"],
        suggestions: ["先把 conflict detection 提炼成纯模块。", "继续区分 global 和 project snapshot。"],
      },
      "workspace-userkiller": {
        summary:
          "Userkiller 是自动化层：会话状态、执行流程、产物和模板语义，都通过遗留 Python 桥接暴露。",
        entities: ["session_manager", "workflow_engine", "template_manager", "artifact loader", "legacy bridge"],
        relations: [
          { from: "session_manager", to: "workflow_engine", type: "owns" },
          { from: "workflow_engine", to: "artifact loader", type: "produces" },
          { from: "template_manager", to: "legacy bridge", type: "requires" },
        ],
        risks: ["第一阶段继续保持 adapter-only，不要提前做 Python 到 TS 的重写。"],
        suggestions: ["先暴露 session 与 artifact contract。", "把模板和执行日志都当成 artifact，而不是页面。"],
      },
    };

    return {
      scope: "project",
      ...(localizedContexts[workspaceId] ?? {
        summary: `工作区 ${workspaceId} 已准备好接入项目级 Hermit 适配器。`,
        entities: ["workspace", "module manifest", "snapshot"],
        relations: [{ from: "workspace", to: "snapshot", type: "contains" }],
        risks: ["当前仍在使用默认 mock。"],
        suggestions: ["补充该工作区的专属 context builder。"],
      }),
    };
  }

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

export function buildBoardSniffSnapshot(locale: ChariotLocale = "en"): SniffSnapshot {
  return toSniffSnapshot(buildBoardHermitContext(locale));
}

export function buildWorkspaceSniffSnapshot(
  workspaceId: string,
  locale: ChariotLocale = "en",
): SniffSnapshot {
  return toSniffSnapshot(buildWorkspaceHermitContext(workspaceId, locale));
}
