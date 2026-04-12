import { useEffect, useState } from "react";
import { useChariotI18n, useKernelStore } from "@chariot/kernel";
import {
  getAutomationTemplates,
  openUserkillerWorkspace,
  runAutomationTemplate,
  type UserkillerAutomationTemplate,
  type UserkillerSession,
} from "@chariot/module-userkiller";
import { PanelShell } from "@chariot/ui";

export function ModuleHost() {
  const { locale } = useChariotI18n();
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const automationRunsByWorkspace = useKernelStore(
    (state) => state.automationRunsByWorkspace,
  );
  const appendAutomationRun = useKernelStore((state) => state.appendAutomationRun);

  const [session, setSession] = useState<UserkillerSession | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("follow-up-draft");
  const [brief, setBrief] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!activeWorkspaceId) {
      setSession(null);
      return;
    }

    void openUserkillerWorkspace(activeWorkspaceId, locale).then(setSession);
  }, [activeWorkspaceId, locale]);

  const templates = getAutomationTemplates(locale);
  const runs = activeWorkspaceId
    ? automationRunsByWorkspace[activeWorkspaceId] ?? []
    : [];
  const latestRun = runs[0] ?? null;
  const activeTemplate =
    templates.find((template) => template.id === selectedTemplateId) ?? templates[0];

  async function handleRun(template: UserkillerAutomationTemplate) {
    if (!activeWorkspaceId) {
      return;
    }

    setIsRunning(true);

    try {
      const run = await runAutomationTemplate(
        activeWorkspaceId,
        template.id,
        brief,
        locale,
      );

      appendAutomationRun(run);
      setBrief("");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <PanelShell title={locale === "zh-CN" ? "Userkiller Desk" : "Userkiller Desk"}>
      {activeWorkspaceId ? (
        <div style={{ display: "grid", gap: "16px", fontSize: "13px" }}>
          <div className="chariot-detail-header">
            <div>
              <div className="chariot-microcopy">
                {locale === "zh-CN" ? "Automation Office" : "Automation Office"}
              </div>
              <div className="chariot-detail-title">
                {locale === "zh-CN" ? "自动办公台" : "Automation Desk"}
              </div>
            </div>
            <div className="chariot-status-row">
              {session ? <span className="chariot-chip">{session.name}</span> : null}
              <span className="chariot-chip">
                {locale === "zh-CN" ? `${runs.length} 次运行` : `${runs.length} runs`}
              </span>
            </div>
          </div>

          <div className="chariot-soft-block">
            <div className="chariot-soft-copy">
              {session?.summary ??
                (locale === "zh-CN"
                  ? "这里负责模板、文稿和自动生成产物。"
                  : "This desk is responsible for templates, drafts, and generated outputs.")}
            </div>
          </div>

          <div className="chariot-quiet-grid">
            {templates.map((template) => {
              const isActive = template.id === selectedTemplateId;

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`chariot-template-card${isActive ? " is-active" : ""}`}
                >
                  <div className="chariot-microcopy">{template.outputLabel}</div>
                  <div className="chariot-history-question" style={{ marginTop: "8px" }}>
                    {template.name}
                  </div>
                  <div className="chariot-soft-copy" style={{ marginTop: "8px" }}>
                    {template.description}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="chariot-soft-block">
            <div className="chariot-microcopy">
              {locale === "zh-CN" ? "自动化 Brief" : "Automation Brief"}
            </div>
            <textarea
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              placeholder={
                locale === "zh-CN"
                  ? "描述这次自动办公要处理的内容、收件人或语气。"
                  : "Describe what this automation should handle, who it's for, and the tone."
              }
              rows={4}
              className="chariot-input"
              style={{ marginTop: "10px" }}
            />
            <div className="chariot-action-row" style={{ marginTop: "12px" }}>
              <button
                type="button"
                className="chariot-primary-button"
                onClick={() => void handleRun(activeTemplate)}
              >
                {isRunning
                  ? locale === "zh-CN"
                    ? "生成中…"
                    : "Generating..."
                  : locale === "zh-CN"
                    ? `运行 ${activeTemplate.name}`
                    : `Run ${activeTemplate.name}`}
              </button>
            </div>
          </div>

          <div className="chariot-soft-block">
            <div className="chariot-microcopy">
              {locale === "zh-CN" ? "最新产物" : "Latest Output"}
            </div>
            {latestRun ? (
              <div style={{ display: "grid", gap: "12px", marginTop: "10px" }}>
                <div className="chariot-status-row">
                  <span className="chariot-chip">{latestRun.templateName}</span>
                  <span className="chariot-chip">
                    {locale === "zh-CN" ? "已完成" : "Completed"}
                  </span>
                </div>
                {latestRun.artifacts.map((artifact) => (
                  <div key={artifact.id} className="chariot-history-item">
                    <div className="chariot-history-question">{artifact.name}</div>
                    <div className="chariot-soft-copy">{artifact.summary}</div>
                    <pre className="chariot-preflight-copy" style={{ marginTop: "10px" }}>
                      {artifact.content}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="chariot-soft-copy">
                {locale === "zh-CN"
                  ? "运行一个模板后，产物会显示在这里。"
                  : "Run a template and the generated artifacts will appear here."}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ color: "var(--text-muted)" }}>
          {locale === "zh-CN"
            ? "选择项目后可打开自动办公台。"
            : "Select a project to open the automation desk."}
        </div>
      )}
    </PanelShell>
  );
}
