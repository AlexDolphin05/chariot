/**
 * MOCK: Hermit 模块占位数据
 */
import type { SniffSnapshot } from "@chariot/types";

export const mockBoardSniff: SniffSnapshot = {
  scope: "board",
  summary: "3 projects on board. 2 active, 1 idle.",
  entities: ["project-a", "project-b", "project-c"],
  relations: [
    { from: "project-a", to: "project-b", type: "depends" },
    { from: "project-b", to: "project-c", type: "blocks" },
  ],
  risks: ["project-b may block project-c if delayed"],
  suggestions: ["Prioritize project-b", "Review project-c dependencies"],
  updatedAt: Date.now(),
};

export const mockProjectSniff = (workspaceId: string): SniffSnapshot => ({
  scope: "project",
  summary: `Workspace ${workspaceId} — 2 tasks, 1 blocked`,
  entities: [`ws:${workspaceId}`, "task-1", "task-2"],
  relations: [{ from: "task-1", to: "task-2", type: "blocks" }],
  risks: [],
  suggestions: ["Complete task-1 first"],
  updatedAt: Date.now(),
});
