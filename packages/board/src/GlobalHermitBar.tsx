/**
 * Global Hermit 输入条 — 常驻页面底部。
 * board scope：基于全部项目做"全局嗅探"式问答（当前为 mock runner）。
 */
import { useState } from "react";
import { eventBus, useKernelStore } from "@chariot/kernel";
import {
  buildBoardHermitContext,
  runHermitInBoardScope,
} from "@chariot/module-hermit";

export function GlobalHermitBar() {
  const input = useKernelStore((s) => s.globalHermitInput);
  const setInput = useKernelStore((s) => s.setGlobalHermitInput);
  const [answer, setAnswer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function ask() {
    const question = input.trim();
    if (!question || busy) return;

    eventBus.publish({
      type: "board/hermit.ask",
      payload: { question, scope: buildBoardHermitContext().scope },
    });

    setBusy(true);
    try {
      setAnswer(await runHermitInBoardScope(question));
      setInput("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-3">
      {answer ? (
        <div className="mb-2 flex items-start justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
          <pre className="whitespace-pre-wrap font-sans">{answer}</pre>
          <button
            type="button"
            className="shrink-0 text-slate-400 hover:text-slate-600"
            onClick={() => setAnswer(null)}
          >
            关闭
          </button>
        </div>
      ) : null}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void ask();
          }}
          placeholder="Global Hermit：基于所有项目提问……"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400"
        />
        <button
          type="button"
          onClick={() => void ask()}
          disabled={busy}
          className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {busy ? "思考中…" : "问 Hermit"}
        </button>
      </div>
    </div>
  );
}
