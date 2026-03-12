/**
 * @chariot/workbench — 工作区头部
 */
import { useKernelStore } from "@chariot/kernel";

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
        fontSize: "16px",
        fontWeight: 600,
      }}
    >
      {title}
    </div>
  );
}
