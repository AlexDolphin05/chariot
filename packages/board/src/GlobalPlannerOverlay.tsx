import { useChariotI18n } from "@chariot/kernel";
import { detectGlobalConflicts } from "@chariot/module-planner";

export function GlobalPlannerOverlay() {
  const { locale, t } = useChariotI18n();
  const snapshot = detectGlobalConflicts(locale);
  const impactedProjectCount = new Set(
    snapshot.conflicts.flatMap((conflict) => conflict.relatedProjectIds),
  ).size;

  return (
    <div className="chariot-planner-whisper">
      <div className="chariot-microcopy">{t("planner.overlayTitle")}</div>
      <div
        style={{
          display: "grid",
          gap: "10px",
          fontSize: "13px",
          marginTop: "10px",
        }}
      >
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
    </div>
  );
}
