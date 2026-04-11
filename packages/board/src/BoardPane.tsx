import { useChariotI18n, useKernelStore } from "@chariot/kernel";
import { buildBoardSniffSnapshot } from "@chariot/module-hermit";
import { tokens } from "@chariot/ui";
import { BoardProjectCard } from "./BoardProjectCard";
import { GlobalPlannerOverlay } from "./GlobalPlannerOverlay";

export function BoardPane() {
  const { locale, t } = useChariotI18n();
  const projects = useKernelStore((state) => state.projects);
  const activeProjectId = useKernelStore((state) => state.activeProjectId);
  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? null;
  const boardSniff = buildBoardSniffSnapshot(locale);

  return (
    <section
      style={{
        height: "100%",
        display: "grid",
        gridTemplateRows: "auto minmax(0, 1fr)",
        gap: "16px",
      }}
      >
      <div style={{ display: "grid", gap: "10px" }}>
        <div className="chariot-microcopy">{t("board.microcopy")}</div>
        <div style={{ fontSize: "30px", fontWeight: 700 }}>
          {t("board.title")}
        </div>
        <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
          {boardSniff.summary}
        </div>
        <div className="chariot-status-row">
          {boardSniff.suggestions.slice(0, 2).map((suggestion) => (
            <span key={suggestion} className="chariot-chip">
              {suggestion}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          minHeight: 0,
          overflow: "hidden",
          border: tokens.panelBorder,
          borderRadius: tokens.shellRadius,
          background:
            "radial-gradient(circle at top left, rgba(215,164,89,0.16), transparent 32%), linear-gradient(180deg, rgba(25,35,31,0.96) 0%, rgba(12,17,15,0.98) 100%)",
          boxShadow: "0 28px 64px rgba(0, 0, 0, 0.24)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.55,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: "24px",
          }}
        >
          {projects.map((card) => (
            <div
              key={card.id}
              style={{
                position: "absolute",
                left: card.boardPosition.x,
                top: card.boardPosition.y,
              }}
            >
              <BoardProjectCard card={card} />
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            width: "min(320px, calc(100% - 36px))",
          }}
        >
          <GlobalPlannerOverlay />
        </div>

        <div
          style={{
            position: "absolute",
            left: "18px",
            right: "18px",
            bottom: "18px",
            padding: "14px 16px",
            border: tokens.panelBorder,
            borderRadius: tokens.panelRadius,
            background: "rgba(8, 12, 10, 0.8)",
            color: "var(--text-muted)",
            maxWidth: "420px",
          }}
        >
          <div className="chariot-microcopy">{t("board.activeTarget")}</div>
          <div style={{ marginTop: "6px", fontSize: "18px", color: "var(--text-strong)" }}>
            {activeProject?.title ?? t("board.selectProject")}
          </div>
          <div style={{ marginTop: "6px", lineHeight: 1.5 }}>
            {activeProject?.summary ?? t("board.rightWorkbenchHint")}
          </div>
        </div>
      </div>
    </section>
  );
}
