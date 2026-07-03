/**
 * 全局 Planner 提示条 — 占位。
 * 展示 global scope 的冲突概览，完整视觉交给 Tia。
 */
import { useKernelStore } from "@chariot/kernel";

export function GlobalPlannerOverlay() {
  const snapshot = useKernelStore((s) => s.globalPlanner);
  if (!snapshot) return null;

  const count = snapshot.conflicts.length;
  return (
    <div
      className={`rounded-md px-3 py-2 text-xs ${
        count > 0
          ? "bg-rose-50 text-rose-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      <p className="font-medium">
        全局排程{count > 0 ? `：检测到 ${count} 个冲突` : "：无冲突"}
      </p>
      <ul className="mt-1 space-y-0.5">
        {snapshot.conflicts.map((c) => (
          <li key={c.id}>· {c.message}</li>
        ))}
      </ul>
    </div>
  );
}
