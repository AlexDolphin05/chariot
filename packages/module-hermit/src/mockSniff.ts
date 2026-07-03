/**
 * MOCK — 嗅探快照生成器。
 * 未来接入点：HERMIT/server/deepSniff.ts（deepIngestProject）与
 * HERMIT/server/contextPipeline.ts（retrieveWithExpansion）。
 * 现在只根据 kernel 里的 mock 数据拼一个结构正确的 SniffSnapshot。
 */
import type { SniffSnapshot } from "@chariot/types";
import { findProjectByWorkspace, findWorkspace, getKernelState } from "@chariot/kernel";

export function buildMockBoardSniff(): SniffSnapshot {
  const { projects } = getKernelState();
  const active = projects.filter((p) => p.status === "active");
  const blocked = projects.filter((p) => p.status === "blocked");

  return {
    scope: "board",
    summary: `Board 上有 ${projects.length} 个项目：${active.length} 个进行中，${blocked.length} 个被阻塞。`,
    entities: projects.map((p) => p.title),
    relations: projects.slice(1).map((p) => ({
      from: projects[0].title,
      to: p.title,
      type: "coexists-with",
    })),
    risks: blocked.map((p) => `「${p.title}」处于 blocked 状态，需要人工介入。`),
    suggestions: ["优先推进高优先级项目", "为 blocked 项目安排解阻时间"],
    updatedAt: Date.now(),
  };
}

export function buildMockProjectSniff(workspaceId: string): SniffSnapshot {
  const workspace = findWorkspace(workspaceId);
  const project = findProjectByWorkspace(workspaceId);

  return {
    scope: "project",
    summary: project
      ? `${project.title}：${project.summary ?? "（无摘要）"}。当前状态 ${project.status}。`
      : `未找到 workspace "${workspaceId}" 对应的项目。`,
    entities: project ? [project.title, ...project.tags] : [],
    relations: (project?.tags ?? []).map((tag) => ({
      from: project!.title,
      to: tag,
      type: "tagged",
    })),
    risks:
      project?.status === "blocked"
        ? [`「${project.title}」被阻塞，依赖项未就绪。`]
        : [],
    suggestions: [
      "（mock）从源项目提炼可复用能力，而不是整页迁移",
      `（mock）workspace 元数据：${JSON.stringify(workspace?.metadata ?? {})}`,
    ],
    updatedAt: Date.now(),
  };
}
