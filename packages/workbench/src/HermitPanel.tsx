/**
 * Workspace Hermit 面板 — project scope。
 * 显示当前 workspace 的 mock sniff 快照，并提供项目范围提问入口。
 */
import { useState } from "react";
import { useActiveWorkspace } from "@chariot/kernel";
import { runHermitInProjectScope } from "@chariot/module-hermit";
import { PanelShell, Placeholder } from "@chariot/ui";

export function HermitPanel() {
  const workspace = useActiveWorkspace();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  if (!workspace) return null;
  const sniff = workspace.sniff;

  async function ask() {
    const q = question.trim();
    if (!q || !workspace) return;
    setAnswer(await runHermitInProjectScope(workspace.id, q));
    setQuestion("");
  }

  return (
    <PanelShell title="Hermit" badge="project scope">
      {sniff ? (
        <div className="space-y-2">
          <p>{sniff.summary}</p>
          <div className="flex flex-wrap gap-1">
            {sniff.entities.map((e) => (
              <span
                key={e}
                className="rounded bg-amber-50 px-1.5 py-0.5 text-xs text-amber-700"
              >
                {e}
              </span>
            ))}
          </div>
          {sniff.risks.length > 0 ? (
            <ul className="space-y-0.5 text-xs text-rose-600">
              {sniff.risks.map((r) => (
                <li key={r}>⚠ {r}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <Placeholder
          label="Sniff Snapshot"
          note="打开项目后由 module-hermit 生成 mock 快照；未来接 HERMIT deepSniff。"
        />
      )}

      <div className="mt-3 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void ask();
          }}
          placeholder="就当前项目提问……"
          className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-amber-400"
        />
        <button
          type="button"
          onClick={() => void ask()}
          className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-400"
        >
          提问
        </button>
      </div>
      {answer ? (
        <pre className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 p-2 font-sans text-xs leading-relaxed text-slate-600">
          {answer}
        </pre>
      ) : null}
    </PanelShell>
  );
}
