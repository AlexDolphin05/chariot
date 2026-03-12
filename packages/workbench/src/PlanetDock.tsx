/**
 * @chariot/workbench — PlanetDock
 * 展示 Hermit / Planner / Userkiller 模块入口
 */
import { useKernelStore } from "@chariot/kernel";
import { switchWorkbenchModule } from "@chariot/kernel";
import { getAllModules } from "@chariot/kernel";

export function PlanetDock() {
  const activeModule = useKernelStore((s) => s.activeWorkbenchModule);
  const modules = getAllModules();

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "8px",
        borderTop: "1px solid rgba(128,128,128,0.2)",
      }}
    >
      {modules
        .filter((m) => m.supports.includes("workbench"))
        .map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => switchWorkbenchModule(m.id)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border:
                activeModule === m.id
                  ? "1px solid rgba(100,150,255,0.6)"
                  : "1px solid rgba(128,128,128,0.3)",
              background:
                activeModule === m.id
                  ? "rgba(100,150,255,0.15)"
                  : "rgba(255,255,255,0.03)",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            {m.name}
          </button>
        ))}
    </div>
  );
}
