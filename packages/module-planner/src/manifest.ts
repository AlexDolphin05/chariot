import type { ChariotModuleManifest } from "@chariot/types";

export const plannerManifest: ChariotModuleManifest = {
  id: "planner",
  name: "Planner",
  kind: "planner",
  supports: ["board", "workbench"],
  description: "约束与排程层：冲突检测、时间窗口、排程建议",
};
