import { useKernelStore } from "@chariot/kernel";
import { PanelShell } from "@chariot/ui";

export function PlannerPanel() {
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const workspaces = useKernelStore((state) => state.workspaces);
  const workspace =
    workspaces.find((candidate) => candidate.id === activeWorkspaceId) ?? null;
  const snapshot = workspace?.planner;

  return (
    <PanelShell title="Planner Panel">
      {snapshot ? (
        <div style={{ display: "grid", gap: "12px", fontSize: "13px" }}>
          <div className="chariot-status-row">
            <span className="chariot-chip">{snapshot.scope} scope</span>
            <span className="chariot-chip">
              {snapshot.conflicts.length} active conflicts
            </span>
          </div>
          {snapshot.conflicts.length > 0 ? (
            <div style={{ display: "grid", gap: "8px" }}>
              {snapshot.conflicts.map((conflict) => (
                <div
                  key={conflict.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-strong)",
                    background: "rgba(255,255,255,0.03)",
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {conflict.message}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)" }}>No conflicts right now.</div>
          )}
          <div>
            <div className="chariot-microcopy">Suggestions</div>
            <div style={{ marginTop: "6px", color: "var(--accent-strong)", lineHeight: 1.5 }}>
              {snapshot.suggestions[0]}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ color: "var(--text-muted)" }}>
          Select a project to see planner snapshot data.
        </div>
      )}
    </PanelShell>
  );
}
