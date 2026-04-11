import type { ChariotLocale } from "@chariot/types";

export function getLegacyBridgeNotes(locale: ChariotLocale): string[] {
  if (locale === "zh-CN") {
    return [
      "先把 session_manager.py 映射成轻量 SessionAdapter，再考虑 workflow 执行。",
      "把 workflow_engine.py 当作外部能力提供者，不要在 Chariot 里重写。",
      "让 template_manager.py 和 file_reader.py 通过 artifact/session contract 暴露。",
    ];
  }

  return [
    "Map session_manager.py into a thin SessionAdapter before touching workflow execution.",
    "Treat workflow_engine.py as an external capability provider, not a Chariot rewrite target.",
    "Expose template_manager.py and file_reader.py as artifact/session services behind contracts.",
  ];
}
