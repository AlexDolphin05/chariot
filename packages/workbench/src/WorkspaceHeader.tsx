import {
  getModuleLabel,
  useChariotI18n,
  useKernelStore,
} from "@chariot/kernel";

type WorkspaceHeaderProps = {
  onBackToCurtain?: () => void;
};

export function WorkspaceHeader({ onBackToCurtain }: WorkspaceHeaderProps) {
  const { locale, t } = useChariotI18n();
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const activeProjectId = useKernelStore((state) => state.activeProjectId);
  const activeWorkbenchModule = useKernelStore(
    (state) => state.activeWorkbenchModule,
  );
  const projects = useKernelStore((state) => state.projects);
  const workspaces = useKernelStore((state) => state.workspaces);

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? null;
  const workspace =
    workspaces.find((candidate) => candidate.id === activeWorkspaceId) ?? null;
  const sourcePath =
    typeof workspace?.metadata.sourcePath === "string"
      ? workspace.metadata.sourcePath
      : null;
  const role =
    typeof workspace?.metadata.role === "string" ? workspace.metadata.role : null;

  return (
    <div className="chariot-workspace-card-header">
      <div className="chariot-workspace-heading">
        {onBackToCurtain ? (
          <button
            type="button"
            className="chariot-back-button"
            onClick={onBackToCurtain}
          >
            {t("workspace.back")}
          </button>
        ) : null}
        <div style={{ minWidth: 0 }}>
          <div className="chariot-microcopy">{t("workbench.microcopy")}</div>
          <div className="chariot-workspace-title">
            {activeProject?.title ?? t("workbench.selectProject")}
          </div>
          <div className="chariot-workspace-summary">
            {activeProject?.summary ?? t("workbench.description")}
          </div>
        </div>
      </div>

      <div className="chariot-workspace-meta">
        <span className="chariot-chip">
          {t("workbench.activeModule", {
            name: getModuleLabel(activeWorkbenchModule, locale),
          })}
        </span>
        {role ? <span className="chariot-chip">{role}</span> : null}
        {sourcePath ? (
          <span className="chariot-workspace-path">{sourcePath}</span>
        ) : null}
      </div>
    </div>
  );
}
