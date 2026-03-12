/**
 * @chariot/kernel — Workspace 运行时
 * openProject, setActiveWorkspace, switchWorkbenchModule
 */
import { useKernelStore } from "./store";
import { publish } from "./eventBus";

export function openProject(projectId: string): void {
  const { setActiveProjectId, setActiveWorkspaceId, workspaces } =
    useKernelStore.getState();
  setActiveProjectId(projectId);
  const ws = workspaces.find((w) => w.projectId === projectId);
  setActiveWorkspaceId(ws?.id ?? null);
  publish({ type: "board/project.open", payload: { projectId } });
  publish({
    type: "workspace/active.changed",
    payload: { workspaceId: ws?.id ?? null },
  });
}

export function setActiveWorkspace(workspaceId: string | null): void {
  useKernelStore.getState().setActiveWorkspaceId(workspaceId);
  publish({ type: "workspace/active.changed", payload: { workspaceId } });
}

export function switchWorkbenchModule(moduleId: string): void {
  useKernelStore.getState().setActiveWorkbenchModule(moduleId);
  publish({ type: "workbench/module.switch", payload: { moduleId } });
}
