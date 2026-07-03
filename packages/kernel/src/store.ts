/**
 * Kernel store — Chariot 的唯一全局状态。
 * 只放跨模块共享的最小状态，模块内部状态各自管理。
 */
import { create } from "zustand";
import type {
  ChariotProjectCard,
  ChariotWorkspace,
  ChariotWorkbenchModuleId,
  PlannerSnapshot,
  SniffSnapshot,
} from "@chariot/types";

export type KernelState = {
  projects: ChariotProjectCard[];
  workspaces: ChariotWorkspace[];
  activeProjectId: string | null;
  activeWorkspaceId: string | null;
  activeWorkbenchModule: ChariotWorkbenchModuleId;
  /** 底部 Global Hermit 输入框内容（受控输入）。 */
  globalHermitInput: string;
  /** 全局（board scope）planner 快照，由 module-planner 写入。 */
  globalPlanner: PlannerSnapshot | null;

  setProjects: (projects: ChariotProjectCard[]) => void;
  setWorkspaces: (workspaces: ChariotWorkspace[]) => void;
  setActiveProject: (projectId: string | null) => void;
  setActiveWorkspace: (workspaceId: string | null) => void;
  setActiveWorkbenchModule: (moduleId: ChariotWorkbenchModuleId) => void;
  setGlobalHermitInput: (value: string) => void;
  setGlobalPlanner: (snapshot: PlannerSnapshot | null) => void;
  patchWorkspace: (
    workspaceId: string,
    patch: Partial<Pick<ChariotWorkspace, "sniff" | "planner" | "metadata">>,
  ) => void;
};

export const useKernelStore = create<KernelState>((set) => ({
  projects: [],
  workspaces: [],
  activeProjectId: null,
  activeWorkspaceId: null,
  activeWorkbenchModule: "hermit",
  globalHermitInput: "",
  globalPlanner: null,

  setProjects: (projects) => set({ projects }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveProject: (activeProjectId) => set({ activeProjectId }),
  setActiveWorkspace: (activeWorkspaceId) => set({ activeWorkspaceId }),
  setActiveWorkbenchModule: (activeWorkbenchModule) =>
    set({ activeWorkbenchModule }),
  setGlobalHermitInput: (globalHermitInput) => set({ globalHermitInput }),
  setGlobalPlanner: (globalPlanner) => set({ globalPlanner }),
  patchWorkspace: (workspaceId, patch) =>
    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === workspaceId ? { ...workspace, ...patch } : workspace,
      ),
    })),
}));

// --- 非 React 环境（模块、runtime）读取状态的便捷入口 ---

export function getKernelState(): KernelState {
  return useKernelStore.getState();
}

export function findWorkspace(workspaceId: string): ChariotWorkspace | null {
  return (
    getKernelState().workspaces.find((w) => w.id === workspaceId) ?? null
  );
}

export function findProject(projectId: string): ChariotProjectCard | null {
  return getKernelState().projects.find((p) => p.id === projectId) ?? null;
}

export function findProjectByWorkspace(
  workspaceId: string,
): ChariotProjectCard | null {
  return (
    getKernelState().projects.find((p) => p.workspaceId === workspaceId) ??
    null
  );
}

/** 便捷 hook：读取当前 sniff / planner 需要的 workspace。 */
export function useActiveWorkspace(): ChariotWorkspace | null {
  return useKernelStore(
    (state) =>
      state.workspaces.find((w) => w.id === state.activeWorkspaceId) ?? null,
  );
}

export function useActiveProject(): ChariotProjectCard | null {
  return useKernelStore(
    (state) =>
      state.projects.find((p) => p.id === state.activeProjectId) ?? null,
  );
}
