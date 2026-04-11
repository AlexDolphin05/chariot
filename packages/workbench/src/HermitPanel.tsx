import { startTransition, useEffect, useMemo, useState } from "react";
import { useChariotI18n, useKernelStore } from "@chariot/kernel";
import { runHermitInProjectScope } from "@chariot/module-hermit";
import { PanelShell } from "@chariot/ui";

export function HermitPanel() {
  const { locale, t } = useChariotI18n();
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const workspaces = useKernelStore((state) => state.workspaces);
  const workspaceHermitInput = useKernelStore(
    (state) => state.workspaceHermitInput,
  );
  const workspaceHermitHistory = useKernelStore(
    (state) => state.workspaceHermitHistory,
  );
  const setWorkspaceHermitInput = useKernelStore(
    (state) => state.setWorkspaceHermitInput,
  );
  const appendWorkspaceHermitExchange = useKernelStore(
    (state) => state.appendWorkspaceHermitExchange,
  );
  const workspace =
    workspaces.find((candidate) => candidate.id === activeWorkspaceId) ?? null;
  const sniff = workspace?.sniff;
  const history = activeWorkspaceId
    ? workspaceHermitHistory[activeWorkspaceId] ?? []
    : [];
  const latestExchange = history.at(-1) ?? null;
  const [answer, setAnswer] = useState(t("hermit.defaultAnswer"));
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!activeWorkspaceId) {
      setAnswer(t("hermit.select"));
      return;
    }

    if (latestExchange) {
      setAnswer(latestExchange.answer);
      return;
    }

    setAnswer(t("hermit.defaultAnswer"));
  }, [activeWorkspaceId, latestExchange, locale, t]);

  const suggestedQuestion = useMemo(() => {
    if (!activeWorkspaceId) {
      return "";
    }

    return locale === "zh-CN"
      ? "Alex 在这里应该先抽哪块能力？"
      : "What capability should Alex extract first here?";
  }, [activeWorkspaceId, locale]);

  async function askWorkspaceHermit(question: string) {
    if (!activeWorkspaceId) {
      return;
    }

    setIsRunning(true);
    const nextAnswer = await runHermitInProjectScope(
      activeWorkspaceId,
      question,
      locale,
    );

    const exchange = {
      id: `${activeWorkspaceId}-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      question,
      answer: nextAnswer,
      createdAt: Date.now(),
    } as const;

    appendWorkspaceHermitExchange(exchange);

    startTransition(() => {
      setAnswer(nextAnswer);
      setWorkspaceHermitInput("");
    });

    setIsRunning(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = workspaceHermitInput.trim() || suggestedQuestion;

    if (!question) {
      return;
    }

    await askWorkspaceHermit(question);
  }

  return (
    <PanelShell title={t("hermit.panelTitle")}>
      {sniff ? (
        <div style={{ display: "grid", gap: "14px", fontSize: "13px" }}>
          <div>
            <div className="chariot-microcopy">{t("hermit.context")}</div>
            <div
              style={{
                marginTop: "6px",
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}
            >
              {sniff.summary}
            </div>
          </div>

          <div>
            <div className="chariot-microcopy">{t("hermit.entities")}</div>
            <div className="chariot-status-row" style={{ marginTop: "8px" }}>
              {sniff.entities.slice(0, 4).map((entity) => (
                <span key={entity} className="chariot-chip">
                  {entity}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="chariot-microcopy">{t("hermit.risks")}</div>
            <div
              style={{
                marginTop: "6px",
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}
            >
              {sniff.risks[0] ?? t("hermit.emptyRisk")}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "8px" }}>
            <label className="chariot-microcopy" htmlFor="workspace-hermit-input">
              {t("hermit.inputLabel")}
            </label>
            <textarea
              id="workspace-hermit-input"
              value={workspaceHermitInput}
              onChange={(event) => setWorkspaceHermitInput(event.target.value)}
              placeholder={t("hermit.inputPlaceholder")}
              rows={3}
              style={{
                width: "100%",
                resize: "vertical",
                padding: "12px 14px",
                borderRadius: "14px",
                border: "1px solid var(--border-strong)",
                background: "rgba(255,255,255,0.05)",
                color: "inherit",
              }}
            />
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(215,164,89,0.4)",
                  background: "rgba(215,164,89,0.16)",
                  color: "var(--accent-strong)",
                  cursor: "pointer",
                }}
              >
                {isRunning ? t("hermit.asking") : t("hermit.ask")}
              </button>
              {!workspaceHermitInput.trim() ? (
                <span className="chariot-chip">{suggestedQuestion}</span>
              ) : null}
            </div>
          </form>

          <div>
            <div className="chariot-microcopy">{t("hermit.output")}</div>
            <div
              style={{
                marginTop: "6px",
                padding: "12px",
                borderRadius: "14px",
                border: "1px solid var(--border-strong)",
                background: "rgba(255,255,255,0.04)",
                lineHeight: 1.5,
                color: "var(--accent-strong)",
                whiteSpace: "pre-wrap",
              }}
            >
              {answer}
            </div>
          </div>

          <div>
            <div className="chariot-microcopy">{t("hermit.history")}</div>
            {history.length > 0 ? (
              <div style={{ display: "grid", gap: "8px", marginTop: "6px" }}>
                {history
                  .slice()
                  .reverse()
                  .map((exchange) => (
                    <div
                      key={exchange.id}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "12px",
                        border: "1px solid var(--border-strong)",
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <div
                        style={{
                          color: "var(--text-strong)",
                          fontWeight: 600,
                          marginBottom: "6px",
                        }}
                      >
                        {exchange.question}
                      </div>
                      <div
                        style={{
                          color: "var(--text-muted)",
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {exchange.answer}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div
                style={{
                  marginTop: "6px",
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {t("hermit.noHistory")}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ color: "var(--text-muted)" }}>{t("hermit.select")}</div>
      )}
    </PanelShell>
  );
}
