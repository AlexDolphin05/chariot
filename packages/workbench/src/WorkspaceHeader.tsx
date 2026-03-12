/**
 * @chariot/workbench — 工作区头部
 * 项目名 + Back to Board
 */
import { useKernelStore } from "@chariot/kernel";
import { backToBoard } from "@chariot/kernel";

export function WorkspaceHeader() {
  const activeWorkspaceId = useKernelStore((s) => s.activeWorkspaceId);
  const workspaces = useKernelStore((s) => s.workspaces);
  const activeProjectId = useKernelStore((s) => s.activeProjectId);

  const workspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const title = workspace?.name ?? activeProjectId ?? "No project selected";

  return (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid rgba(128,128,128,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      <span style={{ fontSize: "16px", fontWeight: 600 }}>{title}</span>
      <button
        type="button"
        onClick={backToBoard}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid rgba(128,128,128,0.4)",
          background: "rgba(255,255,255,0.05)",
          cursor: "pointer",
          fontSize: "13px",
          color: "inherit",
        }}
      >
        Back to Board
      </button>
    </div>
  );
}
