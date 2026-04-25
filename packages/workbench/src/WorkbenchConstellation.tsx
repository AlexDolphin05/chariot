import { useChariotI18n, useKernelStore } from "@chariot/kernel";

export type WorkbenchOrbitView = "hermit" | "planner" | "userkiller" | "map";

type WorkbenchConstellationProps = {
  activeOrbit: WorkbenchOrbitView;
  onSelectOrbit: (orbit: WorkbenchOrbitView) => void;
};

type OrbitNode = {
  id: WorkbenchOrbitView;
  title: string;
  signal: string;
};

export function WorkbenchConstellation({
  activeOrbit,
  onSelectOrbit,
}: WorkbenchConstellationProps) {
  const { locale, t } = useChariotI18n();
  const activeProjectId = useKernelStore((state) => state.activeProjectId);
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const workspaces = useKernelStore((state) => state.workspaces);
  const projects = useKernelStore((state) => state.projects);
  const compiledPromptsByWorkspace = useKernelStore(
    (state) => state.compiledPromptsByWorkspace,
  );

  const activeProject =
    projects.find((candidate) => candidate.id === activeProjectId) ?? null;
  const workspace =
    workspaces.find((candidate) => candidate.id === activeWorkspaceId) ?? null;
  const compiledPrompt = activeWorkspaceId
    ? compiledPromptsByWorkspace[activeWorkspaceId] ?? null
    : null;

  const orbitNodes: OrbitNode[] = [
    {
      id: "map",
      title: t("workbench.mapOrbit"),
      signal:
        locale === "zh-CN"
          ? "结构"
          : "Map",
    },
    {
      id: "planner",
      title: t("workbench.plannerOrbit"),
      signal:
        workspace?.planner?.conflicts.length
          ? locale === "zh-CN"
            ? "冲突"
            : "Conflict"
          : locale === "zh-CN"
            ? "排程"
            : "Plan",
    },
    {
      id: "userkiller",
      title: t("workbench.userkillerOrbit"),
      signal:
        locale === "zh-CN"
          ? "自动化"
          : "Automation",
    },
  ];

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
          aria-pressed={activeOrbit === "hermit"}
        >
          <div className="chariot-microcopy">{t("workbench.hermitCore")}</div>
          <div className="chariot-core-title">Hermit</div>
          <div className="chariot-core-summary">
            {locale === "zh-CN"
              ? "提示词编译、项目解释与下一步判断都从这里发光。"
              : "Prompt compilation, project interpretation, and next-step reasoning radiate from here."}
          </div>
          <div className="chariot-core-status">{hermitStatus}</div>
        </button>

        {orbitNodes.map((orbit) => (
          <button
            key={orbit.id}
            type="button"
            className={`chariot-orbit-node${activeOrbit === orbit.id ? " is-active" : ""}`}
            data-orbit={orbit.id}
            onClick={() => onSelectOrbit(orbit.id)}
            aria-pressed={activeOrbit === orbit.id}
          >
            <div className="chariot-orbit-signal">{orbit.signal}</div>
            <div className="chariot-orbit-title">{orbit.title}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
