import type { ChariotModuleManifest } from "@chariot/types";

export const hermitManifest: ChariotModuleManifest = {
  id: "hermit",
  name: "Hermit",
  kind: "insight",
  supports: ["board", "workbench"],
  description: "系统认知层：嗅探项目、构建上下文、回答关于项目的问题",
};
