/**
 * MOCK SEED DATA — 第一阶段的假数据，用来打通壳层闭环。
 * 未来这些卡应来自真实项目扫描（HERMIT ingest）或用户手动创建。
 */
import type { ChariotProjectCard, ChariotWorkspace } from "@chariot/types";
import { getKernelState } from "./store";

export const seedProjects: ChariotProjectCard[] = [
  {
    id: "proj-hermit",
    title: "HERMIT",
    summary: "系统认知层：嗅探、上下文构建、项目解释",
    tags: ["cognition", "sniff", "context"],
    status: "active",
    priority: 1,
    workspaceId: "ws-hermit",
    boardPosition: { x: 80, y: 120 },
    moduleHints: ["hermit"],
  },
  {
    id: "proj-planner",
    title: "Emergency Planner",
    summary: "约束与排程层：planning window、冲突检测、scheduler",
    tags: ["schedule", "constraints", "conflicts"],
    status: "active",
    priority: 2,
    workspaceId: "ws-planner",
    boardPosition: { x: 320, y: 200 },
    moduleHints: ["planner"],
  },
  {
    id: "proj-userkiller",
    title: "Userkiller",
    summary: "自动化层：workflow session、artifact、模板复用",
    tags: ["automation", "workflow", "artifacts"],
    status: "blocked",
    priority: 3,
    workspaceId: "ws-userkiller",
    boardPosition: { x: 160, y: 340 },
    moduleHints: ["userkiller", "planner"],
  },
];

export const seedWorkspaces: ChariotWorkspace[] = [
  {
    id: "ws-hermit",
    projectId: "proj-hermit",
    name: "HERMIT 迁移工作区",
    metadata: { source: "~/Desktop/HERMIT", stack: "TS + Express + Drizzle" },
  },
  {
    id: "ws-planner",
    projectId: "proj-planner",
    name: "Planner 迁移工作区",
    metadata: {
      source: "~/Desktop/emergency-planner",
      stack: "TS + Express + Drizzle",
    },
  },
  {
    id: "ws-userkiller",
    projectId: "proj-userkiller",
    name: "Userkiller 桥接工作区",
    metadata: {
      source: "~/Desktop/userkiller",
      stack: "Python Flask + React (JS)",
    },
  },
];

/** 启动时灌入 mock 数据。apps/web 的 bootstrap 调用一次。 */
export function seedKernel(): void {
  const state = getKernelState();
  state.setProjects(seedProjects);
  state.setWorkspaces(seedWorkspaces);
}
