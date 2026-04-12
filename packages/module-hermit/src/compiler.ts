import type {
  HermitPromptCompileRequest,
  HermitPromptCompileResult,
  HermitPromptSection,
} from "@chariot/types";

function joinList(items: string[]): string {
  return items.filter(Boolean).join(", ");
}

export function buildCompiledHermitPrompt(
  request: HermitPromptCompileRequest,
): HermitPromptCompileResult {
  const modeLabel =
    request.locale === "zh-CN"
      ? request.mode === "board"
        ? "画布作用域"
        : "项目作用域"
      : request.mode === "board"
        ? "board scope"
        : "project scope";

  const systemPrompt =
    request.locale === "zh-CN"
      ? `你是 Chariot 内置的 Hermit 提示词编译器。你的任务是把当前 ${modeLabel} 的上下文压缩成清晰、可执行、可继续追问的工作提示词。输出必须优先保留目标、上下文、风险和建议。`
      : `You are Chariot's built-in Hermit prompt compiler. Compress the current ${modeLabel} context into a clear, actionable prompt that preserves goal, context, risks, and suggestions.`;

  const userPrompt =
    request.locale === "zh-CN"
      ? `目标：${request.question}\n项目：${request.projectTitle ?? "未指定"}\n工作区：${request.workspaceName ?? "未指定"}\n上下文总结：${request.sniffSummary}\nPlanner：${request.plannerSummary ?? "暂无"}\n实体：${joinList(
          request.entities,
        )}\n风险：${joinList(request.risks)}\n建议：${joinList(request.suggestions)}`
      : `Goal: ${request.question}\nProject: ${request.projectTitle ?? "n/a"}\nWorkspace: ${request.workspaceName ?? "n/a"}\nContext summary: ${request.sniffSummary}\nPlanner: ${request.plannerSummary ?? "n/a"}\nEntities: ${joinList(
          request.entities,
        )}\nRisks: ${joinList(request.risks)}\nSuggestions: ${joinList(request.suggestions)}`;

  const sections: HermitPromptSection[] =
    request.locale === "zh-CN"
      ? [
          {
            id: "goal",
            label: "目标",
            content: request.question,
          },
          {
            id: "context",
            label: "上下文",
            content: request.sniffSummary,
          },
          {
            id: "planner",
            label: "排程信号",
            content: request.plannerSummary ?? "当前没有排程摘要。",
          },
          {
            id: "guardrails",
            label: "守则",
            content: `保留实体 ${joinList(request.entities)}，优先处理风险 ${joinList(
              request.risks,
            )}，并参考建议 ${joinList(request.suggestions)}。`,
          },
        ]
      : [
          {
            id: "goal",
            label: "Goal",
            content: request.question,
          },
          {
            id: "context",
            label: "Context",
            content: request.sniffSummary,
          },
          {
            id: "planner",
            label: "Planner Signal",
            content: request.plannerSummary ?? "No planner summary yet.",
          },
          {
            id: "guardrails",
            label: "Guardrails",
            content: `Keep entities ${joinList(request.entities)}, prioritize risks ${joinList(
              request.risks,
            )}, and use suggestions ${joinList(request.suggestions)}.`,
          },
        ];

  const compiledPrompt = [systemPrompt, "", userPrompt].join("\n");

  return {
    title:
      request.locale === "zh-CN"
        ? `${request.projectTitle ?? "Chariot"} 提示词编译结果`
        : `${request.projectTitle ?? "Chariot"} Prompt Compile`,
    mode: request.mode,
    systemPrompt,
    userPrompt,
    compiledPrompt,
    notes:
      request.locale === "zh-CN"
        ? [
            "这是为 Hermit 运行器准备的压缩提示词，不是最终回答。",
            "如果要提高质量，下一步应该继续喂入更具体的项目目标和排程窗口。",
          ]
        : [
            "This is a compressed prompt for the Hermit runner, not the final answer.",
            "To improve quality, feed in a tighter project goal and concrete planning windows next.",
          ],
    sections,
    updatedAt: Date.now(),
  };
}

export async function requestCompiledHermitPrompt(
  request: HermitPromptCompileRequest,
): Promise<HermitPromptCompileResult> {
  const response = await fetch("/api/prompt/compile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Prompt compile failed with status ${response.status}`);
  }

  return (await response.json()) as HermitPromptCompileResult;
}
