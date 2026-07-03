/**
 * Workspace Runtime — 打开项目 / 切换工作区 / 切换模块的唯一入口。
 * UI 层不要直接改 store 的 active 字段，统一调这里，保证事件正常广播。
 */
import type { ChariotWorkbenchModuleId } from "@chariot/types";
import { eventBus } from "./eventBus";
import { findProject, getKernelState } from "./store";

export function openProject(projectId: string): void {
  const project = findProject(projectId);
  if (!project) {
    console.warn(`[chariot/kernel] openProject: unknown project "${projectId}"`);
    return;
  }
  const state = getKernelState();
  state.setActiveProject(project.id);
  state.setActiveWorkspace(project.workspaceId);

  eventBus.publish({
    type: "board/project.open",
    payload: { projectId: project.id, workspaceId: project.workspaceId },
  });
  eventBus.publish({
    type: "workspace/active.changed",
    payload: { projectId: project.id, workspaceId: project.workspaceId },
  });
}

export function setActiveWorkspace(workspaceId: string | null): void {
  const state = getKernelState();
  const project = workspaceId
    ? state.projects.find((p) => p.workspaceId === workspaceId) ?? null
    : null;
  state.setActiveWorkspace(workspaceId);
  state.setActiveProject(project?.id ?? null);

  eventBus.publish({
    type: "workspace/active.changed",
    payload: { projectId: project?.id ?? null, workspaceId },
  });
}

export function switchWorkbenchModule(
  moduleId: ChariotWorkbenchModuleId,
): void {
  getKernelState().setActiveWorkbenchModule(moduleId);
  eventBus.publish({
    type: "workbench/module.switch",
    payload: { moduleId },
  });
}
