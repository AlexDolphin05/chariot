/**
 * Project Map 面板 — 占位。
 * 未来接 HERMIT 的图结构能力（projectIntelligence/dependencyGraph 等），
 * 现在只把 sniff 快照里的 relations 列出来，证明数据链路是通的。
 */
import { useActiveWorkspace } from "@chariot/kernel";
import { PanelShell, Placeholder } from "@chariot/ui";

export function ProjectMapPanel() {
  const workspace = useActiveWorkspace();
  if (!workspace) return null;
  const relations = workspace.sniff?.relations ?? [];

  return (
    <PanelShell title="Project Map" badge="占位">
      {relations.length > 0 ? (
        <ul className="space-y-1 text-xs">
          {relations.map((r, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span className="rounded bg-slate-100 px-1.5 py-0.5">{r.from}</span>
              <span className="text-slate-300">—{r.type}→</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5">{r.to}</span>
            </li>
          ))}
        </ul>
      ) : (
        <Placeholder
          label="Project Map"
          note="未来接 HERMIT 的依赖图/实体图渲染，当前展示 sniff.relations。"
        />
      )}
    </PanelShell>
  );
}
