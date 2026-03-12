import type { ChariotModuleManifest } from "@chariot/types";

export const hermitManifest: ChariotModuleManifest = {
  id: "hermit",
  name: "Hermit",
  kind: "core",
  supports: ["board", "workbench"],
};
