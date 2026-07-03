/**
 * Board 项目卡 — 占位视觉。
 * post-it 质感 / 拖拽 / 画布定位由 Tia 实现，这里只保证数据和点击行为正确。
 * card.boardPosition 已在数据层预留，当前网格布局刻意不用它。
 */
import type { ChariotProjectCard } from "@chariot/types";
import { openProject, useKernelStore } from "@chariot/kernel";
import { statusColor, statusLabel } from "@chariot/ui";

export function BoardProjectCard(props: { card: ChariotProjectCard }) {
  const { card } = props;
  const isActive = useKernelStore((s) => s.activeProjectId === card.id);

  return (
    <button
      type="button"
      onClick={() => openProject(card.id)}
      className={`w-full rounded-lg border p-3 text-left shadow-sm transition hover:shadow-md ${
        isActive
          ? "border-amber-400 bg-amber-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-slate-800">{card.title}</span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <span className={`h-2 w-2 rounded-full ${statusColor[card.status]}`} />
          {statusLabel[card.status]}
        </span>
      </div>
      {card.summary ? (
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {card.summary}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-1">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
