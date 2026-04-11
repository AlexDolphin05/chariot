import type {
  BoardScope,
  ChariotWorkbenchModuleId,
  WorkspaceScope,
} from "@chariot/types";
import { useKernelStore } from "./store";
import { publish } from "./eventBus";

export function openProject(projectId: string): void {
  const {
    projects,
    workspaces,
    setActiveProjectId,
    setActiveWorkspaceId,
    setActiveWorkbenchModule,
  } = useKernelStore.getState();

  const project =
    projects.find((candidate) => candidate.id === projectId) ?? null;
  const workspaceId =
    project?.workspaceId ??
    workspaces.find((workspace) => workspace.projectId === projectId)?.id ??
    null;

  setActiveProjectId(projectId);
  setActiveWorkspaceId(workspaceId);
  setActiveWorkbenchModule("hermit");

  publish({
    type: "board/project.open",
    payload: { projectId, workspaceId },
  });
  publish({
    type: "workspace/active.changed",
    payload: { projectId, workspaceId },
  });
}

export function setActiveWorkspace(workspaceId: string | null): void {
  const { workspaces, setActiveProjectId, setActiveWorkspaceId } =
    useKernelStore.getState();

  const workspace =
    workspaces.find((candidate) => candidate.id === workspaceId) ?? null;
  const projectId = workspace?.projectId ?? null;

  setActiveProjectId(projectId);
  setActiveWorkspaceId(workspaceId);

  publish({
    type: "workspace/active.changed",
    payload: { projectId, workspaceId },
  });
}

export function switchWorkbenchModule(
  moduleId: ChariotWorkbenchModuleId,
): void {
  useKernelStore.getState().setActiveWorkbenchModule(moduleId);
  publish({ type: "workbench/module.switch", payload: { moduleId } });
}

export function getBoardScope(): BoardScope {
  const { projects, workspaces, activeProjectId } = useKernelStore.getState();

  return {
    kind: "board",
    projectIds: projects.map((project) => project.id),
    workspaceIds: workspaces.map((workspace) => workspace.id),
    activeProjectId,
  };
}

export function getWorkspaceScope(): WorkspaceScope | null {
  const { activeProjectId, activeWorkspaceId } = useKernelStore.getState();

  if (!activeProjectId || !activeWorkspaceId) {
    return null;
  }

  return {
    kind: "project",
    projectId: activeProjectId,
    workspaceId: activeWorkspaceId,
  };
}
