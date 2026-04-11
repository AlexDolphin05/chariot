import { create } from "zustand";
import type {
  ChariotProjectCard,
  ChariotWorkbenchModuleId,
  ChariotWorkspace,
} from "@chariot/types";

export type KernelState = {
  projects: ChariotProjectCard[];
  workspaces: ChariotWorkspace[];
  activeProjectId: string | null;
  activeWorkspaceId: string | null;
  activeWorkbenchModule: ChariotWorkbenchModuleId;
  globalHermitInput: string;
};

export type KernelHydration = {
  projects: ChariotProjectCard[];
  workspaces: ChariotWorkspace[];
  activeProjectId?: string | null;
  activeWorkspaceId?: string | null;
  activeWorkbenchModule?: ChariotWorkbenchModuleId;
  globalHermitInput?: string;
};

export type KernelActions = {
  hydrate: (payload: KernelHydration) => void;
  setProjects: (projects: ChariotProjectCard[]) => void;
  setWorkspaces: (workspaces: ChariotWorkspace[]) => void;
  setActiveProjectId: (projectId: string | null) => void;
  setActiveWorkspaceId: (workspaceId: string | null) => void;
  setActiveWorkbenchModule: (moduleId: ChariotWorkbenchModuleId) => void;
  setGlobalHermitInput: (input: string) => void;
  updateWorkspace: (
    workspaceId: string,
    updater: (workspace: ChariotWorkspace) => ChariotWorkspace,
  ) => void;
};

export const useKernelStore = create<KernelState & KernelActions>((set) => ({
  projects: [],
  workspaces: [],
  activeProjectId: null,
  activeWorkspaceId: null,
  activeWorkbenchModule: "hermit",
  globalHermitInput: "",

  hydrate: ({
    projects,
    workspaces,
    activeProjectId = null,
    activeWorkspaceId = null,
    activeWorkbenchModule = "hermit",
    globalHermitInput = "",
  }) =>
    set({
      projects,
      workspaces,
      activeProjectId,
      activeWorkspaceId,
      activeWorkbenchModule,
      globalHermitInput,
    }),

  setProjects: (projects) => set({ projects }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveProjectId: (activeProjectId) => set({ activeProjectId }),
  setActiveWorkspaceId: (activeWorkspaceId) => set({ activeWorkspaceId }),
  setActiveWorkbenchModule: (activeWorkbenchModule) =>
    set({ activeWorkbenchModule }),
  setGlobalHermitInput: (globalHermitInput) => set({ globalHermitInput }),
  updateWorkspace: (workspaceId, updater) =>
    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === workspaceId ? updater(workspace) : workspace,
      ),
    })),
}));
