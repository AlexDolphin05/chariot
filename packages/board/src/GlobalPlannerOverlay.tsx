import { detectGlobalConflicts } from "@chariot/module-planner";
import { PanelShell } from "@chariot/ui";

export function GlobalPlannerOverlay() {
  const snapshot = detectGlobalConflicts();
  const impactedProjectCount = new Set(
    snapshot.conflicts.flatMap((conflict) => conflict.relatedProjectIds),
  ).size;

  return (
    <PanelShell title="Global Planner Overlay">
      <div style={{ display: "grid", gap: "10px", fontSize: "13px" }}>
        <div className="chariot-status-row">
          <span className="chariot-chip">{snapshot.conflicts.length} conflicts</span>
          <span className="chariot-chip">{impactedProjectCount} impacted projects</span>
        </div>
        <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
          {snapshot.conflicts[0]?.message ?? "No cross-project conflicts detected."}
        </div>
        <div style={{ color: "var(--accent-strong)", lineHeight: 1.5 }}>
          {snapshot.suggestions[0]}
        </div>
      </div>
    </PanelShell>
  );
}
