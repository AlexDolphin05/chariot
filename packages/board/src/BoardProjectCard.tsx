import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import type { ChariotProjectCard } from "@chariot/types";
import { openProject, useChariotI18n, useKernelStore } from "@chariot/kernel";

type BoardProjectCardProps = {
  card: ChariotProjectCard;
};

export function BoardProjectCard({ card }: BoardProjectCardProps) {
  const navigate = useNavigate();
  const { locale, t } = useChariotI18n();
  const activeProjectId = useKernelStore((state) => state.activeProjectId);
  const isActive = activeProjectId === card.id;
  const tilt = getTiltFromId(card.id);
  const statusPalette = getNotePalette(card.status);

  function handleEnter() {
    openProject(card.id);
    navigate(`/workspace/${card.id}`);
  }

  return (
    <button
      type="button"
      className={`chariot-board-note${isActive ? " is-active" : ""}`}
      onClick={handleEnter}
      style={
        {
          "--note-tilt": `${tilt}deg`,
          "--note-bg": statusPalette.background,
          "--note-border": statusPalette.border,
          "--note-shadow": statusPalette.shadow,
          "--pin-color": statusPalette.pin,
        } as CSSProperties
      }
    >
      <span className="chariot-board-pin" aria-hidden="true" />
      <div className="chariot-board-note-title">{card.title}</div>
      <div className="chariot-board-note-summary">
        {card.summary ??
          (locale === "zh-CN"
            ? "点击进入项目恒星系。"
            : "Click to enter the project star system.")}
      </div>
      <div className="chariot-board-note-enter">{t("curtain.enterHint")}</div>
    </button>
  );
}

function getTiltFromId(id: string): number {
  let hash = 0;

  for (const character of id) {
    hash = (hash * 31 + character.charCodeAt(0)) % 997;
  }

  return ((hash % 7) - 3) * 0.9;
}

function getNotePalette(status: ChariotProjectCard["status"]) {
  switch (status) {
    case "active":
      return {
        background: "#f6df94",
        border: "rgba(148, 112, 44, 0.26)",
        shadow: "0 18px 28px rgba(167, 132, 74, 0.26)",
        pin: "#c67c52",
      };
    case "blocked":
      return {
        background: "#f4d4cf",
        border: "rgba(151, 102, 95, 0.22)",
        shadow: "0 18px 28px rgba(166, 117, 111, 0.22)",
        pin: "#b7605e",
      };
    case "done":
      return {
        background: "#dce8c8",
        border: "rgba(113, 134, 99, 0.22)",
        shadow: "0 18px 28px rgba(120, 149, 108, 0.2)",
        pin: "#7e9b66",
      };
    default:
      return {
        background: "#fff7e7",
        border: "rgba(142, 118, 86, 0.2)",
        shadow: "0 18px 28px rgba(166, 136, 96, 0.18)",
        pin: "#8f745d",
      };
  }
}
