/**
 * @chariot/kernel — Zustand 全局状态
 * 管理 projects、workspaces、active 状态、globalHermitInput
 */
import { create } from "zustand";
import type {
  ChariotProjectCard,
  ChariotWorkspace,
} from "@chariot/types";

export type KernelState = {
  projects: ChariotProjectCard[];
  workspaces: ChariotWorkspace[];
  activeProjectId: string | null;
  activeWorkspaceId: string | null;
  activeWorkbenchModule: string;
  globalHermitInput: string;
};

export type KernelActions = {
  setProjects: (projects: ChariotProjectCard[]) => void;
  setWorkspaces: (workspaces: ChariotWorkspace[]) => void;
  setActiveProjectId: (id: string | null) => void;
  setActiveWorkspaceId: (id: string | null) => void;
  setActiveWorkbenchModule: (moduleId: string) => void;
  setGlobalHermitInput: (input: string) => void;
};

export const useKernelStore = create<KernelState & KernelActions>((set) => ({
  projects: [],
  workspaces: [],
  activeProjectId: null,
  activeWorkspaceId: null,
  activeWorkbenchModule: "hermit",
  globalHermitInput: "",

  setProjects: (projects) => set({ projects }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveProjectId: (activeProjectId) => set({ activeProjectId }),
  setActiveWorkspaceId: (activeWorkspaceId) => set({ activeWorkspaceId }),
  setActiveWorkbenchModule: (activeWorkbenchModule) => set({ activeWorkbenchModule }),
  setGlobalHermitInput: (globalHermitInput) => set({ globalHermitInput }),
}));
