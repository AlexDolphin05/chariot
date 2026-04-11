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
import type { ChariotProjectCard, ChariotWorkspace } from "@chariot/types";

const projects: ChariotProjectCard[] = [
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

const workspaces: ChariotWorkspace[] = [
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

registerModules([hermitManifest, plannerManifest, userkillerManifest]);

useKernelStore.getState().hydrate({
  projects,
  workspaces,
  activeProjectId: "project-hermit",
  activeWorkspaceId: "workspace-hermit",
  activeWorkbenchModule: "hermit",
  globalHermitInput:
    "What is the safest first extraction path across all three projects?",
});

workspaces.forEach((workspace) => {
  syncWorkspaceSnapshots(workspace.id, {
    sniff: buildWorkspaceSniffSnapshot(workspace.id),
    planner: buildProjectPlanningSnapshot(workspace.id),
  });
});
