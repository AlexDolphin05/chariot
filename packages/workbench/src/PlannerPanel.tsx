import { startTransition, useMemo, useState } from "react";
import {
  syncWorkspacePlannerSnapshot,
  useChariotI18n,
  useKernelStore,
} from "@chariot/kernel";
import { detectProjectConflicts } from "@chariot/module-planner";
import { PanelShell } from "@chariot/ui";

export function PlannerPanel() {
  const { locale, t } = useChariotI18n();
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const workspaces = useKernelStore((state) => state.workspaces);
  const workspace =
    workspaces.find((candidate) => candidate.id === activeWorkspaceId) ?? null;
  const snapshot = workspace?.planner;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const conflictTypeLabels = useMemo(
    () =>
      locale === "zh-CN"
        ? {
            dependency: "依赖",
            priority: "优先级",
            resource: "资源",
            "time-overlap": "时间重叠",
          }
        : {
            dependency: "dependency",
            priority: "priority",
            resource: "resource",
            "time-overlap": "time overlap",
          },
    [locale],
  );

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }),
    [locale],
  );

  async function refreshSnapshot() {
    if (!activeWorkspaceId) {
      return;
    }

    setIsRefreshing(true);
    const nextSnapshot = await Promise.resolve(
      detectProjectConflicts(activeWorkspaceId, locale),
    );

    startTransition(() => {
      syncWorkspacePlannerSnapshot(activeWorkspaceId, nextSnapshot);
    });

    setIsRefreshing(false);
  }

  return (
    <PanelShell title={t("planner.panelTitle")}>
      {snapshot ? (
        <div style={{ display: "grid", gap: "12px", fontSize: "13px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div className="chariot-status-row">
              <span className="chariot-chip">
                {t("planner.scope", { scope: snapshot.scope })}
              </span>
              <span className="chariot-chip">
                {t("planner.activeConflicts", {
                  count: snapshot.conflicts.length,
                })}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void refreshSnapshot()}
              disabled={isRefreshing}
              style={{
                padding: "8px 12px",
                borderRadius: "12px",
                border: "1px solid rgba(215,164,89,0.35)",
                background: "rgba(215,164,89,0.12)",
                color: "var(--accent-strong)",
                cursor: isRefreshing ? "wait" : "pointer",
              }}
            >
              {isRefreshing ? t("planner.refreshing") : t("planner.refresh")}
            </button>
          </div>
          <div style={{ color: "var(--text-muted)" }}>
            {t("planner.updatedAt", {
              value: formatter.format(snapshot.updatedAt),
            })}
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
                  <div style={{ color: "var(--text-strong)", fontWeight: 600 }}>
                    {t("planner.conflictType", {
                      value: conflictTypeLabels[conflict.type],
                    })}
                  </div>
                  <div style={{ marginTop: "6px" }}>{conflict.message}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)" }}>
              {t("planner.noConflicts")}
            </div>
          )}
          <div>
            <div className="chariot-microcopy">{t("planner.suggestions")}</div>
            <div
              style={{
                marginTop: "6px",
                color: "var(--accent-strong)",
                lineHeight: 1.5,
              }}
            >
              {snapshot.suggestions[0]}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ color: "var(--text-muted)" }}>{t("planner.select")}</div>
      )}
    </PanelShell>
  );
}
