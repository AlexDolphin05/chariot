/**
 * @chariot/workbench — Workspace Hermit 面板
 * 基于当前 workspace / project map / sniff 的工作区 Hermit
 * 显示 context、suggestions、mock 回答区域
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
    <PanelShell title="Workspace Hermit">
      {sniff ? (
        <div style={{ fontSize: "13px" }}>
          <div style={{ fontWeight: 600, marginBottom: "6px" }}>Context</div>
          <div style={{ marginBottom: "12px", color: "rgba(128,128,128,0.95)" }}>
            {sniff.summary}
          </div>
          <div style={{ fontWeight: 600, marginBottom: "6px" }}>Suggestions</div>
          <div style={{ marginBottom: "12px", color: "rgba(128,128,128,0.9)" }}>
            {sniff.suggestions.join("; ")}
          </div>
          <div style={{ fontWeight: 600, marginBottom: "6px" }}>Mock Answer</div>
          <div
            style={{
              padding: "10px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: "6px",
              fontSize: "12px",
              color: "rgba(180,200,220,0.9)",
            }}
          >
            [MOCK] Based on project context, consider completing task-1 before
            task-2. Future: connect to HERMIT context builder.
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
