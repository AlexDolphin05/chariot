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
  sessionId: string
): Promise<ResumeAutomationResult> {
  return {
    status: "Mock session resumed. Execution state is bridged, not migrated.",
    artifacts: [
      {
        id: `${sessionId}-template`,
        name: "planner-template.py",
        type: "template",
        path: `/mock/sessions/${sessionId}/template-1.py`,
        summary: "Template semantics should stay external until the Python bridge is callable.",
      },
    ],
  };
}

export async function loadAutomationArtifacts(
  sessionId: string
): Promise<AutomationArtifact[]> {
  return [
    {
      id: `${sessionId}-output`,
      name: "output.xlsx",
      type: "output",
      path: `/mock/sessions/${sessionId}/output/output.xlsx`,
      summary: "Representative output artifact from a legacy automation session.",
    },
    {
      id: `${sessionId}-code`,
      name: "workflow_patch.py",
      type: "code",
      path: `/mock/sessions/${sessionId}/output/workflow_patch.py`,
      summary: "Generated code artifact that Chariot will reference, not rewrite.",
    },
  ];
}
