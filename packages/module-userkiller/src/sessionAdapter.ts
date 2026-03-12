/**
 * Userkiller Session Adapter 接口
 * 未来对接 userkiller Python 后端的 session_manager
 * 暂时只做接口壳和 mock
 */

export type UserkillerSession = {
  id: string;
  name: string;
  workspacePath: string;
  outputPath: string;
  status: "idle" | "executing" | "completed" | "error";
};

/** MOCK: 打开 Userkiller workspace */
export async function openUserkillerWorkspace(
  workspaceId: string
): Promise<UserkillerSession> {
  return {
    id: `session-${workspaceId}`,
    name: `[MOCK] Session for ${workspaceId}`,
    workspacePath: `/mock/workspace/${workspaceId}`,
    outputPath: `/mock/output/${workspaceId}`,
    status: "idle",
  };
}
