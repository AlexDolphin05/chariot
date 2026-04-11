import {
  getModuleLabel,
  useChariotI18n,
  useKernelStore,
} from "@chariot/kernel";

export function WorkspaceHeader() {
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
    <div
      style={{
        border: "1px solid var(--border-strong)",
        borderRadius: "18px",
        background:
          "linear-gradient(180deg, rgba(28,39,35,0.94) 0%, rgba(15,21,19,0.96) 100%)",
        padding: "16px 18px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div className="chariot-microcopy">{t("workbench.microcopy")}</div>
        <div style={{ marginTop: "6px", fontSize: "28px", fontWeight: 700 }}>
          {activeProject?.title ?? t("workbench.selectProject")}
        </div>
        <div
          style={{
            marginTop: "8px",
            color: "var(--text-muted)",
            lineHeight: 1.5,
            maxWidth: "720px",
          }}
        >
          {activeProject?.summary ?? t("workbench.description")}
        </div>
      </div>

      <div
        style={{
          minWidth: "220px",
          display: "grid",
          gap: "8px",
        }}
      >
        <span className="chariot-chip">
          {t("workbench.activeModule", {
            name: getModuleLabel(activeWorkbenchModule, locale),
          })}
        </span>
        {role ? <span className="chariot-chip">{role}</span> : null}
        {sourcePath ? <span className="chariot-chip">{sourcePath}</span> : null}
      </div>
    </div>
  );
}
