import { useEffect, useState } from "react";
import { useChariotI18n, useKernelStore } from "@chariot/kernel";
import {
  getLegacyBridgeNotes,
  loadAutomationArtifacts,
  openUserkillerWorkspace,
  resumeAutomationSession,
  type AutomationArtifact,
  type ResumeAutomationResult,
  type UserkillerSession,
} from "@chariot/module-userkiller";
import { PanelShell } from "@chariot/ui";

export function ModuleHost() {
  const { locale, t } = useChariotI18n();
  const activeModule = useKernelStore((state) => state.activeWorkbenchModule);
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const [session, setSession] = useState<UserkillerSession | null>(null);
  const [resumeResult, setResumeResult] =
    useState<ResumeAutomationResult | null>(null);
  const [artifacts, setArtifacts] = useState<AutomationArtifact[]>([]);
  const [isLoadingBridge, setIsLoadingBridge] = useState(false);

  async function loadBridge(workspaceId: string): Promise<void> {
    setIsLoadingBridge(true);

    try {
      const nextSession = await openUserkillerWorkspace(workspaceId, locale);
      const [nextResumeResult, nextArtifacts] = await Promise.all([
        resumeAutomationSession(nextSession.id, locale),
        loadAutomationArtifacts(nextSession.id, locale),
      ]);

      setSession(nextSession);
      setResumeResult(nextResumeResult);
      setArtifacts(nextArtifacts);
    } finally {
      setIsLoadingBridge(false);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    if (activeModule !== "userkiller" || !activeWorkspaceId) {
      setSession(null);
      setResumeResult(null);
      setArtifacts([]);
      setIsLoadingBridge(false);
      return;
    }

    setIsLoadingBridge(true);

    void openUserkillerWorkspace(activeWorkspaceId, locale).then(
      async (nextSession) => {
        if (isCancelled) {
          return;
        }

        const [nextResumeResult, nextArtifacts] = await Promise.all([
          resumeAutomationSession(nextSession.id, locale),
          loadAutomationArtifacts(nextSession.id, locale),
        ]);

        if (isCancelled) {
          setIsLoadingBridge(false);
          return;
        }

        setSession(nextSession);
        setResumeResult(nextResumeResult);
        setArtifacts(nextArtifacts);
        setIsLoadingBridge(false);
      },
    );

    return () => {
      isCancelled = true;
    };
  }, [activeModule, activeWorkspaceId, locale]);

  const legacyBridgeNotes = getLegacyBridgeNotes(locale);

  switch (activeModule) {
    case "hermit":
      return (
        <PanelShell title={t("moduleHost.title")}>
          <div style={{ display: "grid", gap: "10px", fontSize: "13px" }}>
            <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
              {t("moduleHost.hermitFocus")}
            </div>
          </div>
        </PanelShell>
      );
    case "planner":
      return (
        <PanelShell title={t("moduleHost.title")}>
          <div style={{ display: "grid", gap: "10px", fontSize: "13px" }}>
            <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
              {t("moduleHost.plannerFocus")}
            </div>
          </div>
        </PanelShell>
      );
    case "userkiller":
      return (
        <PanelShell title={t("moduleHost.title")}>
          <div style={{ display: "grid", gap: "12px", fontSize: "13px" }}>
            <div className="chariot-microcopy">
              {t("moduleHost.userkillerTitle")}
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                disabled={!activeWorkspaceId || isLoadingBridge}
                onClick={() =>
                  activeWorkspaceId ? void loadBridge(activeWorkspaceId) : null
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "12px",
                  border: "1px solid rgba(215,164,89,0.35)",
                  background: "rgba(215,164,89,0.12)",
                  color: "var(--accent-strong)",
                  cursor:
                    !activeWorkspaceId || isLoadingBridge
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isLoadingBridge ? t("moduleHost.loading") : t("moduleHost.reload")}
              </button>
              {session ? (
                <span className="chariot-chip">
                  {t("moduleHost.templateCount", {
                    count: session.templateCount,
                  })}
                </span>
              ) : null}
            </div>
            <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
              {session?.summary ?? t("moduleHost.userkillerFallback")}
            </div>
            {resumeResult ? (
              <div style={{ display: "grid", gap: "6px" }}>
                <div className="chariot-microcopy">
                  {t("moduleHost.bridgeStatus")}
                </div>
                <div className="chariot-chip">{resumeResult.status}</div>
              </div>
            ) : null}
            {session ? (
              <div style={{ display: "grid", gap: "8px" }}>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-strong)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div className="chariot-microcopy">
                    {t("moduleHost.workspacePath")}
                  </div>
                  <div style={{ marginTop: "6px", color: "var(--text-muted)" }}>
                    {session.workspacePath}
                  </div>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-strong)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div className="chariot-microcopy">
                    {t("moduleHost.outputPath")}
                  </div>
                  <div style={{ marginTop: "6px", color: "var(--text-muted)" }}>
                    {session.outputPath}
                  </div>
                </div>
              </div>
            ) : null}
            <div style={{ display: "grid", gap: "8px" }}>
              <div className="chariot-microcopy">{t("moduleHost.artifacts")}</div>
              {artifacts.length > 0 ? (
                <div style={{ display: "grid", gap: "8px" }}>
                  {artifacts.map((artifact) => (
                    <div
                      key={artifact.id}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "12px",
                        border: "1px solid var(--border-strong)",
                        background: "rgba(255,255,255,0.03)",
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <strong style={{ color: "var(--text-strong)" }}>
                          {artifact.name}
                        </strong>
                        <span className="chariot-chip">{artifact.type}</span>
                      </div>
                      <div style={{ marginTop: "6px" }}>{artifact.summary}</div>
                      <div style={{ marginTop: "6px", fontSize: "12px" }}>
                        {artifact.path}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "var(--text-muted)" }}>
                  {t("moduleHost.noArtifacts")}
                </div>
              )}
            </div>
            <div style={{ display: "grid", gap: "6px" }}>
              <div className="chariot-microcopy">{t("moduleHost.bridgeNotes")}</div>
              {legacyBridgeNotes.map((note) => (
                <div
                  key={note}
                  style={{ color: "var(--accent-strong)", lineHeight: 1.5 }}
                >
                  {note}
                </div>
              ))}
            </div>
          </div>
        </PanelShell>
      );
    default:
      return null;
  }
}
