/**
 * @chariot/workbench — Planner 面板
 * 基于当前 workspace 的 project scope
 */
import { useKernelStore } from "@chariot/kernel";
import { PanelShell } from "@chariot/ui";
import { mockProjectPlannerSnapshot } from "@chariot/module-planner";

export function PlannerPanel() {
  const activeWorkspaceId = useKernelStore((s) => s.activeWorkspaceId);

  const snapshot = activeWorkspaceId
    ? mockProjectPlannerSnapshot(activeWorkspaceId)
    : null;

  return (
    <PanelShell title="Planner">
      {snapshot ? (
        <div style={{ fontSize: "13px" }}>
          {snapshot.conflicts.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
              {snapshot.conflicts.map((c) => (
                <li key={c.id} style={{ marginBottom: "4px" }}>
                  {c.message}
                </li>
              ))}
            </ul>
          ) : (
            <div>No conflicts</div>
          )}
          <div style={{ marginTop: "8px", fontSize: "11px", opacity: 0.7 }}>
            [MOCK] Future: connect to emergency-planner
          </div>
        </div>
      ) : (
        <div style={{ color: "rgba(128,128,128,0.8)" }}>
          Select a project to see Planner
        </div>
      )}
    </PanelShell>
  );
}
