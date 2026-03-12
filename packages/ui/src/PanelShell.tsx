/**
 * @chariot/ui — 面板壳组件
 */
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
      }}
    >
      {title && (
        <div
          style={{
            padding: "8px 12px",
            borderBottom: tokens.panelBorder,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ padding: "12px" }}>{children}</div>
    </div>
  );
}
