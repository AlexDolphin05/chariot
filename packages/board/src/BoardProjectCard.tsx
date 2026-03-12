/**
 * @chariot/board — 项目卡片
 * 占位实现，完整视觉由 Tia 后续实现
 */
import type { ChariotProjectCard } from "@chariot/types";
import { openProject } from "@chariot/kernel";

type BoardProjectCardProps = {
  card: ChariotProjectCard;
};

export function BoardProjectCard({ card }: BoardProjectCardProps) {
  const handleClick = () => {
    // card.id = project id (one card per project on board)
    openProject(card.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        padding: "12px 16px",
        border: "1px solid rgba(128,128,128,0.3)",
        borderRadius: "8px",
        background: "rgba(255,255,255,0.03)",
        cursor: "pointer",
        textAlign: "left",
        minWidth: "200px",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: "4px" }}>{card.title}</div>
      {card.summary && (
        <div style={{ fontSize: "12px", color: "rgba(128,128,128,0.9)" }}>
          {card.summary}
        </div>
      )}
      <div style={{ fontSize: "11px", marginTop: "6px", color: "rgba(128,128,128,0.7)" }}>
        {card.status} · {card.tags.join(", ")}
      </div>
    </button>
  );
}
