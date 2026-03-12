/**
 * @chariot/ui — MapNode 基础组件
 * Board 与 ProjectMap 共享：Node/Card、Position、Status、Tags、Hints
 */
import type { ReactNode } from "react";

export type MapNodeProps = {
  title: string;
  summary?: string;
  tags: string[];
  status: "idle" | "active" | "blocked" | "done";
  position?: { x: number; y: number };
  onClick?: () => void;
  hints?: string[];
  children?: ReactNode;
};

export function MapNode({
  title,
  summary,
  tags,
  status,
  onClick,
  hints,
}: MapNodeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "12px 16px",
        border: "1px solid rgba(128,128,128,0.3)",
        borderRadius: "8px",
        background: "rgba(255,255,255,0.03)",
        cursor: onClick ? "pointer" : "default",
        textAlign: "left",
        minWidth: "180px",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: "4px" }}>{title}</div>
      {summary && (
        <div style={{ fontSize: "12px", color: "rgba(128,128,128,0.9)" }}>
          {summary}
        </div>
      )}
      <div style={{ fontSize: "11px", marginTop: "6px", color: "rgba(128,128,128,0.7)" }}>
        {status} · {tags.join(", ")}
      </div>
      {hints && hints.length > 0 && (
        <div
          style={{
            marginTop: "8px",
            fontSize: "11px",
            color: "rgba(255,200,100,0.8)",
          }}
        >
          {hints.join("; ")}
        </div>
      )}
    </button>
  );
}
