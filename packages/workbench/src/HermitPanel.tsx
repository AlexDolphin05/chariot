import { startTransition, useEffect, useMemo, useState } from "react";
import { useChariotI18n, useKernelStore } from "@chariot/kernel";
import {
  requestCompiledHermitPrompt,
  requestPolishedHermitPrompt,
  runHermitInProjectScope,
} from "@chariot/module-hermit";
import type {
  ChariotLocale,
  HermitPromptPolishResult,
} from "@chariot/types";
import { PanelShell } from "@chariot/ui";

type HermitPromptMode = "compile" | "polish";

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
  const [promptMode, setPromptMode] = useState<HermitPromptMode>("compile");
  const [targetLocale, setTargetLocale] = useState<ChariotLocale>("en");
  const [polishResult, setPolishResult] =
    useState<HermitPromptPolishResult | null>(null);
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

  const suggestedPolishText = useMemo(() => {
    if (!activeWorkspaceId) {
      return "";
    }

    return locale === "zh-CN"
      ? "请把这个想法整理成英文 prompt：让 Hermit 基于当前项目上下文，判断下一步优先级。"
      : "Polish this into a Chinese prompt: ask Hermit to judge the next priority from the current project context.";
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

  async function polishPrompt(sourceText: string) {
    if (!activeWorkspaceId || !workspace) {
      return;
    }

    setCompileError(null);
    setIsCompiling(true);

    try {
      const result = await requestPolishedHermitPrompt({
        locale,
        mode: targetLocale === locale ? "polish" : "translate",
        sourceText,
        targetLocale,
        projectTitle: project?.title,
        workspaceName: workspace.name,
        intent:
          locale === "zh-CN"
            ? "把输入整理成可直接交给模型的清晰 prompt。"
            : "Turn the input into a clear model-ready prompt.",
      });

      setPolishResult(result);
    } catch (error) {
      setCompileError(
        error instanceof Error
          ? error.message
          : locale === "zh-CN"
            ? "润色失败"
            : "Polish failed",
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

    const question =
      workspaceHermitInput.trim() ||
      (promptMode === "compile" ? suggestedQuestion : suggestedPolishText);

    if (!question) {
      return;
    }

    if (promptMode === "compile") {
      await compilePrompt(question);
      return;
    }

    await polishPrompt(question);
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
                {promptMode === "compile"
                  ? "Prompt Compiler"
                  : locale === "zh-CN"
                    ? "Prompt Polish"
                    : "Prompt Polish"}
              </div>
              <div className="chariot-detail-title">
                {promptMode === "compile"
                  ? locale === "zh-CN"
                    ? "Hermit 提示词编译台"
                    : "Hermit Prompt Compiler"
                  : locale === "zh-CN"
                    ? "Hermit 翻译与润色"
                    : "Hermit Translation and Polish"}
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
            <div className="chariot-mode-toggle" aria-label="Hermit prompt mode">
              <button
                type="button"
                className={`chariot-mode-button${
                  promptMode === "compile" ? " is-active" : ""
                }`}
                onClick={() => setPromptMode("compile")}
              >
                {locale === "zh-CN" ? "编译" : "Compile"}
              </button>
              <button
                type="button"
                className={`chariot-mode-button${
                  promptMode === "polish" ? " is-active" : ""
                }`}
                onClick={() => setPromptMode("polish")}
              >
                {locale === "zh-CN" ? "翻译/润色" : "Polish"}
              </button>
            </div>
            {promptMode === "polish" ? (
              <div className="chariot-action-row">
                <button
                  type="button"
                  className={`chariot-mode-button${
                    targetLocale === "zh-CN" ? " is-active" : ""
                  }`}
                  onClick={() => setTargetLocale("zh-CN")}
                >
                  中文
                </button>
                <button
                  type="button"
                  className={`chariot-mode-button${
                    targetLocale === "en" ? " is-active" : ""
                  }`}
                  onClick={() => setTargetLocale("en")}
                >
                  English
                </button>
              </div>
            ) : null}
            <label className="chariot-microcopy" htmlFor="workspace-hermit-input">
              {t("hermit.inputLabel")}
            </label>
            <textarea
              id="workspace-hermit-input"
              value={workspaceHermitInput}
              onChange={(event) => setWorkspaceHermitInput(event.target.value)}
              placeholder={
                promptMode === "compile"
                  ? t("hermit.inputPlaceholder")
                  : locale === "zh-CN"
                    ? "输入粗糙想法、中英混合 prompt 或需要翻译的指令……"
                    : "Paste a rough idea, mixed-language prompt, or instruction to translate..."
              }
              rows={4}
              className="chariot-input"
            />
            <div className="chariot-action-row">
              <button type="submit" className="chariot-primary-button">
                {isCompiling
                  ? locale === "zh-CN"
                    ? promptMode === "compile"
                      ? "编译中…"
                      : "润色中…"
                    : promptMode === "compile"
                      ? "Compiling..."
                      : "Polishing..."
                  : promptMode === "compile"
                    ? locale === "zh-CN"
                      ? "编译 Prompt"
                      : "Compile Prompt"
                    : locale === "zh-CN"
                      ? "翻译/润色"
                      : "Polish Prompt"}
              </button>
              {promptMode === "compile" ? (
                <button
                  type="button"
                  className="chariot-secondary-button"
                  onClick={() => void handleAsk()}
                >
                  {isRunning ? t("hermit.asking") : t("hermit.ask")}
                </button>
              ) : null}
              {!workspaceHermitInput.trim() ? (
                <span className="chariot-chip">
                  {promptMode === "compile"
                    ? suggestedQuestion
                    : suggestedPolishText}
                </span>
              ) : null}
            </div>
          </form>

          {compileError ? (
            <div className="chariot-error-copy">{compileError}</div>
          ) : null}

          {promptMode === "compile" && compiledPrompt ? (
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

          {promptMode === "polish" && polishResult ? (
            <div className="chariot-quiet-grid">
              <div className="chariot-soft-block">
                <div className="chariot-microcopy">
                  {locale === "zh-CN" ? "润色结果" : "Polished Prompt"}
                </div>
                <pre className="chariot-preflight-copy">
                  {polishResult.polishedPrompt}
                </pre>
              </div>
              <div className="chariot-soft-block">
                <div className="chariot-microcopy">
                  {locale === "zh-CN" ? "目标语言版本" : "Target Language"}
                </div>
                <pre className="chariot-preflight-copy">
                  {polishResult.translatedPrompt}
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
