import { useChariotI18n, useKernelStore } from "@chariot/kernel";
import { HermitPanel } from "./HermitPanel";

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
  const { t } = useChariotI18n();
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const workspaces = useKernelStore((state) => state.workspaces);
  const workspace =
    workspaces.find((candidate) => candidate.id === activeWorkspaceId) ?? null;

  const plannerSummary = workspace?.planner?.suggestions[0] ?? t("planner.select");
  const plannerMetric = workspace?.planner
    ? `${workspace.planner.conflicts.length}`
    : "0";
  const mapSummary = workspace?.sniff?.suggestions[0] ?? t("workbench.mapFallback");
  const mapMetric = workspace?.sniff?.entities.length
    ? `${workspace.sniff.entities.length}`
    : "0";
  const userkillerSummary =
    t("moduleHost.userkillerFallback");
  const userkillerMetric = "1";

  const orbitNodes: OrbitNode[] = [
    {
      id: "map",
      title: t("workbench.mapOrbit"),
      summary: mapSummary,
      metric: mapMetric,
    },
    {
      id: "planner",
      title: t("workbench.plannerOrbit"),
      summary: plannerSummary,
      metric: plannerMetric,
    },
    {
      id: "userkiller",
      title: t("workbench.userkillerOrbit"),
      summary: userkillerSummary,
      metric: userkillerMetric,
    },
  ];

  const focusedLabel = {
    hermit: t("workbench.hermitCore"),
    map: t("workbench.mapOrbit"),
    planner: t("workbench.plannerOrbit"),
    userkiller: t("workbench.userkillerOrbit"),
  }[activeOrbit];

  return (
    <section className="chariot-constellation-shell">
      <div className="chariot-constellation-header">
        <div>
          <div className="chariot-microcopy">{t("workbench.constellationTitle")}</div>
          <div className="chariot-constellation-title">
            {t("workbench.hermitCore")}
          </div>
          <div className="chariot-constellation-subtitle">
            {t("workbench.constellationSubtitle")}
          </div>
        </div>
        <span className="chariot-chip">
          {t("workbench.focusedView", { name: focusedLabel })}
        </span>
      </div>

      <div className="chariot-constellation-stage">
        <div className="chariot-constellation-aura" />
        <div className="chariot-orbit-ring chariot-orbit-ring-one" />
        <div className="chariot-orbit-ring chariot-orbit-ring-two" />
        <div className="chariot-orbit-ring chariot-orbit-ring-three" />

        <div className="chariot-orbit-center">
          <HermitPanel />
        </div>

        {orbitNodes.map((orbit) => {
          const isActive = activeOrbit === orbit.id;

          return (
            <button
              key={orbit.id}
              type="button"
              className={`chariot-orbit-node${isActive ? " is-active" : ""}`}
              data-orbit={orbit.id}
              onClick={() => onSelectOrbit(orbit.id)}
            >
              <div className="chariot-orbit-metric">{orbit.metric}</div>
              <div className="chariot-orbit-title">{orbit.title}</div>
              <div className="chariot-orbit-summary">{orbit.summary}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
