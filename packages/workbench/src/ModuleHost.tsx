/**
 * @chariot/workbench — ModuleHost
 * 根据 activeWorkbenchModule 渲染对应模块内容
 */
import { useKernelStore } from "@chariot/kernel";
import { HermitPanel } from "./HermitPanel";
import { PlannerPanel } from "./PlannerPanel";
import { Placeholder } from "@chariot/ui";

export function ModuleHost() {
  const activeModule = useKernelStore((s) => s.activeWorkbenchModule);

  switch (activeModule) {
    case "hermit":
      return <HermitPanel />;
    case "planner":
      return <PlannerPanel />;
    case "userkiller":
      return (
        <Placeholder label="Userkiller (adapter interface only, mock)" />
      );
    default:
      return <Placeholder label={`Unknown module: ${activeModule}`} />;
  }
}
