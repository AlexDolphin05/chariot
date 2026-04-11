import type { ChariotLocale } from "@chariot/types";
import {
  buildBoardHermitContext,
  buildWorkspaceHermitContext,
} from "./contextBuilder";

export async function runHermitInBoardScope(
  question: string,
  locale: ChariotLocale = "en",
): Promise<string> {
  const ctx = buildBoardHermitContext(locale);

  if (locale === "zh-CN") {
    return [
      `[MOCK][全局 Hermit] ${question}`,
      `作用域总结：${ctx.summary}`,
      `建议动作：${ctx.suggestions[0]}`,
      `当前跨项目风险：${ctx.risks[0]}`,
    ].join("\n");
  }

  return [
    `[MOCK][Board Hermit] ${question}`,
    `Scope summary: ${ctx.summary}`,
    `Suggested next move: ${ctx.suggestions[0]}`,
    `Current cross-project risk: ${ctx.risks[0]}`,
  ].join("\n");
}

export async function runHermitInProjectScope(
  workspaceId: string,
  question: string,
  locale: ChariotLocale = "en",
): Promise<string> {
  const ctx = buildWorkspaceHermitContext(workspaceId, locale);

  if (locale === "zh-CN") {
    return [
      `[MOCK][项目 Hermit] ${question}`,
      `工作区：${workspaceId}`,
      `上下文总结：${ctx.summary}`,
      `当前最有用的建议：${ctx.suggestions[0]}`,
    ].join("\n");
  }

  return [
    `[MOCK][Project Hermit] ${question}`,
    `Workspace: ${workspaceId}`,
    `Context summary: ${ctx.summary}`,
    `Most useful suggestion: ${ctx.suggestions[0]}`,
  ].join("\n");
}
