import { getModuleLabel, useChariotI18n, useKernelStore } from "@chariot/kernel";

export type WorkbenchOrbitView = "hermit" | "planner" | "userkiller" | "map";

type WorkbenchConstellationProps = {
  activeOrbit: WorkbenchOrbitView;
  onSelectOrbit: (orbit: WorkbenchOrbitView) => void;
};

type OrbitNode = {
  id: WorkbenchOrbitView;
  title: string;
  summary: string;
  metric: string;
};

export function WorkbenchConstellation({
  activeOrbit,
  onSelectOrbit,
}: WorkbenchConstellationProps) {
  const { locale, t } = useChariotI18n();
  const activeProjectId = useKernelStore((state) => state.activeProjectId);
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const activeWorkbenchModule = useKernelStore(
    (state) => state.activeWorkbenchModule,
  );
  const workspaces = useKernelStore((state) => state.workspaces);
  const projects = useKernelStore((state) => state.projects);
  const plannerTasksByWorkspace = useKernelStore(
    (state) => state.plannerTasksByWorkspace,
  );
  const compiledPromptsByWorkspace = useKernelStore(
    (state) => state.compiledPromptsByWorkspace,
  );

  const activeProject =
    projects.find((candidate) => candidate.id === activeProjectId) ?? null;
  const workspace =
    workspaces.find((candidate) => candidate.id === activeWorkspaceId) ?? null;
  const plannerTasks = activeWorkspaceId
    ? plannerTasksByWorkspace[activeWorkspaceId] ?? []
    : [];
  const compiledPrompt = activeWorkspaceId
    ? compiledPromptsByWorkspace[activeWorkspaceId] ?? null
    : null;

  const orbitNodes: OrbitNode[] = [
    {
      id: "map",
      title: t("workbench.mapOrbit"),
      summary:
        workspace?.sniff?.summary ??
        (locale === "zh-CN"
          ? "承接项目结构与关系图。"
          : "Holds project structure and relation mapping."),
      metric: `${workspace?.sniff?.entities.length ?? 0}`,
    },
    {
      id: "planner",
      title: t("workbench.plannerOrbit"),
      summary:
        workspace?.planner?.suggestions[0] ??
        (locale === "zh-CN"
          ? "收敛时间块、冲突与优先级。"
          : "Converge time blocks, conflicts, and priorities."),
      metric: `${plannerTasks.length}`,
    },
    {
      id: "userkiller",
      title: t("workbench.userkillerOrbit"),
      summary:
        locale === "zh-CN"
          ? "自动办公台负责模板、草稿和执行产物。"
          : "The automation desk generates templates, drafts, and outputs.",
      metric: "3",
    },
  ];

  const focusLabel =
    activeOrbit === "map"
      ? t("workbench.mapOrbit")
      : activeOrbit === "planner"
        ? t("workbench.plannerOrbit")
        : activeOrbit === "userkiller"
          ? t("workbench.userkillerOrbit")
          : t("workbench.hermitCore");

  const hermitStatus = compiledPrompt
    ? locale === "zh-CN"
      ? "编译器已准备"
      : "Compiler ready"
    : locale === "zh-CN"
      ? "等待编译"
      : "Awaiting compile";

  return (
    <section className="chariot-constellation-shell">
      <div className="chariot-constellation-header">
        <div>
          <div className="chariot-microcopy">{t("workbench.constellationTitle")}</div>
          <div className="chariot-constellation-title">
            {activeProject?.title ?? t("workbench.selectProject")}
          </div>
          <div className="chariot-constellation-subtitle">
            {activeProject?.summary ?? t("workbench.description")}
          </div>
        </div>
        <div className="chariot-status-row">
          <span className="chariot-chip">
            {t("workbench.focusedView", { name: focusLabel })}
          </span>
          <span className="chariot-chip">
            {t("workbench.activeModule", {
              name: getModuleLabel(activeWorkbenchModule, locale),
            })}
          </span>
        </div>
      </div>

      <div className="chariot-constellation-stage">
        <div className="chariot-constellation-aura" />
        <div className="chariot-orbit-ring chariot-orbit-ring-one" />
        <div className="chariot-orbit-ring chariot-orbit-ring-two" />
        <div className="chariot-orbit-ring chariot-orbit-ring-three" />

        <button
          type="button"
          className={`chariot-core-star${activeOrbit === "hermit" ? " is-active" : ""}`}
          onClick={() => onSelectOrbit("hermit")}
        >
          <div className="chariot-microcopy">{t("workbench.hermitCore")}</div>
          <div className="chariot-core-title">Hermit</div>
          <div className="chariot-core-summary">
            {locale === "zh-CN"
              ? "提示词编译、项目解释与下一步判断都从这里发光。"
              : "Prompt compilation, project interpretation, and next-step reasoning radiate from here."}
          </div>
          <div className="chariot-status-row" style={{ justifyContent: "center" }}>
            <span className="chariot-chip">{hermitStatus}</span>
            <span className="chariot-chip">
              {locale === "zh-CN"
                ? `${workspace?.sniff?.entities.length ?? 0} 个实体`
                : `${workspace?.sniff?.entities.length ?? 0} entities`}
            </span>
            <span className="chariot-chip">
              {locale === "zh-CN"
                ? `${workspace?.planner?.conflicts.length ?? 0} 个冲突`
                : `${workspace?.planner?.conflicts.length ?? 0} conflicts`}
            </span>
          </div>
        </button>

        {orbitNodes.map((orbit) => (
          <button
            key={orbit.id}
            type="button"
            className={`chariot-orbit-node${activeOrbit === orbit.id ? " is-active" : ""}`}
            data-orbit={orbit.id}
            onClick={() => onSelectOrbit(orbit.id)}
          >
            <div className="chariot-orbit-metric">{orbit.metric}</div>
            <div className="chariot-orbit-title">{orbit.title}</div>
            <div className="chariot-orbit-summary">{orbit.summary}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
