import { useChariotI18n, useKernelStore } from "@chariot/kernel";
import { BoardProjectCard } from "./BoardProjectCard";
import { GlobalPlannerOverlay } from "./GlobalPlannerOverlay";

export function BoardPane() {
  const { t } = useChariotI18n();
  const projects = useKernelStore((state) => state.projects);
  const activeProjectId = useKernelStore((state) => state.activeProjectId);
  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? null;

  return (
    <section className="chariot-board-shell">
      <div className="chariot-board-surface">
        <div className="chariot-board-overlay chariot-board-overlay-planner">
          <GlobalPlannerOverlay />
        </div>

        <div className="chariot-board-note-layer">
          {projects.map((card) => (
            <div
              key={card.id}
              className="chariot-board-note-anchor"
              style={{
                left: card.boardPosition.x,
                top: card.boardPosition.y,
              }}
            >
              <BoardProjectCard card={card} />
            </div>
          ))}
        </div>

        <div className="chariot-board-overlay chariot-board-overlay-caption">
          <div className="chariot-board-caption">
            <div className="chariot-microcopy">{t("board.activeTarget")}</div>
            <div className="chariot-board-caption-title">
              {activeProject?.title ?? t("board.selectProject")}
            </div>
            <div className="chariot-board-caption-copy">
              {activeProject?.summary ?? t("board.rightWorkbenchHint")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
