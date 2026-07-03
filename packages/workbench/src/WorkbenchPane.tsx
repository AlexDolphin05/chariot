/**
 * WorkbenchPane — 内层工作区（Alex 负责的重点区域）。
 * 布局：WorkspaceHeader 顶部，ModuleHost + ProjectMapPanel 主体，PlanetDock 右侧。
 */
import { useActiveWorkspace } from "@chariot/kernel";
import { ModuleHost } from "./ModuleHost";
import { PlanetDock } from "./PlanetDock";
import { ProjectMapPanel } from "./ProjectMapPanel";
import { WorkspaceHeader } from "./WorkspaceHeader";

export function WorkbenchPane() {
  const workspace = useActiveWorkspace();

  if (!workspace) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        从左侧 Board 打开一个项目，进入它的工作区
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0">
      <div className="flex min-h-0 flex-1 flex-col">
        <WorkspaceHeader />
        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,3fr)_minmax(0,2fr)] gap-3 p-3">
          <ModuleHost />
          <ProjectMapPanel />
        </div>
      </div>
      <PlanetDock />
    </div>
  );
}
