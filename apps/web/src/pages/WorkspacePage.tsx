import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { applySeedLocale } from "../bootstrap";
import {
  openProject,
  useChariotI18n,
  useKernelStore,
} from "@chariot/kernel";
import { WorkbenchPane } from "@chariot/workbench";

export function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { locale, t } = useChariotI18n();
  const projects = useKernelStore((state) => state.projects);

  const project = projectId
    ? projects.find((candidate) => candidate.id === projectId) ?? null
    : null;

  useEffect(() => {
    if (!projectId) {
      return;
    }

    openProject(projectId);
  }, [projectId]);

  if (!project) {
    return (
      <div className="chariot-workspace-shell">
        <header className="chariot-workspace-header">
          <button
            type="button"
            className="chariot-back-button"
            onClick={() => navigate("/")}
          >
            {t("workspace.back")}
          </button>
        </header>
        <main
          className="chariot-workspace-main"
          style={{
            display: "grid",
            placeItems: "center",
            color: "var(--text-muted)",
          }}
        >
          {t("workspace.notFound")}
        </main>
      </div>
    );
  }

  return (
    <div className="chariot-workspace-shell">
      <header className="chariot-workspace-header">
        <div className="chariot-status-row">
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

      <main className="chariot-workspace-main">
        <WorkbenchPane onBackToCurtain={() => navigate("/")} />
      </main>
    </div>
  );
}
