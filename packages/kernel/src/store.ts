import { create } from "zustand";
import type {
  ChariotHermitExchange,
  ChariotLocale,
  ChariotProjectCard,
  ChariotWorkbenchModuleId,
  ChariotWorkspace,
} from "@chariot/types";

export type KernelState = {
  locale: ChariotLocale;
  projects: ChariotProjectCard[];
  workspaces: ChariotWorkspace[];
  activeProjectId: string | null;
  activeWorkspaceId: string | null;
  activeWorkbenchModule: ChariotWorkbenchModuleId;
  globalHermitInput: string;
  workspaceHermitInput: string;
  workspaceHermitHistory: Record<string, ChariotHermitExchange[]>;
};

export type KernelHydration = {
  locale?: ChariotLocale;
  projects: ChariotProjectCard[];
  workspaces: ChariotWorkspace[];
  activeProjectId?: string | null;
  activeWorkspaceId?: string | null;
  activeWorkbenchModule?: ChariotWorkbenchModuleId;
  globalHermitInput?: string;
  workspaceHermitInput?: string;
  workspaceHermitHistory?: Record<string, ChariotHermitExchange[]>;
};

export type KernelActions = {
  hydrate: (payload: KernelHydration) => void;
  setLocale: (locale: ChariotLocale) => void;
  setProjects: (projects: ChariotProjectCard[]) => void;
  setWorkspaces: (workspaces: ChariotWorkspace[]) => void;
  setActiveProjectId: (projectId: string | null) => void;
  setActiveWorkspaceId: (workspaceId: string | null) => void;
  setActiveWorkbenchModule: (moduleId: ChariotWorkbenchModuleId) => void;
  setGlobalHermitInput: (input: string) => void;
  setWorkspaceHermitInput: (input: string) => void;
  appendWorkspaceHermitExchange: (exchange: ChariotHermitExchange) => void;
  updateWorkspace: (
    workspaceId: string,
    updater: (workspace: ChariotWorkspace) => ChariotWorkspace,
  ) => void;
};

export const useKernelStore = create<KernelState & KernelActions>((set) => ({
  locale: "zh-CN",
  projects: [],
  workspaces: [],
  activeProjectId: null,
  activeWorkspaceId: null,
  activeWorkbenchModule: "hermit",
  globalHermitInput: "",
  workspaceHermitInput: "",
  workspaceHermitHistory: {},

  hydrate: ({
    locale = "zh-CN",
    projects,
    workspaces,
    activeProjectId = null,
    activeWorkspaceId = null,
    activeWorkbenchModule = "hermit",
    globalHermitInput = "",
    workspaceHermitInput = "",
    workspaceHermitHistory = {},
  }) =>
    set({
      locale,
      projects,
      workspaces,
      activeProjectId,
      activeWorkspaceId,
      activeWorkbenchModule,
      globalHermitInput,
      workspaceHermitInput,
      workspaceHermitHistory,
    }),

  setLocale: (locale) => set({ locale }),
  setProjects: (projects) => set({ projects }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveProjectId: (activeProjectId) => set({ activeProjectId }),
  setActiveWorkspaceId: (activeWorkspaceId) => set({ activeWorkspaceId }),
  setActiveWorkbenchModule: (activeWorkbenchModule) =>
    set({ activeWorkbenchModule }),
  setGlobalHermitInput: (globalHermitInput) => set({ globalHermitInput }),
  setWorkspaceHermitInput: (workspaceHermitInput) => set({ workspaceHermitInput }),
  appendWorkspaceHermitExchange: (exchange) =>
    set((state) => ({
      workspaceHermitHistory: {
        ...state.workspaceHermitHistory,
        [exchange.workspaceId]: [
          ...(state.workspaceHermitHistory[exchange.workspaceId] ?? []).slice(-5),
          exchange,
        ],
      },
    })),
  updateWorkspace: (workspaceId, updater) =>
    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === workspaceId ? updater(workspace) : workspace,
      ),
    })),
}));
