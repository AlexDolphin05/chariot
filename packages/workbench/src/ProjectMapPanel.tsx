/**
 * @chariot/workbench — Project Map 面板
 * 占位，未来展示项目地图/依赖图
 */
import { useKernelStore } from "@chariot/kernel";
import { PanelShell, Placeholder } from "@chariot/ui";

export function ProjectMapPanel() {
  const activeWorkspaceId = useKernelStore((s) => s.activeWorkspaceId);

  return (
    <PanelShell title="Project Map">
      {activeWorkspaceId ? (
        <Placeholder label={`Map for workspace ${activeWorkspaceId} (Tia)`} />
      ) : (
        <Placeholder label="Select a project to see map" />
      )}
    </PanelShell>
  );
}
