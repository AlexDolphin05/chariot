/**
 * Hermit 运行器占位
 * 未来接入 HERMIT 的 hermitBrain / LLM
 * 当前仅返回 mock 解释性文本
 */
import {
  buildBoardHermitContext,
  buildWorkspaceHermitContext,
} from "./contextBuilder";

/** MOCK: 在 board 作用域运行 Hermit */
export async function runHermitInBoardScope(
  question: string
): Promise<string> {
  const ctx = buildBoardHermitContext();
  return `[MOCK] Board Hermit 回答:\n问题: "${question}"\n上下文: ${ctx.summary}\n建议: ${ctx.suggestions.join("; ")}`;
}

/** MOCK: 在 project 作用域运行 Hermit */
export async function runHermitInProjectScope(
  workspaceId: string,
  question: string
): Promise<string> {
  const ctx = buildWorkspaceHermitContext(workspaceId);
  return `[MOCK] Project Hermit 回答:\nworkspace: ${workspaceId}\n问题: "${question}"\n上下文: ${ctx.summary}\n建议: ${ctx.suggestions.join("; ")}`;
}
