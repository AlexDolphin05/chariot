/**
 * @chariot/workbench — 工作区主面板
 */
import { WorkspaceHeader } from "./WorkspaceHeader";
import { ModuleHost } from "./ModuleHost";
import { PlanetDock } from "./PlanetDock";
import { ProjectMapPanel } from "./ProjectMapPanel";

export function WorkbenchPane() {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <WorkspaceHeader />
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          padding: "16px",
        }}
      >
        <div>
          <ModuleHost />
        </div>
        <div>
          <ProjectMapPanel />
        </div>
      </div>
      <PlanetDock />
    </div>
  );
}
