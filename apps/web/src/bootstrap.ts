import type { ChariotLocale, ChariotProjectCard, ChariotWorkspace } from "@chariot/types";
import { registerModules, syncWorkspaceSnapshots, useKernelStore } from "@chariot/kernel";
import {
  buildWorkspaceSniffSnapshot,
  hermitManifest,
} from "@chariot/module-hermit";
import {
  buildProjectPlanningSnapshot,
  plannerManifest,
} from "@chariot/module-planner";
import { userkillerManifest } from "@chariot/module-userkiller";

function createProjects(locale: ChariotLocale): ChariotProjectCard[] {
  if (locale === "zh-CN") {
    return [
      {
        id: "project-hermit",
        title: "HERMIT",
        summary: "系统认知层，负责上下文构建、深度嗅探、项目解释和图结构推理。",
        tags: ["认知", "嗅探", "图谱"],
        status: "active",
        priority: 1,
        workspaceId: "workspace-hermit",
        boardPosition: { x: 28, y: 44 },
        moduleHints: ["hermit", "planner"],
      },
      {
        id: "project-planner",
        title: "Emergency Planner",
        summary: "约束与排程层，负责冲突、时间窗口、紧急度和 Planner 快照。",
        tags: ["排程", "约束", "时间"],
        status: "active",
        priority: 2,
        workspaceId: "workspace-planner",
        boardPosition: { x: 236, y: 192 },
        moduleHints: ["planner", "hermit"],
      },
      {
        id: "project-userkiller",
        title: "Userkiller",
        summary: "自动化工作流层，负责会话、产物、模板和遗留执行桥接。",
        tags: ["自动化", "产物", "桥接"],
        status: "idle",
        priority: 3,
        workspaceId: "workspace-userkiller",
        boardPosition: { x: 108, y: 344 },
        moduleHints: ["userkiller"],
      },
    ];
  }

  return [
    {
      id: "project-hermit",
      title: "HERMIT",
      summary:
        "System cognition layer for context building, deep sniffing, interpretation, and graph reasoning.",
      tags: ["cognition", "sniff", "graph"],
      status: "active",
      priority: 1,
      workspaceId: "workspace-hermit",
      boardPosition: { x: 28, y: 44 },
      moduleHints: ["hermit", "planner"],
    },
    {
      id: "project-planner",
      title: "Emergency Planner",
      summary:
        "Constraint and scheduling layer for conflicts, time windows, urgency, and planner snapshots.",
      tags: ["planner", "constraints", "schedule"],
      status: "active",
      priority: 2,
      workspaceId: "workspace-planner",
      boardPosition: { x: 236, y: 192 },
      moduleHints: ["planner", "hermit"],
    },
    {
      id: "project-userkiller",
      title: "Userkiller",
      summary:
        "Automation workflow layer for sessions, artifacts, templates, and legacy execution bridging.",
      tags: ["automation", "artifacts", "bridge"],
      status: "idle",
      priority: 3,
      workspaceId: "workspace-userkiller",
      boardPosition: { x: 108, y: 344 },
      moduleHints: ["userkiller"],
    },
  ];
}

function createWorkspaces(locale: ChariotLocale): ChariotWorkspace[] {
  if (locale === "zh-CN") {
    return [
      {
        id: "workspace-hermit",
        projectId: "project-hermit",
        name: "HERMIT 工作区",
        metadata: {
          sourcePath: "/Users/alexdolphin/Desktop/HERMIT",
          role: "系统认知层",
          stack: ["React", "TypeScript", "Vite", "SQLite"],
        },
      },
      {
        id: "workspace-planner",
        projectId: "project-planner",
        name: "Emergency Planner 工作区",
        metadata: {
          sourcePath: "/Users/alexdolphin/Desktop/emergency-planner",
          role: "约束与排程层",
          stack: ["React", "TypeScript", "Vite", "MySQL"],
        },
      },
      {
        id: "workspace-userkiller",
        projectId: "project-userkiller",
        name: "Userkiller 工作区",
        metadata: {
          sourcePath: "/Users/alexdolphin/Desktop/userkiller",
          role: "自动化桥接层",
          stack: ["Python", "Electron", "React", "Vite"],
        },
      },
    ];
  }

  return [
    {
      id: "workspace-hermit",
      projectId: "project-hermit",
      name: "HERMIT Workspace",
      metadata: {
        sourcePath: "/Users/alexdolphin/Desktop/HERMIT",
        role: "System cognition layer",
        stack: ["React", "TypeScript", "Vite", "SQLite"],
      },
    },
    {
      id: "workspace-planner",
      projectId: "project-planner",
      name: "Emergency Planner Workspace",
      metadata: {
        sourcePath: "/Users/alexdolphin/Desktop/emergency-planner",
        role: "Constraint and scheduling layer",
        stack: ["React", "TypeScript", "Vite", "MySQL"],
      },
    },
    {
      id: "workspace-userkiller",
      projectId: "project-userkiller",
      name: "Userkiller Workspace",
      metadata: {
        sourcePath: "/Users/alexdolphin/Desktop/userkiller",
        role: "Automation workflow bridge",
        stack: ["Python", "Electron", "React", "Vite"],
      },
    },
  ];
}

function syncLocalizedSnapshots(locale: ChariotLocale): void {
  createWorkspaces(locale).forEach((workspace) => {
    syncWorkspaceSnapshots(workspace.id, {
      sniff: buildWorkspaceSniffSnapshot(workspace.id, locale),
      planner: buildProjectPlanningSnapshot(workspace.id, locale),
    });
  });
}

export function applySeedLocale(locale: ChariotLocale): void {
  const store = useKernelStore.getState();
  store.setLocale(locale);
  store.setProjects(createProjects(locale));
  store.setWorkspaces(createWorkspaces(locale));
  syncLocalizedSnapshots(locale);
}

registerModules([hermitManifest, plannerManifest, userkillerManifest]);

useKernelStore.getState().hydrate({
  locale: "zh-CN",
  projects: createProjects("zh-CN"),
  workspaces: createWorkspaces("zh-CN"),
  activeProjectId: "project-hermit",
  activeWorkspaceId: "workspace-hermit",
  activeWorkbenchModule: "hermit",
  globalHermitInput: "",
});

syncLocalizedSnapshots("zh-CN");
