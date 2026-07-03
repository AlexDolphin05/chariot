/**
 * Project Planner 面板 — project scope 的冲突与建议。
 * 数据来自 module-planner 的 mock snapshot builder。
 */
import { useActiveWorkspace } from "@chariot/kernel";
import { PanelShell, Placeholder } from "@chariot/ui";

export function PlannerPanel() {
  const workspace = useActiveWorkspace();
  if (!workspace) return null;
  const snapshot = workspace.planner;

  return (
    <PanelShell title="Planner" badge="project scope">
      {snapshot ? (
        <div className="space-y-2">
          {snapshot.conflicts.length > 0 ? (
            <ul className="space-y-1">
              {snapshot.conflicts.map((c) => (
                <li
                  key={c.id}
                  className="rounded-md bg-rose-50 px-2 py-1.5 text-xs text-rose-700"
                >
                  <span className="font-medium">[{c.type}]</span> {c.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-600">当前项目无冲突。</p>
          )}
          <ul className="space-y-0.5 text-xs text-slate-500">
            {snapshot.suggestions.map((s) => (
              <li key={s}>· {s}</li>
            ))}
          </ul>
        </div>
      ) : (
        <Placeholder
          label="Planner Snapshot"
          note="打开项目后由 module-planner 生成；未来接 emergency-planner 的 scheduler / autoBlocks。"
        />
      )}
    </PanelShell>
  );
}
