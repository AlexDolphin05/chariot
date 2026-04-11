import type { SniffSnapshot } from "@chariot/types";
import {
  buildBoardSniffSnapshot,
  buildWorkspaceSniffSnapshot,
} from "./contextBuilder";

export const mockBoardSniff: SniffSnapshot = buildBoardSniffSnapshot();

export function mockProjectSniff(workspaceId: string): SniffSnapshot {
  return buildWorkspaceSniffSnapshot(workspaceId);
}
