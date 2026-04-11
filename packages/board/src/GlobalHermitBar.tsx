import { startTransition, useState } from "react";
import { getBoardScope, publish, useKernelStore } from "@chariot/kernel";
import { runHermitInBoardScope } from "@chariot/module-hermit";
import { tokens } from "@chariot/ui";

export function GlobalHermitBar() {
  const input = useKernelStore((state) => state.globalHermitInput);
  const setInput = useKernelStore((state) => state.setGlobalHermitInput);
  const [lastAnswer, setLastAnswer] = useState(
    "Board scope is live. Ask across HERMIT, Emergency Planner, and Userkiller.",
  );
  const [isRunning, setIsRunning] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();

    if (!question) {
      return;
    }

    const scope = getBoardScope();

    publish({
      type: "board/hermit.ask",
      payload: {
        question,
        scope,
      },
    });

    setIsRunning(true);
    const answer = await runHermitInBoardScope(question);

    startTransition(() => {
      setLastAnswer(answer);
    });

    setIsRunning(false);
  }

  return (
    <div
      style={{
        minHeight: tokens.hermitBarHeight,
        border: tokens.panelBorder,
        borderRadius: tokens.shellRadius,
        padding: "14px 18px",
        display: "grid",
        gap: "12px",
        background: tokens.panelBgElevated,
        boxShadow: "0 22px 50px rgba(0, 0, 0, 0.24)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div>
          <div className="chariot-microcopy">Global Hermit</div>
          <div style={{ marginTop: "4px", color: "var(--text-muted)" }}>
            Board-scope sniffing across all linked projects
          </div>
        </div>
        <span className="chariot-chip">
          {getBoardScope().projectIds.length} projects in scope
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Ask about integration risks, contract drift, or cross-project sequencing..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "14px",
            border: "1px solid var(--border-strong)",
            background: "rgba(255,255,255,0.05)",
            color: "inherit",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 16px",
            borderRadius: "14px",
            border: "1px solid rgba(215,164,89,0.4)",
            background: "rgba(215,164,89,0.16)",
            color: "var(--accent-strong)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {isRunning ? "Sniffing..." : "Ask"}
        </button>
      </form>

      <div
        style={{
          fontSize: "13px",
          lineHeight: 1.5,
          color: "var(--text-muted)",
          whiteSpace: "pre-wrap",
        }}
      >
        {lastAnswer}
      </div>
    </div>
  );
}
