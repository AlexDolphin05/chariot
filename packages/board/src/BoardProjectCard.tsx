import type {
  ChariotProjectCard,
  ChariotWorkbenchModuleId,
} from "@chariot/types";
import {
  getModuleLabel,
  getStatusLabel,
  openProject,
  useChariotI18n,
  useKernelStore,
} from "@chariot/kernel";
import { MapNode } from "@chariot/ui";

type BoardProjectCardProps = {
  card: ChariotProjectCard;
};

export function BoardProjectCard({ card }: BoardProjectCardProps) {
  const { locale, t } = useChariotI18n();
  const activeProjectId = useKernelStore((state) => state.activeProjectId);
  const isActive = activeProjectId === card.id;

  const moduleHints = (card.moduleHints ?? []).filter(
    (hint): hint is ChariotWorkbenchModuleId =>
      hint === "hermit" || hint === "planner" || hint === "userkiller",
  );

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
        statusLabel={getStatusLabel(card.status, locale)}
        onClick={() => openProject(card.id)}
        hints={moduleHints.map((hint) =>
          t("common.module", { name: getModuleLabel(hint, locale) }),
        )}
      />
    </div>
  );
}
