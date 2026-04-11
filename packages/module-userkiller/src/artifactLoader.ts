import type { ChariotLocale } from "@chariot/types";

export type AutomationArtifact = {
  id: string;
  name: string;
  type: "template" | "output" | "code";
  path: string;
  summary: string;
};

export type ResumeAutomationResult = {
  status: string;
  artifacts: AutomationArtifact[];
};

export interface UserkillerArtifactLoader {
  loadAutomationArtifacts(sessionId: string): Promise<AutomationArtifact[]>;
}

export async function resumeAutomationSession(
  sessionId: string,
  locale: ChariotLocale = "en",
): Promise<ResumeAutomationResult> {
  return {
    status:
      locale === "zh-CN"
        ? "Mock 会话已恢复。当前只是桥接执行状态，不做迁移。"
        : "Mock session resumed. Execution state is bridged, not migrated.",
    artifacts: [
      {
        id: `${sessionId}-template`,
        name: "planner-template.py",
        type: "template",
        path: `/mock/sessions/${sessionId}/template-1.py`,
        summary:
          locale === "zh-CN"
            ? "在 Python 桥接可调用前，模板语义应继续保持外部化。"
            : "Template semantics should stay external until the Python bridge is callable.",
      },
    ],
  };
}

export async function loadAutomationArtifacts(
  sessionId: string,
  locale: ChariotLocale = "en",
): Promise<AutomationArtifact[]> {
  return [
    {
      id: `${sessionId}-output`,
      name: "output.xlsx",
      type: "output",
      path: `/mock/sessions/${sessionId}/output/output.xlsx`,
      summary:
        locale === "zh-CN"
          ? "来自遗留自动化会话的代表性输出产物。"
          : "Representative output artifact from a legacy automation session.",
    },
    {
      id: `${sessionId}-code`,
      name: "workflow_patch.py",
      type: "code",
      path: `/mock/sessions/${sessionId}/output/workflow_patch.py`,
      summary:
        locale === "zh-CN"
          ? "Chariot 会引用而不会重写的生成代码产物。"
          : "Generated code artifact that Chariot will reference, not rewrite.",
    },
  ];
}
