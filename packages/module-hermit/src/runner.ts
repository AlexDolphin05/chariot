/**
 * Hermit runner — MOCK 实现。
 * 未来接入点：真实模型调用（HERMIT 的 hermit.ts / modelRouter），
 * 这里先返回解释性文本，保证壳层交互闭环。
 */
import { buildBoardHermitContext, buildWorkspaceHermitContext } from "./contextBuilder";

export async function runHermitInBoardScope(question: string): Promise<string> {
  const context = buildBoardHermitContext();
  return [
    `（mock·board scope）你问：「${question}」`,
    context.sniff.summary,
    context.sniff.risks.length > 0
      ? `风险：${context.sniff.risks.join("；")}`
      : "当前没有全局风险。",
    "→ 真实实现将基于全部项目的嗅探结果做全局回答。",
  ].join("\n");
}

export async function runHermitInProjectScope(
  workspaceId: string,
  question: string,
): Promise<string> {
  const context = buildWorkspaceHermitContext(workspaceId);
  return [
    `（mock·project scope）你问：「${question}」`,
    context.sniff.summary,
    `涉及实体：${context.sniff.entities.join("、") || "（无）"}`,
    "→ 真实实现将基于当前 workspace 的上下文管线（retrieve → evidence → answer）。",
  ].join("\n");
}
