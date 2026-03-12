/**
 * @chariot/workbench — PlanetDock
 * 模块轨道切换器：Hermit 为核心，Planner/Userkiller 为围绕的模块入口
 * dock/chip 风格，非 tab bar
 */
import { useKernelStore } from "@chariot/kernel";
import { switchWorkbenchModule } from "@chariot/kernel";

const MODULES = [
  { id: "planner", name: "Planner", isCore: false },
  { id: "hermit", name: "Hermit", isCore: true },
  { id: "userkiller", name: "Userkiller", isCore: false },
];

export function PlanetDock() {
  const activeModule = useKernelStore((s) => s.activeWorkbenchModule);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 16px",
        background: "rgba(0,0,0,0.5)",
        borderRadius: "24px",
        border: "1px solid rgba(128,128,128,0.2)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      {MODULES.map((m) => {
        const isActive = activeModule === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => switchWorkbenchModule(m.id)}
            style={{
              padding: m.isCore ? "10px 20px" : "6px 14px",
              borderRadius: "20px",
              border: isActive
                ? "1px solid rgba(100,150,255,0.6)"
                : "1px solid rgba(128,128,128,0.25)",
              background: isActive
                ? "rgba(100,150,255,0.2)"
                : "rgba(255,255,255,0.04)",
              cursor: "pointer",
              fontSize: m.isCore ? "14px" : "12px",
              fontWeight: m.isCore ? 600 : 400,
              color: "inherit",
            }}
          >
            {m.name}
          </button>
        );
      })}
    </div>
  );
}
