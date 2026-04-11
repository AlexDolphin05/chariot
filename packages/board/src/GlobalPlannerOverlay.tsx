import { useChariotI18n } from "@chariot/kernel";
import { detectGlobalConflicts } from "@chariot/module-planner";
import { PanelShell } from "@chariot/ui";

export function GlobalPlannerOverlay() {
  const { locale, t } = useChariotI18n();
  const snapshot = detectGlobalConflicts(locale);
  const impactedProjectCount = new Set(
    snapshot.conflicts.flatMap((conflict) => conflict.relatedProjectIds),
  ).size;

  return (
    <PanelShell title={t("planner.overlayTitle")}>
      <div style={{ display: "grid", gap: "10px", fontSize: "13px" }}>
        <div className="chariot-status-row">
          <span className="chariot-chip">
            {t("planner.conflicts", { count: snapshot.conflicts.length })}
          </span>
          <span className="chariot-chip">
            {t("planner.impactedProjects", { count: impactedProjectCount })}
          </span>
        </div>
        <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
          {snapshot.conflicts[0]?.message ?? t("planner.none")}
        </div>
        <div style={{ color: "var(--accent-strong)", lineHeight: 1.5 }}>
          {snapshot.suggestions[0]}
        </div>
      </div>
    </PanelShell>
  );
}
