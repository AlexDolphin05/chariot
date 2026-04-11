import { useEffect, useState } from "react";
import { switchWorkbenchModule, useKernelStore } from "@chariot/kernel";
import { ModuleHost } from "./ModuleHost";
import { PlannerPanel } from "./PlannerPanel";
import { PlanetDock } from "./PlanetDock";
import { ProjectMapPanel } from "./ProjectMapPanel";
import {
  WorkbenchConstellation,
  type WorkbenchOrbitView,
} from "./WorkbenchConstellation";
import { WorkspaceHeader } from "./WorkspaceHeader";

export function WorkbenchPane() {
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const activeWorkbenchModule = useKernelStore(
    (state) => state.activeWorkbenchModule,
  );
  const [activeOrbit, setActiveOrbit] = useState<WorkbenchOrbitView>("hermit");

  useEffect(() => {
    setActiveOrbit("hermit");
  }, [activeWorkspaceId]);

  useEffect(() => {
    if (activeWorkbenchModule === "planner" || activeWorkbenchModule === "userkiller") {
      setActiveOrbit(activeWorkbenchModule);
      return;
    }

    if (activeWorkbenchModule === "hermit" && activeOrbit !== "map") {
      setActiveOrbit("hermit");
    }
  }, [activeOrbit, activeWorkbenchModule]);

  function handleSelectOrbit(orbit: WorkbenchOrbitView) {
    setActiveOrbit(orbit);

    if (orbit === "planner" || orbit === "userkiller" || orbit === "hermit") {
      switchWorkbenchModule(orbit);
      return;
    }

    switchWorkbenchModule("hermit");
  }

  const focusPanel =
    activeOrbit === "planner" ? (
      <PlannerPanel />
    ) : activeOrbit === "userkiller" ? (
      <ModuleHost />
    ) : (
      <ProjectMapPanel />
    );

  const supportPanels =
    activeOrbit === "planner"
      ? [<ProjectMapPanel key="map" />, <ModuleHost key="module-host" />]
      : activeOrbit === "userkiller"
        ? [<ProjectMapPanel key="map" />, <PlannerPanel key="planner" />]
        : [<PlannerPanel key="planner" />, <ModuleHost key="module-host" />];

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
      <div className="chariot-constellation-layout">
        <WorkbenchConstellation
          activeOrbit={activeOrbit}
          onSelectOrbit={handleSelectOrbit}
        />
        <div className="chariot-constellation-detail-grid">
          <div className="chariot-constellation-focus-panel">{focusPanel}</div>
          <aside className="chariot-constellation-support-stack">
            <PlanetDock />
            {supportPanels}
          </aside>
        </div>
      </div>
    </section>
  );
}
