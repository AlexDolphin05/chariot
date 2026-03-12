/**
 * @chariot/board — 底部 Global Hermit 输入框
 * 外层 Hermit 基于全部项目做全局嗅探
 */
import { useKernelStore } from "@chariot/kernel";
import { tokens } from "@chariot/ui";

export function GlobalHermitBar() {
  const input = useKernelStore((s) => s.globalHermitInput);
  const setInput = useKernelStore((s) => s.setGlobalHermitInput);

  return (
    <div
      style={{
        height: tokens.hermitBarHeight,
        borderTop: tokens.panelBorder,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "rgba(0,0,0,0.2)",
      }}
    >
      <span style={{ fontSize: "13px", color: "rgba(128,128,128,0.9)" }}>
        Global Hermit
      </span>
      <input
        type="text"
        placeholder="Ask about all projects..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          flex: 1,
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid rgba(128,128,128,0.3)",
          background: "rgba(255,255,255,0.05)",
          color: "inherit",
          fontSize: "14px",
        }}
      />
    </div>
  );
}
