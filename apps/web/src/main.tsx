import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerModule } from "@chariot/kernel";
import { useKernelStore } from "@chariot/kernel";
import { hermitManifest } from "@chariot/module-hermit";
import { plannerManifest } from "@chariot/module-planner";
import { userkillerManifest } from "@chariot/module-userkiller";
import type { ChariotProjectCard, ChariotWorkspace } from "@chariot/types";
import App from "./App";
import "./index.css";

// Register built-in modules
registerModule(hermitManifest);
registerModule(plannerManifest);
registerModule(userkillerManifest);

// Seed mock projects and workspaces
const mockProjects: ChariotProjectCard[] = [
  {
    id: "project-a",
    title: "Project A",
    summary: "First mock project",
    tags: ["frontend", "react"],
    status: "active",
    priority: 1,
    workspaceId: "ws-a",
    boardPosition: { x: 120, y: 100 },
  },
  {
    id: "project-b",
    title: "Project B",
    summary: "Second mock project",
    tags: ["backend", "api"],
    status: "active",
    priority: 2,
    workspaceId: "ws-b",
    boardPosition: { x: 420, y: 140 },
  },
  {
    id: "project-c",
    title: "Project C",
    summary: "Third mock project",
    tags: ["automation"],
    status: "idle",
    priority: 3,
    workspaceId: "ws-c",
    boardPosition: { x: 280, y: 300 },
  },
];

const mockWorkspaces: ChariotWorkspace[] = [
  { id: "ws-a", projectId: "project-a", name: "Project A Workspace", metadata: {} },
  { id: "ws-b", projectId: "project-b", name: "Project B Workspace", metadata: {} },
  { id: "ws-c", projectId: "project-c", name: "Project C Workspace", metadata: {} },
];

useKernelStore.getState().setProjects(mockProjects);
useKernelStore.getState().setWorkspaces(mockWorkspaces);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
