import { useEffect, useState } from "react";
import { useKernelStore } from "@chariot/kernel";
import {
  legacyBridgeNotes,
  loadAutomationArtifacts,
  openUserkillerWorkspace,
  resumeAutomationSession,
  type AutomationArtifact,
  type ResumeAutomationResult,
  type UserkillerSession,
} from "@chariot/module-userkiller";
import { PanelShell } from "@chariot/ui";

export function ModuleHost() {
  const activeModule = useKernelStore((state) => state.activeWorkbenchModule);
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const [session, setSession] = useState<UserkillerSession | null>(null);
  const [resumeResult, setResumeResult] = useState<ResumeAutomationResult | null>(null);
  const [artifacts, setArtifacts] = useState<AutomationArtifact[]>([]);

  useEffect(() => {
    let isCancelled = false;

    if (activeModule !== "userkiller" || !activeWorkspaceId) {
      return;
    }

    void openUserkillerWorkspace(activeWorkspaceId).then(async (nextSession) => {
      if (isCancelled) {
        return;
      }

      setSession(nextSession);

      const [nextResumeResult, nextArtifacts] = await Promise.all([
        resumeAutomationSession(nextSession.id),
        loadAutomationArtifacts(nextSession.id),
      ]);

      if (isCancelled) {
        return;
      }

      setResumeResult(nextResumeResult);
      setArtifacts(nextArtifacts);
    });

    return () => {
      isCancelled = true;
    };
  }, [activeModule, activeWorkspaceId]);

  switch (activeModule) {
    case "hermit":
      return (
        <PanelShell title="Module Host">
          <div style={{ display: "grid", gap: "10px", fontSize: "13px" }}>
            <div className="chariot-microcopy">Hermit Focus</div>
            <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
              Keep board-scope and project-scope context builders independent. The
              main extraction targets remain `contextAssembler.ts`, `deepSniff.ts`,
              and `profileBuilder.ts`.
            </div>
          </div>
        </PanelShell>
      );
    case "planner":
      return (
        <PanelShell title="Module Host">
          <div style={{ display: "grid", gap: "10px", fontSize: "13px" }}>
            <div className="chariot-microcopy">Planner Focus</div>
            <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
              Pull pure scheduling semantics first: `planningWindow.ts`,
              `autoBlocks.ts`, and `scheduler.ts`. Keep UI and onboarding out of the
              first pass.
            </div>
          </div>
        </PanelShell>
      );
    case "userkiller":
      return (
        <PanelShell title="Module Host">
          <div style={{ display: "grid", gap: "12px", fontSize: "13px" }}>
            <div className="chariot-microcopy">Userkiller Bridge</div>
            <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
              {session?.summary ??
                "Adapter-only placeholder. Real workflow execution remains in the legacy Python stack."}
            </div>
            {resumeResult ? (
              <div className="chariot-chip">{resumeResult.status}</div>
            ) : null}
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
                  <strong style={{ color: "var(--text-strong)" }}>{artifact.name}</strong>
                  <div>{artifact.summary}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gap: "6px" }}>
              {legacyBridgeNotes.map((note) => (
                <div key={note} style={{ color: "var(--accent-strong)", lineHeight: 1.5 }}>
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
