import { startTransition, useEffect, useMemo, useState } from "react";
import { useChariotI18n, useKernelStore } from "@chariot/kernel";
import {
  requestCompiledHermitPrompt,
  runHermitInProjectScope,
} from "@chariot/module-hermit";
import { PanelShell } from "@chariot/ui";

export function HermitPanel() {
  const { locale, t } = useChariotI18n();
  const activeProjectId = useKernelStore((state) => state.activeProjectId);
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const projects = useKernelStore((state) => state.projects);
  const workspaces = useKernelStore((state) => state.workspaces);
  const workspaceHermitInput = useKernelStore(
    (state) => state.workspaceHermitInput,
  );
  const workspaceHermitHistory = useKernelStore(
    (state) => state.workspaceHermitHistory,
  );
  const compiledPromptsByWorkspace = useKernelStore(
    (state) => state.compiledPromptsByWorkspace,
  );
  const setWorkspaceHermitInput = useKernelStore(
    (state) => state.setWorkspaceHermitInput,
  );
  const appendWorkspaceHermitExchange = useKernelStore(
    (state) => state.appendWorkspaceHermitExchange,
  );
  const setCompiledPrompt = useKernelStore((state) => state.setCompiledPrompt);

  const workspace =
    workspaces.find((candidate) => candidate.id === activeWorkspaceId) ?? null;
  const project =
    projects.find((candidate) => candidate.id === activeProjectId) ?? null;
  const history = activeWorkspaceId
    ? workspaceHermitHistory[activeWorkspaceId] ?? []
    : [];
  const compiledPrompt = activeWorkspaceId
    ? compiledPromptsByWorkspace[activeWorkspaceId] ?? null
    : null;
  const latestExchange = history.at(-1) ?? null;

  const [answer, setAnswer] = useState(t("hermit.defaultAnswer"));
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);

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
  }, [activeWorkspaceId, latestExchange, t]);

  const suggestedQuestion = useMemo(() => {
    if (!activeWorkspaceId) {
      return "";
    }

    return locale === "zh-CN"
      ? "把当前项目的下一步整理成可以执行的 prompt。"
      : "Turn the next step for this project into an executable prompt.";
  }, [activeWorkspaceId, locale]);

  async function compilePrompt(question: string) {
    if (!activeWorkspaceId || !workspace) {
      return;
    }

    setCompileError(null);
    setIsCompiling(true);

    try {
      const result = await requestCompiledHermitPrompt({
        locale,
        mode: "project",
        question,
        projectTitle: project?.title,
        workspaceName: workspace.name,
        sniffSummary: workspace.sniff?.summary ?? "",
        plannerSummary: workspace.planner?.suggestions[0],
        entities: workspace.sniff?.entities ?? [],
        risks: workspace.sniff?.risks ?? [],
        suggestions: [
          ...(workspace.sniff?.suggestions ?? []),
          ...(workspace.planner?.suggestions ?? []),
        ],
      });

      setCompiledPrompt(activeWorkspaceId, result);
    } catch (error) {
      setCompileError(
        error instanceof Error
          ? error.message
          : locale === "zh-CN"
            ? "编译失败"
            : "Compile failed",
      );
    } finally {
      setIsCompiling(false);
    }
  }

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

    appendWorkspaceHermitExchange({
      id: `${activeWorkspaceId}-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      question,
      answer: nextAnswer,
      createdAt: Date.now(),
    });

    startTransition(() => {
      setAnswer(nextAnswer);
      setWorkspaceHermitInput("");
    });

    setIsRunning(false);
  }

  async function handleCompile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = workspaceHermitInput.trim() || suggestedQuestion;

    if (!question) {
      return;
    }

    await compilePrompt(question);
  }

  async function handleAsk() {
    const question = workspaceHermitInput.trim() || suggestedQuestion;

    if (!question) {
      return;
    }

    await compilePrompt(question);

    await askWorkspaceHermit(question);
  }

  return (
    <PanelShell title={t("hermit.panelTitle")}>
      {workspace ? (
        <div style={{ display: "grid", gap: "16px", fontSize: "13px" }}>
          <div className="chariot-detail-header">
            <div>
              <div className="chariot-microcopy">
                {locale === "zh-CN" ? "Prompt Compiler" : "Prompt Compiler"}
              </div>
              <div className="chariot-detail-title">
                {locale === "zh-CN"
                  ? "Hermit 提示词编译台"
                  : "Hermit Prompt Compiler"}
              </div>
            </div>
            <div className="chariot-status-row">
              <span className="chariot-chip">{workspace.name}</span>
              <span className="chariot-chip">
                {locale === "zh-CN"
                  ? `${workspace.sniff?.entities.length ?? 0} 个实体`
                  : `${workspace.sniff?.entities.length ?? 0} entities`}
              </span>
            </div>
          </div>

          <div className="chariot-quiet-grid">
            <div className="chariot-soft-block">
              <div className="chariot-microcopy">{t("hermit.context")}</div>
              <div className="chariot-soft-copy">
                {workspace.sniff?.summary ?? t("hermit.select")}
              </div>
            </div>
            <div className="chariot-soft-block">
              <div className="chariot-microcopy">{t("hermit.risks")}</div>
              <div className="chariot-soft-copy">
                {workspace.sniff?.risks[0] ?? t("hermit.emptyRisk")}
              </div>
            </div>
          </div>

          <form onSubmit={handleCompile} style={{ display: "grid", gap: "10px" }}>
            <label className="chariot-microcopy" htmlFor="workspace-hermit-input">
              {t("hermit.inputLabel")}
            </label>
            <textarea
              id="workspace-hermit-input"
              value={workspaceHermitInput}
              onChange={(event) => setWorkspaceHermitInput(event.target.value)}
              placeholder={t("hermit.inputPlaceholder")}
              rows={4}
              className="chariot-input"
            />
            <div className="chariot-action-row">
              <button type="submit" className="chariot-primary-button">
                {isCompiling
                  ? locale === "zh-CN"
                    ? "编译中…"
                    : "Compiling..."
                  : locale === "zh-CN"
                    ? "编译 Prompt"
                    : "Compile Prompt"}
              </button>
              <button
                type="button"
                className="chariot-secondary-button"
                onClick={() => void handleAsk()}
              >
                {isRunning ? t("hermit.asking") : t("hermit.ask")}
              </button>
              {!workspaceHermitInput.trim() ? (
                <span className="chariot-chip">{suggestedQuestion}</span>
              ) : null}
            </div>
          </form>

          {compileError ? (
            <div className="chariot-error-copy">{compileError}</div>
          ) : null}

          {compiledPrompt ? (
            <div className="chariot-quiet-grid">
              <div className="chariot-soft-block">
                <div className="chariot-microcopy">
                  {locale === "zh-CN" ? "系统提示词" : "System Prompt"}
                </div>
                <pre className="chariot-preflight-copy">
                  {compiledPrompt.systemPrompt}
                </pre>
              </div>
              <div className="chariot-soft-block">
                <div className="chariot-microcopy">
                  {locale === "zh-CN" ? "用户提示词" : "User Prompt"}
                </div>
                <pre className="chariot-preflight-copy">
                  {compiledPrompt.userPrompt}
                </pre>
              </div>
            </div>
          ) : null}

          <div className="chariot-soft-block">
            <div className="chariot-microcopy">{t("hermit.output")}</div>
            <div className="chariot-soft-copy" style={{ color: "var(--accent-strong)" }}>
              {answer}
            </div>
          </div>

          <div className="chariot-soft-block">
            <div className="chariot-microcopy">{t("hermit.history")}</div>
            {history.length > 0 ? (
              <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
                {history
                  .slice()
                  .reverse()
                  .map((exchange) => (
                    <div key={exchange.id} className="chariot-history-item">
                      <div className="chariot-history-question">{exchange.question}</div>
                      <div className="chariot-soft-copy">{exchange.answer}</div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="chariot-soft-copy">{t("hermit.noHistory")}</div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ color: "var(--text-muted)" }}>{t("hermit.select")}</div>
      )}
    </PanelShell>
  );
}
