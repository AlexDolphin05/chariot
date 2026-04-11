import { applySeedLocale } from "../bootstrap";
import { BoardPane, GlobalHermitBar } from "@chariot/board";
import {
  getWorkbenchModules,
  useChariotI18n,
  useKernelStore,
} from "@chariot/kernel";
import { tokens } from "@chariot/ui";
import { WorkbenchPane } from "@chariot/workbench";

export function ShellLayout() {
  const { locale, t } = useChariotI18n();
  const projects = useKernelStore((state) => state.projects);
  const activeProjectId = useKernelStore((state) => state.activeProjectId);
  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? null;
  const workbenchModules = getWorkbenchModules();

  return (
    <div className="chariot-shell">
      <header
        style={{
          minHeight: tokens.headerHeight,
          border: tokens.panelBorder,
          borderRadius: tokens.shellRadius,
          background: tokens.panelBgElevated,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "16px 20px",
          boxShadow: "0 22px 50px rgba(0, 0, 0, 0.22)",
        }}
      >
        <div>
          <div className="chariot-microcopy">{t("shell.microcopy")}</div>
          <div style={{ marginTop: "6px", fontSize: "28px", fontWeight: 700 }}>
            {t("shell.title")}
          </div>
        </div>
        <div className="chariot-status-row">
          <span className="chariot-chip">
            {t("shell.projects", { count: projects.length })}
          </span>
          <span className="chariot-chip">
            {t("shell.modules", { count: workbenchModules.length })}
          </span>
          <span className="chariot-chip">
            {t("shell.active", {
              name: activeProject?.title ?? t("shell.noActiveWorkspace"),
            })}
          </span>
          <span className="chariot-chip">{t("shell.language")}</span>
          <button
            type="button"
            onClick={() => applySeedLocale("zh-CN")}
            className="chariot-chip"
            style={{
              cursor: "pointer",
              color: locale === "zh-CN" ? "var(--text-strong)" : "var(--text-muted)",
              background: locale === "zh-CN" ? "rgba(215, 164, 89, 0.14)" : undefined,
            }}
          >
            {t("shell.zh")}
          </button>
          <button
            type="button"
            onClick={() => applySeedLocale("en")}
            className="chariot-chip"
            style={{
              cursor: "pointer",
              color: locale === "en" ? "var(--text-strong)" : "var(--text-muted)",
              background: locale === "en" ? "rgba(215, 164, 89, 0.14)" : undefined,
            }}
          >
            {t("shell.en")}
          </button>
        </div>
      </header>

      <div className="chariot-shell-grid">
        <div className="chariot-shell-panel">
          <BoardPane />
        </div>
        <div className="chariot-shell-panel">
          <WorkbenchPane />
        </div>
      </div>
      <GlobalHermitBar />
    </div>
  );
}
