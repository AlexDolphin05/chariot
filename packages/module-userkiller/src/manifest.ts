import type { ChariotModuleManifest } from "@chariot/types";

export const userkillerManifest: ChariotModuleManifest = {
  id: "userkiller",
  name: "Userkiller",
  kind: "automation",
  supports: ["workbench"],
  description: "自动化层：workflow session、执行状态、artifact 与模板",
};
