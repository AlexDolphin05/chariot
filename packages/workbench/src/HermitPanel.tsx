import { startTransition, useEffect, useState } from "react";
import { useKernelStore } from "@chariot/kernel";
import { runHermitInProjectScope } from "@chariot/module-hermit";
import { PanelShell } from "@chariot/ui";

export function HermitPanel() {
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const workspaces = useKernelStore((state) => state.workspaces);
  const workspace =
    workspaces.find((candidate) => candidate.id === activeWorkspaceId) ?? null;
  const sniff = workspace?.sniff;
  const [answer, setAnswer] = useState(
    "Project-scope Hermit will summarize the active workspace here.",
  );

  useEffect(() => {
    let isCancelled = false;

    if (!activeWorkspaceId) {
      setAnswer("Select a board card to activate project-scope Hermit.");
      return;
    }

    void runHermitInProjectScope(
      activeWorkspaceId,
      "What capability should Alex extract first here?",
    ).then((nextAnswer) => {
      if (isCancelled) {
        return;
      }

      startTransition(() => {
        setAnswer(nextAnswer);
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [activeWorkspaceId]);

  return (
    <PanelShell title="Hermit Panel">
      {sniff ? (
        <div style={{ display: "grid", gap: "12px", fontSize: "13px" }}>
          <div>
            <div className="chariot-microcopy">Project Scope Context</div>
            <div
              style={{
                marginTop: "6px",
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}
            >
              {sniff.summary}
            </div>
          </div>

          <div>
            <div className="chariot-microcopy">Entities</div>
            <div className="chariot-status-row" style={{ marginTop: "8px" }}>
              {sniff.entities.slice(0, 4).map((entity) => (
                <span key={entity} className="chariot-chip">
                  {entity}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="chariot-microcopy">Risks</div>
            <div
              style={{
                marginTop: "6px",
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}
            >
              {sniff.risks[0] ?? "No project risk is registered yet."}
            </div>
          </div>

          <div>
            <div className="chariot-microcopy">Mock Runner Output</div>
            <div
              style={{
                marginTop: "6px",
                padding: "12px",
                borderRadius: "14px",
                border: "1px solid var(--border-strong)",
                background: "rgba(255,255,255,0.04)",
                lineHeight: 1.5,
                color: "var(--accent-strong)",
                whiteSpace: "pre-wrap",
              }}
            >
              {answer}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ color: "var(--text-muted)" }}>
          Select a project to see workspace Hermit context.
        </div>
      )}
    </PanelShell>
  );
}
