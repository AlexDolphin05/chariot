/**
 * ModuleHost — 按 activeWorkbenchModule 渲染对应模块面板。
 * 新模块接入时在这里加一个分支（未来可改为 registry 驱动的动态渲染）。
 */
import { useKernelStore } from "@chariot/kernel";
import { HermitPanel } from "./HermitPanel";
import { PlannerPanel } from "./PlannerPanel";
import { UserkillerPanel } from "./UserkillerPanel";

export function ModuleHost() {
  const moduleId = useKernelStore((s) => s.activeWorkbenchModule);

  switch (moduleId) {
    case "hermit":
      return <HermitPanel />;
    case "planner":
      return <PlannerPanel />;
    case "userkiller":
      return <UserkillerPanel />;
  }
}
