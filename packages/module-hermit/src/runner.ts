import {
  buildBoardHermitContext,
  buildWorkspaceHermitContext,
} from "./contextBuilder";

export async function runHermitInBoardScope(question: string): Promise<string> {
  const ctx = buildBoardHermitContext();

  return [
    `[MOCK][Board Hermit] ${question}`,
    `Scope summary: ${ctx.summary}`,
    `Suggested next move: ${ctx.suggestions[0]}`,
    `Current cross-project risk: ${ctx.risks[0]}`,
  ].join("\n");
}

export async function runHermitInProjectScope(
  workspaceId: string,
  question: string
): Promise<string> {
  const ctx = buildWorkspaceHermitContext(workspaceId);

  return [
    `[MOCK][Project Hermit] ${question}`,
    `Workspace: ${workspaceId}`,
    `Context summary: ${ctx.summary}`,
    `Most useful suggestion: ${ctx.suggestions[0]}`,
  ].join("\n");
}
