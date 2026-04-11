import { HermitPanel } from "./HermitPanel";
import { ModuleHost } from "./ModuleHost";
import { PlannerPanel } from "./PlannerPanel";
import { PlanetDock } from "./PlanetDock";
import { ProjectMapPanel } from "./ProjectMapPanel";
import { WorkspaceHeader } from "./WorkspaceHeader";

export function WorkbenchPane() {
  return (
    <section
      style={{
        height: "100%",
        display: "grid",
        gridTemplateRows: "auto minmax(0, 1fr)",
        gap: "16px",
      }}
    >
      <WorkspaceHeader />
      <div className="chariot-workbench-grid">
        <ProjectMapPanel />
        <aside className="chariot-workbench-rail">
          <HermitPanel />
          <PlannerPanel />
          <div style={{ display: "grid", gap: "12px", minHeight: 0 }}>
            <PlanetDock />
            <ModuleHost />
          </div>
        </aside>
      </div>
    </section>
  );
}
