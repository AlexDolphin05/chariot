/**
 * @chariot/types — 共享类型定义
 * 第一阶段重点：统一模型优先于统一 UI
 */

// --- Project & Workspace ---

export type ChariotProjectCard = {
  id: string;
  title: string;
  summary?: string;
  tags: string[];
  status: "idle" | "active" | "blocked" | "done";
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

// --- Snapshots ---

export type SniffSnapshot = {
  scope: "board" | "project";
  summary: string;
  entities: string[];
  relations: Array<{ from: string; to: string; type: string }>;
  risks: string[];
  suggestions: string[];
  updatedAt: number;
};

export type PlannerSnapshot = {
  scope: "global" | "project";
  conflicts: Array<{
    id: string;
    type: "time-overlap" | "dependency" | "resource" | "priority";
    message: string;
    relatedProjectIds: string[];
  }>;
  suggestions: string[];
  updatedAt: number;
};

// --- Module ---

export type ChariotModuleManifest = {
  id: string;
  name: string;
  kind: "core" | "planner" | "automation" | "insight";
  supports: Array<"board" | "workbench">;
};

// --- Scopes ---

export type BoardScope = "board";
export type WorkspaceScope = "workbench";

// --- Events ---

export type ChariotEvent =
  | { type: "board/project.open"; payload: { projectId: string } }
  | { type: "board/hermit.ask"; payload: { question: string } }
  | { type: "workspace/active.changed"; payload: { workspaceId: string | null } }
  | { type: "workbench/module.switch"; payload: { moduleId: string } }
  | { type: "planner/conflicts.updated"; payload: { snapshot: PlannerSnapshot } };
