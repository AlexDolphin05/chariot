/**
 * Artifact Loader — MOCK。
 * 真实实现对应 userkiller 后端 GET /api/sessions/<id>/files。
 */
import type { UserkillerArtifact } from "./sessionAdapter";

const mockArtifacts: UserkillerArtifact[] = [
  {
    id: "uk-artifact-1",
    sessionId: "uk-session-1",
    name: "renamed_files_report.md",
    kind: "report",
    summary: "重命名结果报告：42 个文件，0 个失败",
  },
  {
    id: "uk-artifact-2",
    sessionId: "uk-session-2",
    name: "weekly_pipeline.py",
    kind: "code",
    summary: "周报数据整理脚本（等待用户确认输入源）",
  },
];

export async function loadAutomationArtifacts(
  sessionId: string,
): Promise<UserkillerArtifact[]> {
  return mockArtifacts.filter((a) => a.sessionId === sessionId);
}
