/**
 * Userkiller Artifact Loader 接口
 * 未来对接 userkiller 的 template_manager / file_reader
 * 暂时只做接口壳和 mock
 */

export type AutomationArtifact = {
  id: string;
  name: string;
  type: "template" | "output" | "code";
  path: string;
};

/** MOCK: 恢复自动化会话 */
export async function resumeAutomationSession(
  sessionId: string
): Promise<{ status: string; artifacts: AutomationArtifact[] }> {
  return {
    status: "[MOCK] Session resumed",
    artifacts: [
      {
        id: "a1",
        name: "template-1",
        type: "template",
        path: `/mock/sessions/${sessionId}/template-1.py`,
      },
    ],
  };
}

/** MOCK: 加载自动化产物 */
export async function loadAutomationArtifacts(
  sessionId: string
): Promise<AutomationArtifact[]> {
  return [
    {
      id: "a1",
      name: "output.xlsx",
      type: "output",
      path: `/mock/sessions/${sessionId}/output/output.xlsx`,
    },
  ];
}
