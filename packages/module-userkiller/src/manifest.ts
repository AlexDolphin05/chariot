import type { ChariotModuleManifest } from "@chariot/types";

export const userkillerManifest: ChariotModuleManifest = {
  id: "userkiller",
  name: "Userkiller",
  kind: "automation",
  supports: ["workbench"],
  description:
    "Workflow/session/artifact adapter layer for the legacy Python automation stack.",
};
