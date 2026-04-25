import type {
  HermitPromptCompileRequest,
  HermitPromptCompileResult,
  HermitPromptPolishRequest,
  HermitPromptPolishResult,
  HermitPromptSection,
} from "@chariot/types";

function joinList(items: string[]): string {
  return items.filter(Boolean).join(", ");
}

function normalizePrompt(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function localTranslate(text: string, targetLocale: "zh-CN" | "en"): string {
  const dictionary =
    targetLocale === "zh-CN"
      ? [
          ["next steps", "下一步"],
          ["next step", "下一步"],
          ["risks", "风险"],
          ["risk", "风险"],
          ["prompts", "提示词"],
          ["prompt", "提示词"],
          ["context", "上下文"],
          ["goal", "目标"],
          ["suggestion", "建议"],
          ["suggestions", "建议"],
          ["project", "项目"],
          ["workspace", "工作区"],
          ["planner", "排程器"],
          ["schedule", "排程"],
          ["automation", "自动化"],
          ["compile", "编译"],
          ["polish", "润色"],
        ]
      : [
          ["润色成可执行提示词", "polish into an executable prompt"],
          ["润色成可执行prompt", "polish into an executable prompt"],
          ["请整理", "Please organize"],
          ["上下文", "context"],
          ["目标", "goal"],
          ["风险", "risk"],
          ["建议", "suggestions"],
          ["项目", "project"],
          ["工作区", "workspace"],
          ["排程器", "planner"],
          ["排程", "schedule"],
          ["自动化", "automation"],
          ["提示词", "prompt"],
          ["编译", "compile"],
          ["润色", "polish"],
          ["下一步", "next step"],
        ];

  return dictionary.reduce(
    (current, [from, to]) => current.replaceAll(from, to),
    text,
  );
}

function buildPromptBody(
  request: HermitPromptPolishRequest,
  outputLocale: "zh-CN" | "en",
): string {
  const normalized = normalizePrompt(request.sourceText);
  const translatedSource = localTranslate(normalized, outputLocale);
  const intent = request.intent?.trim()
    ? localTranslate(request.intent.trim(), outputLocale)
    : null;
  const projectTitle = request.projectTitle
    ? localTranslate(request.projectTitle, outputLocale)
    : null;
  const workspaceName = request.workspaceName
    ? localTranslate(request.workspaceName, outputLocale)
    : null;

  if (outputLocale === "zh-CN") {
    return [
      intent ? `目标：${intent}` : null,
      projectTitle ? `项目：${projectTitle}` : null,
      workspaceName ? `工作区：${workspaceName}` : null,
      "请基于以下内容给出清晰、可执行、边界明确的回答：",
      translatedSource,
      "输出要求：保留关键限制，先处理不确定性，再给出下一步。",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    intent ? `Goal: ${intent}` : null,
    projectTitle ? `Project: ${projectTitle}` : null,
    workspaceName ? `Workspace: ${workspaceName}` : null,
    "Use the following context to produce a clear, actionable answer with explicit boundaries:",
    translatedSource,
    "Output requirements: preserve constraints, handle uncertainty first, then provide next steps.",
  ]
    .filter(Boolean)
    .join("\n");
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

export function buildPolishedHermitPrompt(
  request: HermitPromptPolishRequest,
): HermitPromptPolishResult {
  const normalized = normalizePrompt(request.sourceText);
  const polishedPrompt = buildPromptBody(request, request.locale);
  const translatedPrompt =
    request.mode === "translate"
      ? buildPromptBody(request, request.targetLocale)
      : polishedPrompt;
  const targetLabel =
    request.targetLocale === "zh-CN" ? "中文" : "English";

  const sections: HermitPromptSection[] =
    request.locale === "zh-CN"
      ? [
          {
            id: "source",
            label: "原始输入",
            content: normalized,
          },
          {
            id: "polished",
            label: "润色后",
            content: polishedPrompt,
          },
          {
            id: "translated",
            label: `目标语言：${targetLabel}`,
            content: translatedPrompt,
          },
        ]
      : [
          {
            id: "source",
            label: "Source",
            content: normalized,
          },
          {
            id: "polished",
            label: "Polished",
            content: polishedPrompt,
          },
          {
            id: "translated",
            label: `Target: ${targetLabel}`,
            content: translatedPrompt,
          },
        ];

  return {
    title:
      request.locale === "zh-CN"
        ? `${request.projectTitle ?? "Hermit"} Prompt 润色结果`
        : `${request.projectTitle ?? "Hermit"} Prompt Polish`,
    mode: request.mode,
    targetLocale: request.targetLocale,
    originalPrompt: normalized,
    polishedPrompt,
    translatedPrompt,
    notes:
      request.locale === "zh-CN"
        ? [
            "本地服务会先清理结构，再生成可直接交给模型的 prompt。",
            "翻译模式会做轻量术语转换；正式模型接入后可以替换为更强翻译器。",
          ]
        : [
            "The local service first normalizes structure, then returns a model-ready prompt.",
            "Translate mode applies lightweight term mapping; a stronger translator can replace this later.",
          ],
    sections,
    updatedAt: Date.now(),
  };
}

export async function requestPolishedHermitPrompt(
  request: HermitPromptPolishRequest,
): Promise<HermitPromptPolishResult> {
  const response = await fetch("/api/prompt/polish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Prompt polish failed with status ${response.status}`);
  }

  return (await response.json()) as HermitPromptPolishResult;
}
