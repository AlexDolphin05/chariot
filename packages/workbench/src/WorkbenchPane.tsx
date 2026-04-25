import { useEffect, useState } from "react";
import { switchWorkbenchModule, useKernelStore } from "@chariot/kernel";
import { HermitPanel } from "./HermitPanel";
import { ModuleHost } from "./ModuleHost";
import { PlannerPanel } from "./PlannerPanel";
import { ProjectMapPanel } from "./ProjectMapPanel";
import {
  WorkbenchConstellation,
  type WorkbenchOrbitView,
} from "./WorkbenchConstellation";
import { WorkspaceHeader } from "./WorkspaceHeader";

type WorkbenchPaneProps = {
  onBackToCurtain?: () => void;
};

export function WorkbenchPane({ onBackToCurtain }: WorkbenchPaneProps) {
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
    ) : activeOrbit === "map" ? (
      <ProjectMapPanel />
    ) : (
      <HermitPanel />
    );

  return (
    <section
      style={{
        height: "100%",
        display: "grid",
        gridTemplateRows: "auto minmax(0, 1fr)",
        gap: "16px",
      }}
    >
      <WorkspaceHeader onBackToCurtain={onBackToCurtain} />
      <div className="chariot-constellation-layout">
        <WorkbenchConstellation
          activeOrbit={activeOrbit}
          onSelectOrbit={handleSelectOrbit}
        />
        <div className="chariot-detail-panel-shell">
          {focusPanel}
        </div>
      </div>
    </section>
  );
}
