/**
 * @chariot/workbench — ModuleHost
 * 次级模块区：Planner / Userkiller 按 Planet Dock 切换
 * Hermit 已在主面板常驻，此处仅显示 Planner 或 Userkiller
 */
import { useKernelStore } from "@chariot/kernel";
import { PlannerPanel } from "./PlannerPanel";
import { Placeholder } from "@chariot/ui";

export function ModuleHost() {
  const activeModule = useKernelStore((s) => s.activeWorkbenchModule);

  switch (activeModule) {
    case "planner":
      return <PlannerPanel />;
    case "userkiller":
      return (
        <Placeholder label="Userkiller (adapter interface only, mock)" />
      );
    case "hermit":
    default:
      return (
        <div style={{ fontSize: "12px", color: "rgba(128,128,128,0.7)" }}>
          Hermit is the main panel above. Use Planet Dock to switch to Planner or
          Userkiller.
        </div>
      );
  }
}
