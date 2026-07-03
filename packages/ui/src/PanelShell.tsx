import type { ReactNode } from "react";

/** 通用面板外壳：标题 + 可选角标 + 内容。Workbench 各面板统一用它。 */
export function PanelShell(props: {
  title: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
        <h3 className="text-sm font-semibold text-slate-700">{props.title}</h3>
        {props.badge ? (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
            {props.badge}
          </span>
        ) : null}
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-3 text-sm text-slate-600">
        {props.children}
      </div>
    </section>
  );
}
