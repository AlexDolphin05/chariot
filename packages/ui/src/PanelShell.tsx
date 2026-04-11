import type { ReactNode } from "react";
import { tokens } from "./tokens";

type PanelShellProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function PanelShell({ title, children, className = "" }: PanelShellProps) {
  return (
    <div
      className={className}
      style={{
        border: tokens.panelBorder,
        borderRadius: tokens.panelRadius,
        background: tokens.panelBg,
        overflow: "hidden",
        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.22)",
        backdropFilter: "blur(16px)",
      }}
    >
      {title && (
        <div
          style={{
            padding: "12px 16px",
            borderBottom: tokens.panelMutedBorder,
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "var(--text-muted)",
          }}
        >
          {title}
        </div>
      )}
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
}
