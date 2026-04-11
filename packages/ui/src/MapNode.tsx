import type { ReactNode } from "react";
import type { ChariotProjectStatus } from "@chariot/types";

export type MapNodeProps = {
  title: string;
  summary?: string;
  tags: string[];
  status: ChariotProjectStatus;
  statusLabel?: string;
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
  statusLabel,
  onClick,
  hints,
}: MapNodeProps) {
  const statusColors: Record<ChariotProjectStatus, string> = {
    idle: "var(--text-soft)",
    active: "var(--success)",
    blocked: "var(--danger)",
    done: "var(--accent-strong)",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "14px 16px",
        border: "1px solid var(--border-strong)",
        borderRadius: "16px",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        cursor: onClick ? "pointer" : "default",
        textAlign: "left",
        minWidth: "200px",
        boxShadow: "0 16px 30px rgba(0, 0, 0, 0.18)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "16px" }}>{title}</div>
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.06)",
            color: statusColors[status],
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {statusLabel ?? status}
        </span>
      </div>
      {summary && (
        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          {summary}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginTop: "10px",
        }}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: "4px 8px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.05)",
              color: "var(--text-soft)",
              fontSize: "11px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      {hints && hints.length > 0 && (
        <div
          style={{
            marginTop: "8px",
            fontSize: "11px",
            color: "var(--accent-strong)",
          }}
        >
          {hints.join("; ")}
        </div>
      )}
    </button>
  );
}
