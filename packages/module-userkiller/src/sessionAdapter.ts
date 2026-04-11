import type { ChariotLocale } from "@chariot/types";

export type UserkillerSessionStatus =
  | "idle"
  | "executing"
  | "completed"
  | "error";

export type UserkillerSession = {
  id: string;
  name: string;
  workspaceId: string;
  workspacePath: string;
  outputPath: string;
  status: UserkillerSessionStatus;
  summary: string;
  templateCount: number;
};

export interface UserkillerSessionAdapter {
  openUserkillerWorkspace(workspaceId: string): Promise<UserkillerSession>;
}

export async function openUserkillerWorkspace(
  workspaceId: string,
  locale: ChariotLocale = "en",
): Promise<UserkillerSession> {
  const workspaceLabel = workspaceId.replace("workspace-", "");

  return {
    id: `session-${workspaceId}`,
    name: `Userkiller ${workspaceLabel} bridge`,
    workspaceId,
    workspacePath: `/mock/workspace/${workspaceId}`,
    outputPath: `/mock/output/${workspaceId}`,
    status: "idle",
    summary:
      locale === "zh-CN"
        ? "Mock 会话桥已就绪。后续要对接 session_manager.py 和 workflow_engine.py。"
        : "Mock session bridge ready. Future work: connect to session_manager.py and workflow_engine.py.",
    templateCount: workspaceId === "workspace-userkiller" ? 4 : 2,
  };
}
