/**
 * @chariot/board — Global Planner Overlay
 * Board Mode 下作为 overlay / inspector，显示全局冲突与建议
 */
import { mockGlobalPlannerSnapshot } from "@chariot/module-planner";
import type { PlannerSnapshot } from "@chariot/types";

export function GlobalPlannerOverlay() {
  const snapshot: PlannerSnapshot = mockGlobalPlannerSnapshot;

  return (
    <div
      style={{
        padding: "12px",
        background: "rgba(0,0,0,0.5)",
        borderRadius: "8px",
        border: "1px solid rgba(128,128,128,0.2)",
        fontSize: "13px",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: "8px" }}>
        Global Planner
      </div>
      <div style={{ marginBottom: "6px", color: "rgba(255,200,100,0.9)" }}>
        {snapshot.conflicts.length} conflict(s)
      </div>
      {snapshot.conflicts.length > 0 && (
        <ul style={{ margin: "0 0 8px 0", paddingLeft: "18px" }}>
          {snapshot.conflicts.map((c) => (
            <li key={c.id} style={{ marginBottom: "4px" }}>
              {c.message}
            </li>
          ))}
        </ul>
      )}
      {snapshot.suggestions.length > 0 && (
        <div style={{ color: "rgba(128,128,128,0.9)" }}>
          {snapshot.suggestions.join("; ")}
        </div>
      )}
    </div>
  );
}
