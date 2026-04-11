import { BoardPane, GlobalHermitBar } from "@chariot/board";
import { getWorkbenchModules, useKernelStore } from "@chariot/kernel";
import { tokens } from "@chariot/ui";
import { WorkbenchPane } from "@chariot/workbench";

export function ShellLayout() {
  const projects = useKernelStore((state) => state.projects);
  const activeProjectId = useKernelStore((state) => state.activeProjectId);
  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? null;
  const workbenchModules = getWorkbenchModules();

  return (
    <div className="chariot-shell">
      <header
        style={{
          minHeight: tokens.headerHeight,
          border: tokens.panelBorder,
          borderRadius: tokens.shellRadius,
          background: tokens.panelBgElevated,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "16px 20px",
          boxShadow: "0 22px 50px rgba(0, 0, 0, 0.22)",
        }}
      >
        <div>
          <div className="chariot-microcopy">Chariot / Unified Shell</div>
          <div style={{ marginTop: "6px", fontSize: "28px", fontWeight: 700 }}>
            Board + Workbench
          </div>
        </div>
        <div className="chariot-status-row">
          <span className="chariot-chip">{projects.length} source projects</span>
          <span className="chariot-chip">{workbenchModules.length} registered modules</span>
          <span className="chariot-chip">
            Active: {activeProject?.title ?? "No active workspace"}
          </span>
        </div>
      </header>

      <div className="chariot-shell-grid">
        <div className="chariot-shell-panel">
          <BoardPane />
        </div>
        <div className="chariot-shell-panel">
          <WorkbenchPane />
        </div>
      </div>
      <GlobalHermitBar />
    </div>
  );
}
