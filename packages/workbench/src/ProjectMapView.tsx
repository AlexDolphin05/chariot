/**
 * @chariot/workbench — Project Map 主视图
 * 项目 scope：主空间核心地图区域，与 Board 共享 MapNode 语义
 */
import { useKernelStore } from "@chariot/kernel";
import { MapNode } from "@chariot/ui";
import { mockProjectSniff } from "@chariot/module-hermit";
import { mockProjectPlannerSnapshot } from "@chariot/module-planner";

const MOCK_MAP_NODES = [
  { id: "task-1", title: "Task 1", summary: "First task", tags: ["core"], status: "active" as const, x: 80, y: 60 },
  { id: "task-2", title: "Task 2", summary: "Second task", tags: ["feature"], status: "blocked" as const, x: 280, y: 100 },
  { id: "task-3", title: "Task 3", summary: "Third task", tags: ["fix"], status: "idle" as const, x: 160, y: 220 },
];

export function ProjectMapView() {
  const activeWorkspaceId = useKernelStore((s) => s.activeWorkspaceId);
  const sniff = activeWorkspaceId ? mockProjectSniff(activeWorkspaceId) : null;
  const planner = activeWorkspaceId ? mockProjectPlannerSnapshot(activeWorkspaceId) : null;

  const hints = [
    ...(sniff?.suggestions ?? []),
    ...(planner?.conflicts.map((c) => c.message) ?? []),
  ];

  if (!activeWorkspaceId) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(128,128,128,0.8)",
          fontSize: "14px",
        }}
      >
        Select a project to see map
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "24px",
        }}
      >
        {MOCK_MAP_NODES.map((node) => (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: node.x,
              top: node.y,
            }}
          >
            <MapNode
              title={node.title}
              summary={node.summary}
              tags={node.tags}
              status={node.status}
              hints={hints.length > 0 ? [hints[0]] : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
