/**
 * MOCK: Userkiller 模块占位数据
 * Legacy bridge notes: 未来从 userkiller Python 后端迁移时，需适配：
 * - session_manager 的 workspace/output 布局
 * - workflow_engine 的 PM→Planner→Coder→Reviewer 流水线
 * - template_manager 的相似度、兼容性逻辑
 */

export const mockUserkillerSession = {
  id: "mock-session-1",
  name: "Mock Automation Session",
  workspacePath: "/mock/workspace",
  outputPath: "/mock/output",
  status: "idle" as const,
};
