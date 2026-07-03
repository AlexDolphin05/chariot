/**
 * AppShell — Chariot 主壳（规范第七节的最小可运行布局）：
 *   顶部 header / 左侧 Board / 右侧 Workbench / 底部 Global Hermit 输入条。
 */
import { BoardPane, GlobalHermitBar } from "@chariot/board";
import { WorkbenchPane } from "@chariot/workbench";

export function AppShell() {
  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
        <h1 className="text-sm font-bold tracking-wide text-slate-800">
          CHARIOT
        </h1>
        <span className="text-xs text-slate-400">
          统一前端壳 · Stage 1 骨架
        </span>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* 左：Board（外层世界区，完整画布视觉由 Tia 实现） */}
        <div className="w-[40%] min-w-[320px] border-r border-slate-200 bg-slate-50">
          <BoardPane />
        </div>
        {/* 右：Workbench（内层工作区，Alex 负责） */}
        <div className="min-w-0 flex-1 bg-white">
          <WorkbenchPane />
        </div>
      </div>

      {/* 底：Global Hermit（board scope） */}
      <GlobalHermitBar />
    </div>
  );
}
