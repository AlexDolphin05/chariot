/**
 * Hermit 上下文构建器
 * 支持 board scope 和 project scope 两种模式
 * 未来接入 HERMIT 的 contextAssembler / profileBuilder
 */
import type { SniffSnapshot } from "@chariot/types";

export type HermitContext = {
  scope: "board" | "project";
  summary: string;
  entities: string[];
  relations: Array<{ from: string; to: string; type: string }>;
  risks: string[];
  suggestions: string[];
};

/** MOCK: 基于全部项目构建 board 上下文 */
export function buildBoardHermitContext(): HermitContext {
  return {
    scope: "board",
    summary: "[MOCK] Board scope: 3 projects, 2 active.",
    entities: ["project-a", "project-b", "project-c"],
    relations: [
      { from: "project-a", to: "project-b", type: "depends" },
      { from: "project-b", to: "project-c", type: "blocks" },
    ],
    risks: ["[MOCK] project-b may block project-c"],
    suggestions: ["[MOCK] Prioritize project-b tasks first"],
  };
}

/** MOCK: 基于 workspace 构建 project 上下文 */
export function buildWorkspaceHermitContext(workspaceId: string): HermitContext {
  return {
    scope: "project",
    summary: `[MOCK] Project scope for workspace ${workspaceId}`,
    entities: [`workspace:${workspaceId}`, "task-1", "task-2"],
    relations: [
      { from: "task-1", to: "task-2", type: "blocks" },
    ],
    risks: ["[MOCK] No critical risks in current project"],
    suggestions: ["[MOCK] Consider completing task-1 before task-2"],
  };
}

/** 将 HermitContext 转为 SniffSnapshot（用于 workspace 存储） */
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
