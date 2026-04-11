import type { ChariotProjectCard } from "@chariot/types";
import { openProject, useKernelStore } from "@chariot/kernel";
import { MapNode } from "@chariot/ui";

type BoardProjectCardProps = {
  card: ChariotProjectCard;
};

export function BoardProjectCard({ card }: BoardProjectCardProps) {
  const activeProjectId = useKernelStore((state) => state.activeProjectId);
  const isActive = activeProjectId === card.id;

  return (
    <div
      style={{
        padding: isActive ? "2px" : "0",
        borderRadius: "18px",
        background: isActive
          ? "linear-gradient(135deg, rgba(215,164,89,0.45), rgba(126,194,138,0.2))"
          : "transparent",
        transition: "transform 180ms ease",
        transform: isActive ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <MapNode
        title={card.title}
        summary={card.summary}
        tags={card.tags}
        status={card.status}
        onClick={() => openProject(card.id)}
        hints={card.moduleHints?.map((hint) => `Module ${hint}`)}
      />
    </div>
  );
}
