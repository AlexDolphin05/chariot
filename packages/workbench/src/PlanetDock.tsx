/**
 * PlanetDock — Workbench 模块切换坞（占位视觉）。
 * 从 module registry 读取支持 workbench 的模块，点击切换 ModuleHost 内容。
 */
import type { ChariotWorkbenchModuleId } from "@chariot/types";
import {
  listWorkbenchModules,
  switchWorkbenchModule,
  useKernelStore,
} from "@chariot/kernel";

export function PlanetDock() {
  const activeModule = useKernelStore((s) => s.activeWorkbenchModule);
  const modules = listWorkbenchModules();

  return (
    <nav className="flex flex-col items-center gap-2 border-l border-slate-200 bg-slate-50 px-2 py-4">
      {modules.map((m) => (
        <button
          key={m.id}
          type="button"
          title={m.description}
          onClick={() =>
            switchWorkbenchModule(m.id as ChariotWorkbenchModuleId)
          }
          className={`flex h-12 w-12 flex-col items-center justify-center rounded-full border text-[10px] font-medium transition ${
            activeModule === m.id
              ? "border-amber-400 bg-amber-100 text-amber-800"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
          }`}
        >
          {m.name}
        </button>
      ))}
    </nav>
  );
}
