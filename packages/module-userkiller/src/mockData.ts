import { legacyBridgeNotes } from "./legacyBridgeNotes";

export const mockUserkillerSession = {
  id: "mock-session-1",
  name: "Mock Automation Session",
  workspaceId: "workspace-userkiller",
  workspacePath: "/mock/workspace",
  outputPath: "/mock/output",
  status: "idle" as const,
  summary:
    "Adapter-only mock session. Real execution remains in the existing Python service.",
  templateCount: 3,
};

export const mockUserkillerBridge = {
  notes: legacyBridgeNotes,
};
