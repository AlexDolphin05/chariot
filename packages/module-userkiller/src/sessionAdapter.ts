/**
 * Userkiller Session Adapter — 只做 contract + MOCK，不迁移 Python 核心。
 * 真实实现将通过 HTTP 调用 userkiller Flask 后端（见 legacyBridgeNotes.ts）。
 */

export type UserkillerSessionStatus =
  | "idle"
  | "running"
  | "waiting-input"
  | "completed"
  | "failed";

export type UserkillerSession = {
  id: string;
  workspaceId: string;
  name: string;
  status: UserkillerSessionStatus;
  createdAt: number;
  /** 对应 userkiller 后端的 workspace_path，桥接期只读。 */
  legacyWorkspacePath?: string;
};

export type UserkillerArtifact = {
  id: string;
  sessionId: string;
  name: string;
  kind: "file" | "code" | "report";
  summary: string;
};

/** 会话适配器接口 —— 桥接层未来按这个 contract 实现 HTTP 版本。 */
export interface UserkillerSessionAdapter {
  listSessions(workspaceId: string): Promise<UserkillerSession[]>;
  openSession(sessionId: string): Promise<UserkillerSession | null>;
  resumeSession(sessionId: string): Promise<UserkillerSession | null>;
}

// ---------------------------------------------------------------------------
// MOCK 实现
// ---------------------------------------------------------------------------

const mockSessions: UserkillerSession[] = [
  {
    id: "uk-session-1",
    workspaceId: "ws-userkiller",
    name: "批量重命名交付文件",
    status: "completed",
    createdAt: Date.now() - 86_400_000,
    legacyWorkspacePath: "backend/workspaces/uk-session-1",
  },
  {
    id: "uk-session-2",
    workspaceId: "ws-userkiller",
    name: "周报数据整理流水线",
    status: "waiting-input",
    createdAt: Date.now() - 3_600_000,
    legacyWorkspacePath: "backend/workspaces/uk-session-2",
  },
];

/** 打开某个 workspace 的 Userkiller 视图（mock：返回该 workspace 的会话列表）。 */
export async function openUserkillerWorkspace(
  workspaceId: string,
): Promise<UserkillerSession[]> {
  return mockSessions.filter((s) => s.workspaceId === workspaceId);
}

/** 恢复一个自动化会话（mock：状态翻转为 running）。 */
export async function resumeAutomationSession(
  sessionId: string,
): Promise<UserkillerSession | null> {
  const session = mockSessions.find((s) => s.id === sessionId);
  if (!session) return null;
  return { ...session, status: "running" };
}
