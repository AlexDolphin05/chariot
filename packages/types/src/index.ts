/**
 * @chariot/types
 *
 * 第一阶段先统一数据模型、作用域和模块契约，
 * 再去接真实能力与更完整的视觉系统。
 */

export type ChariotProjectStatus = "idle" | "active" | "blocked" | "done";
export type ChariotWorkbenchModuleId = "hermit" | "planner" | "userkiller";
export type ChariotLocale = "zh-CN" | "en";
export type ChariotPlannerTaskKind =
  | "task"
  | "meeting"
  | "automation"
  | "review";
export type ChariotPlannerTaskStatus = "planned" | "active" | "done";
export type ChariotAutomationRunStatus = "draft" | "running" | "completed";
export type ChariotAutomationArtifactType =
  | "email"
  | "document"
  | "checklist"
  | "table";
export type HermitPromptCompileMode = "board" | "project";

export type ChariotRelation = {
  from: string;
  to: string;
  type: string;
};

export type ChariotPlannerConflict = {
  id: string;
  type: "time-overlap" | "dependency" | "resource" | "priority";
  message: string;
  relatedProjectIds: string[];
};

export type ChariotHermitExchange = {
  id: string;
  workspaceId: string;
  question: string;
  answer: string;
  createdAt: number;
};

export type ChariotPlannerTask = {
  id: string;
  workspaceId: string;
  title: string;
  kind: ChariotPlannerTaskKind;
  status: ChariotPlannerTaskStatus;
  startsAt: number;
  endsAt: number;
  lane: string;
  notes?: string;
};

export type ChariotAutomationArtifact = {
  id: string;
  name: string;
  type: ChariotAutomationArtifactType;
  summary: string;
  content: string;
};

export type ChariotAutomationRun = {
  id: string;
  workspaceId: string;
  templateId: string;
  templateName: string;
  brief: string;
  status: ChariotAutomationRunStatus;
  createdAt: number;
  artifacts: ChariotAutomationArtifact[];
};

export type HermitPromptSection = {
  id: string;
  label: string;
  content: string;
};

export type HermitPromptCompileRequest = {
  locale: ChariotLocale;
  mode: HermitPromptCompileMode;
  question: string;
  projectTitle?: string;
  workspaceName?: string;
  sniffSummary: string;
  plannerSummary?: string;
  entities: string[];
  risks: string[];
  suggestions: string[];
};

export type HermitPromptCompileResult = {
  title: string;
  mode: HermitPromptCompileMode;
  systemPrompt: string;
  userPrompt: string;
  compiledPrompt: string;
  notes: string[];
  sections: HermitPromptSection[];
  updatedAt: number;
};

export type ChariotProjectCard = {
  id: string;
  title: string;
  summary?: string;
  tags: string[];
  status: ChariotProjectStatus;
  priority?: number;
  workspaceId: string;
  boardPosition: { x: number; y: number };
  moduleHints?: string[];
};

export type ChariotWorkspace = {
  id: string;
  projectId: string;
  name: string;
  metadata: Record<string, unknown>;
  sniff?: SniffSnapshot;
  planner?: PlannerSnapshot;
};

export type SniffSnapshot = {
  scope: "board" | "project";
  summary: string;
  entities: string[];
  relations: ChariotRelation[];
  risks: string[];
  suggestions: string[];
  updatedAt: number;
};

export type PlannerSnapshot = {
  scope: "global" | "project";
  conflicts: ChariotPlannerConflict[];
  suggestions: string[];
  updatedAt: number;
};

export type ChariotModuleManifest = {
  id: string;
  name: string;
  kind: "core" | "planner" | "automation" | "insight";
  supports: Array<"board" | "workbench">;
  description?: string;
};

export type BoardScope = {
  kind: "board";
  projectIds: string[];
  workspaceIds: string[];
  activeProjectId: string | null;
};

export type WorkspaceScope = {
  kind: "project";
  projectId: string;
  workspaceId: string;
};

export type ChariotEvent =
  | {
      type: "board/project.open";
      payload: { projectId: string; workspaceId: string | null };
    }
  | {
      type: "board/hermit.ask";
      payload: { question: string; scope: BoardScope };
    }
  | {
      type: "workspace/active.changed";
      payload: { projectId: string | null; workspaceId: string | null };
    }
  | {
      type: "workbench/module.switch";
      payload: { moduleId: ChariotWorkbenchModuleId };
    }
  | {
      type: "planner/conflicts.updated";
      payload: { workspaceId: string | null; snapshot: PlannerSnapshot };
    };
