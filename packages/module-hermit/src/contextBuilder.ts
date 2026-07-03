/**
 * Hermit 双作用域上下文构建器。
 * 关键设计：Hermit 逻辑不写死为"只接受当前项目"，
 * board scope 与 project scope 是两条并存的上下文路径。
 */
import type { BoardScope, SniffSnapshot, WorkspaceScope } from "@chariot/types";
import { findProjectByWorkspace, getKernelState } from "@chariot/kernel";
import { buildMockBoardSniff, buildMockProjectSniff } from "./mockSniff";

export type BoardHermitContext = {
  scope: BoardScope;
  sniff: SniffSnapshot;
};

export type WorkspaceHermitContext = {
  scope: WorkspaceScope;
  sniff: SniffSnapshot;
};

/** 外层：基于全部项目的全局上下文。 */
export function buildBoardHermitContext(): BoardHermitContext {
  const { projects, activeProjectId } = getKernelState();
  return {
    scope: {
      kind: "board",
      projectIds: projects.map((p) => p.id),
      activeProjectId,
    },
    sniff: buildMockBoardSniff(),
  };
}

/** 内层：基于当前 workspace 的项目上下文。 */
export function buildWorkspaceHermitContext(
  workspaceId: string,
): WorkspaceHermitContext {
  const project = findProjectByWorkspace(workspaceId);
  return {
    scope: {
      kind: "project",
      projectId: project?.id ?? "unknown",
      workspaceId,
    },
    sniff: buildMockProjectSniff(workspaceId),
  };
}
