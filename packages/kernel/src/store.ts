import { create } from "zustand";
import type {
  ChariotAutomationRun,
  ChariotHermitExchange,
  ChariotLocale,
  ChariotPlannerTask,
  ChariotProjectCard,
  ChariotWorkbenchModuleId,
  ChariotWorkspace,
  HermitPromptCompileResult,
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
  plannerTasksByWorkspace: Record<string, ChariotPlannerTask[]>;
  automationRunsByWorkspace: Record<string, ChariotAutomationRun[]>;
  compiledPromptsByWorkspace: Record<string, HermitPromptCompileResult>;
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
  plannerTasksByWorkspace?: Record<string, ChariotPlannerTask[]>;
  automationRunsByWorkspace?: Record<string, ChariotAutomationRun[]>;
  compiledPromptsByWorkspace?: Record<string, HermitPromptCompileResult>;
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
  setPlannerTasks: (
    workspaceId: string,
    tasks: ChariotPlannerTask[],
  ) => void;
  addPlannerTask: (task: ChariotPlannerTask) => void;
  updatePlannerTaskStatus: (
    workspaceId: string,
    taskId: string,
    status: ChariotPlannerTask["status"],
  ) => void;
  appendAutomationRun: (run: ChariotAutomationRun) => void;
  setCompiledPrompt: (
    workspaceId: string,
    result: HermitPromptCompileResult,
  ) => void;
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
  plannerTasksByWorkspace: {},
  automationRunsByWorkspace: {},
  compiledPromptsByWorkspace: {},

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
    plannerTasksByWorkspace = {},
    automationRunsByWorkspace = {},
    compiledPromptsByWorkspace = {},
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
      plannerTasksByWorkspace,
      automationRunsByWorkspace,
      compiledPromptsByWorkspace,
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
  setPlannerTasks: (workspaceId, tasks) =>
    set((state) => ({
      plannerTasksByWorkspace: {
        ...state.plannerTasksByWorkspace,
        [workspaceId]: tasks,
      },
    })),
  addPlannerTask: (task) =>
    set((state) => ({
      plannerTasksByWorkspace: {
        ...state.plannerTasksByWorkspace,
        [task.workspaceId]: [
          ...(state.plannerTasksByWorkspace[task.workspaceId] ?? []),
          task,
        ],
      },
    })),
  updatePlannerTaskStatus: (workspaceId, taskId, status) =>
    set((state) => ({
      plannerTasksByWorkspace: {
        ...state.plannerTasksByWorkspace,
        [workspaceId]: (state.plannerTasksByWorkspace[workspaceId] ?? []).map(
          (task) => (task.id === taskId ? { ...task, status } : task),
        ),
      },
    })),
  appendAutomationRun: (run) =>
    set((state) => ({
      automationRunsByWorkspace: {
        ...state.automationRunsByWorkspace,
        [run.workspaceId]: [
          run,
          ...(state.automationRunsByWorkspace[run.workspaceId] ?? []).slice(
            0,
            5,
          ),
        ],
      },
    })),
  setCompiledPrompt: (workspaceId, result) =>
    set((state) => ({
      compiledPromptsByWorkspace: {
        ...state.compiledPromptsByWorkspace,
        [workspaceId]: result,
      },
    })),
  updateWorkspace: (workspaceId, updater) =>
    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === workspaceId ? updater(workspace) : workspace,
      ),
    })),
}));
