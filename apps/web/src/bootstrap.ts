import type {
  ChariotLocale,
  ChariotPlannerTask,
  ChariotProjectCard,
  ChariotWorkspace,
} from "@chariot/types";
import { registerModules, syncWorkspaceSnapshots, useKernelStore } from "@chariot/kernel";
import {
  buildWorkspaceSniffSnapshot,
  hermitManifest,
} from "@chariot/module-hermit";
import {
  buildLivePlanningSnapshot,
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

function createPlannerTasks(locale: ChariotLocale): Record<string, ChariotPlannerTask[]> {
  const baseDay = new Date("2026-04-12T00:00:00+10:00");

  function at(hours: number, minutes: number) {
    return new Date(baseDay.getTime() + (hours * 60 + minutes) * 60_000).getTime();
  }

  return {
    "workspace-hermit": [
      {
        id: "hermit-contract-pass",
        workspaceId: "workspace-hermit",
        title: locale === "zh-CN" ? "Hermit contract 抽取" : "Hermit contract pass",
        kind: "task",
        status: "active",
        startsAt: at(9, 0),
        endsAt: at(10, 30),
        lane: locale === "zh-CN" ? "深度工作" : "deep work",
      },
      {
        id: "hermit-compiler-shape",
        workspaceId: "workspace-hermit",
        title: locale === "zh-CN" ? "Prompt compiler 服务整理" : "Prompt compiler shaping",
        kind: "review",
        status: "planned",
        startsAt: at(11, 0),
        endsAt: at(12, 0),
        lane: locale === "zh-CN" ? "架构" : "architecture",
      },
    ],
    "workspace-planner": [
      {
        id: "planner-window-rules",
        workspaceId: "workspace-planner",
        title: locale === "zh-CN" ? "窗口规则复核" : "Window rules review",
        kind: "meeting",
        status: "planned",
        startsAt: at(9, 30),
        endsAt: at(10, 30),
        lane: locale === "zh-CN" ? "排程" : "planner",
      },
      {
        id: "planner-scheduler-extract",
        workspaceId: "workspace-planner",
        title: locale === "zh-CN" ? "Scheduler 能力抽取" : "Scheduler extraction",
        kind: "task",
        status: "active",
        startsAt: at(10, 0),
        endsAt: at(11, 30),
        lane: locale === "zh-CN" ? "深度工作" : "deep work",
      },
    ],
    "workspace-userkiller": [
      {
        id: "userkiller-template-audit",
        workspaceId: "workspace-userkiller",
        title: locale === "zh-CN" ? "模板盘点" : "Template audit",
        kind: "review",
        status: "planned",
        startsAt: at(13, 0),
        endsAt: at(14, 0),
        lane: locale === "zh-CN" ? "自动化" : "automation",
      },
      {
        id: "userkiller-output-bridge",
        workspaceId: "workspace-userkiller",
        title: locale === "zh-CN" ? "输出桥接验证" : "Output bridge validation",
        kind: "automation",
        status: "planned",
        startsAt: at(14, 30),
        endsAt: at(15, 30),
        lane: locale === "zh-CN" ? "桥接" : "bridge",
      },
    ],
  };
}

function syncLocalizedSnapshots(locale: ChariotLocale): void {
  const plannerTasks = createPlannerTasks(locale);

  createWorkspaces(locale).forEach((workspace) => {
    const tasks = plannerTasks[workspace.id] ?? [];

    syncWorkspaceSnapshots(workspace.id, {
      sniff: buildWorkspaceSniffSnapshot(workspace.id, locale),
      planner: buildLivePlanningSnapshot(tasks, locale),
    });
  });
}

export function applySeedLocale(locale: ChariotLocale): void {
  const store = useKernelStore.getState();
  store.setLocale(locale);
  store.setProjects(createProjects(locale));
  store.setWorkspaces(createWorkspaces(locale));
  Object.entries(createPlannerTasks(locale)).forEach(([workspaceId, tasks]) => {
    store.setPlannerTasks(workspaceId, tasks);
  });
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
  plannerTasksByWorkspace: createPlannerTasks("zh-CN"),
});

syncLocalizedSnapshots("zh-CN");
