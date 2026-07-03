/**
 * MOCK — 冲突检测。
 * 未来接入点：emergency-planner/server/services 下的
 * scheduler.ts（硬约束排程）、autoBlocks.ts（checkTimeConflicts）、
 * planningWindow.ts（时间窗口）。类型已与其 plannerSnapshot.ts 对齐。
 */
import type { PlannerSnapshot } from "@chariot/types";
import { findProjectByWorkspace, getKernelState } from "@chariot/kernel";

type Conflict = PlannerSnapshot["conflicts"][number];

export function detectGlobalConflicts(): Conflict[] {
  const { projects } = getKernelState();
  const conflicts: Conflict[] = [];

  // mock 规则 1：多个 active 项目视为资源竞争
  const active = projects.filter((p) => p.status === "active");
  if (active.length > 1) {
    conflicts.push({
      id: "mock-resource-1",
      type: "resource",
      message: `${active.length} 个项目同时进行中，注意精力分配（${active
        .map((p) => p.title)
        .join(" / ")}）。`,
      relatedProjectIds: active.map((p) => p.id),
    });
  }

  // mock 规则 2：blocked 项目视为依赖冲突
  projects
    .filter((p) => p.status === "blocked")
    .forEach((p, index) => {
      conflicts.push({
        id: `mock-dependency-${index + 1}`,
        type: "dependency",
        message: `「${p.title}」被阻塞，依赖项未就绪。`,
        relatedProjectIds: [p.id],
      });
    });

  return conflicts;
}

export function detectProjectConflicts(workspaceId: string): Conflict[] {
  const project = findProjectByWorkspace(workspaceId);
  if (!project) return [];

  const conflicts: Conflict[] = [];
  if (project.status === "blocked") {
    conflicts.push({
      id: `mock-project-dependency-${project.id}`,
      type: "dependency",
      message: `「${project.title}」当前 blocked，先处理阻塞项再排程。`,
      relatedProjectIds: [project.id],
    });
  }
  if ((project.priority ?? 99) > 2) {
    conflicts.push({
      id: `mock-project-priority-${project.id}`,
      type: "priority",
      message: `「${project.title}」优先级较低（P${project.priority}），可能被高优项目挤占时间。`,
      relatedProjectIds: [project.id],
    });
  }
  return conflicts;
}
