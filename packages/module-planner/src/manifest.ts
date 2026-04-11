import type { ChariotModuleManifest } from "@chariot/types";

export const plannerManifest: ChariotModuleManifest = {
  id: "planner",
  name: "Planner",
  kind: "planner",
  supports: ["board", "workbench"],
  description:
    "Planning windows, conflict snapshots, and schedule-semantics placeholders.",
};
