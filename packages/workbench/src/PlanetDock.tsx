import {
  getWorkbenchModules,
  switchWorkbenchModule,
  useKernelStore,
} from "@chariot/kernel";

const MODULE_ORDER = ["hermit", "planner", "userkiller"];

export function PlanetDock() {
  const activeModule = useKernelStore((state) => state.activeWorkbenchModule);
  const modules = getWorkbenchModules().sort(
    (left, right) =>
      MODULE_ORDER.indexOf(left.id) - MODULE_ORDER.indexOf(right.id),
  );

  return (
    <div
      style={{
        display: "grid",
        gap: "10px",
        padding: "14px 16px",
        borderRadius: "18px",
        border: "1px solid var(--border-strong)",
        background:
          "linear-gradient(180deg, rgba(28,39,35,0.92) 0%, rgba(13,18,16,0.96) 100%)",
      }}
    >
      <div className="chariot-microcopy">Planet Dock</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {modules.map((module) => {
          const isActive = activeModule === module.id;

        return (
          <button
            key={module.id}
            type="button"
            onClick={() => switchWorkbenchModule(module.id as "hermit" | "planner" | "userkiller")}
            style={{
              padding: module.id === "hermit" ? "10px 18px" : "8px 14px",
              borderRadius: "999px",
              border: isActive
                ? "1px solid rgba(215,164,89,0.4)"
                : "1px solid var(--border-strong)",
              background: isActive
                ? "rgba(215,164,89,0.16)"
                : "rgba(255,255,255,0.04)",
              cursor: "pointer",
              fontSize: module.id === "hermit" ? "14px" : "12px",
              fontWeight: module.id === "hermit" ? 600 : 500,
              color: "inherit",
            }}
          >
            {module.name}
          </button>
        );
        })}
      </div>
    </div>
  );
}
