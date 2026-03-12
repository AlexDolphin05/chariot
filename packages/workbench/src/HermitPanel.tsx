/**
 * @chariot/workbench — Hermit 面板
 * 基于当前 workspace 上下文
 */
import { useKernelStore } from "@chariot/kernel";
import { PanelShell } from "@chariot/ui";
import { mockProjectSniff } from "@chariot/module-hermit";

export function HermitPanel() {
  const activeWorkspaceId = useKernelStore((s) => s.activeWorkspaceId);

  const sniff = activeWorkspaceId
    ? mockProjectSniff(activeWorkspaceId)
    : null;

  return (
    <PanelShell title="Hermit">
      {sniff ? (
        <div style={{ fontSize: "13px" }}>
          <div style={{ marginBottom: "8px" }}>{sniff.summary}</div>
          <div style={{ color: "rgba(128,128,128,0.9)" }}>
            Suggestions: {sniff.suggestions.join("; ")}
          </div>
          <div style={{ marginTop: "8px", fontSize: "11px", opacity: 0.7 }}>
            [MOCK] Future: connect to HERMIT context builder
          </div>
        </div>
      ) : (
        <div style={{ color: "rgba(128,128,128,0.8)" }}>
          Select a project to see Hermit context
        </div>
      )}
    </PanelShell>
  );
}
