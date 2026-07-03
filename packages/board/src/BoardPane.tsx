/**
 * BoardPane — 外层世界区（占位布局）。
 * 真实画布（自由摆放的 post-it、连线）由 Tia 实现；
 * 这里用简单网格渲染项目卡，先保证"点卡 → 打开 workspace"闭环。
 */
import { useKernelStore } from "@chariot/kernel";
import { BoardProjectCard } from "./BoardProjectCard";
import { GlobalPlannerOverlay } from "./GlobalPlannerOverlay";

export function BoardPane() {
  const projects = useKernelStore((s) => s.projects);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-bold text-slate-800">Board</h2>
        <span className="text-xs text-slate-400">
          全局视图 · {projects.length} 个项目
        </span>
      </div>
      <GlobalPlannerOverlay />
      <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-1 gap-3 overflow-auto xl:grid-cols-2">
        {projects.map((card) => (
          <BoardProjectCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
