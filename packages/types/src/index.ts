/**
 * @chariot/types — 第一阶段共享契约。
 *
 * 原则：统一模型优先于统一 UI。
 * 这里的类型是 Board / Workbench / Kernel / Modules 之间唯一的通信语言，
 * 其它 package 一律从这里 import，不允许各自私造重复模型。
 */

// ---------------------------------------------------------------------------
// 基础联合类型
// ---------------------------------------------------------------------------

export type ChariotProjectStatus = "idle" | "active" | "blocked" | "done";

/** Workbench 内建模块 id。后续新增模块时在这里扩展。 */
export type ChariotWorkbenchModuleId = "hermit" | "planner" | "userkiller";

// ---------------------------------------------------------------------------
// ProjectCard / Workspace
// ---------------------------------------------------------------------------

/** Board 上的一张项目卡。视觉呈现（post-it 等）由 Tia 负责，这里只定义数据。 */
export type ChariotProjectCard = {
  id: string;
  title: string;
  summary?: string;
  tags: string[];
  status: ChariotProjectStatus;
  priority?: number;
  workspaceId: string;
  /** Board 画布坐标。当前壳层用简单网格渲染，坐标留给 Tia 的画布使用。 */
  boardPosition: { x: number; y: number };
  /** 提示该项目倾向使用哪些模块，例如 ["hermit", "planner"]。 */
  moduleHints?: string[];
};

/** 打开一张项目卡后进入的工作区。 */
export type ChariotWorkspace = {
  id: string;
  projectId: string;
  name: string;
  metadata: Record<string, unknown>;
  sniff?: SniffSnapshot;
  planner?: PlannerSnapshot;
};

// ---------------------------------------------------------------------------
// Snapshots
// ---------------------------------------------------------------------------

/**
 * Hermit 嗅探结果快照。
 * 对应 HERMIT 的 deepSniff / EnhancedProjectProfile 能力，
 * 第一阶段由 mock builder 生成，未来接真实嗅探管线。
 */
export type SniffSnapshot = {
  scope: "board" | "project";
  summary: string;
  entities: string[];
  relations: Array<{ from: string; to: string; type: string }>;
  risks: string[];
  suggestions: string[];
  updatedAt: number;
};

/**
 * Planner 排程/冲突快照。
 * 字段语义与 emergency-planner 的 plannerSnapshot.ts 对齐，方便未来直接接入。
 */
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

// ---------------------------------------------------------------------------
// Module Manifest
// ---------------------------------------------------------------------------

export type ChariotModuleManifest = {
  id: string;
  name: string;
  kind: "core" | "planner" | "automation" | "insight";
  /** 模块可以出现在哪些空间。 */
  supports: Array<"board" | "workbench">;
  description?: string;
};

// ---------------------------------------------------------------------------
// Scope（Hermit / Planner 双上下文模式的基础）
// ---------------------------------------------------------------------------

/** 外层 Board 作用域：基于全部项目。 */
export type BoardScope = {
  kind: "board";
  projectIds: string[];
  activeProjectId: string | null;
};

/** 内层 Workspace 作用域：基于当前项目。 */
export type WorkspaceScope = {
  kind: "project";
  projectId: string;
  workspaceId: string;
};

export type ChariotScope = BoardScope | WorkspaceScope;

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

/** 系统最小事件集。跨 package 通信一律走 EventBus + 这些事件。 */
export type ChariotEvent =
  | {
      type: "board/project.open";
      payload: { projectId: string; workspaceId: string };
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

export type ChariotEventType = ChariotEvent["type"];
