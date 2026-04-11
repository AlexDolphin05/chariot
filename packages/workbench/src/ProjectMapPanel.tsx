import {
  getStatusLabel,
  useChariotI18n,
  useKernelStore,
} from "@chariot/kernel";
import { MapNode, Placeholder, tokens } from "@chariot/ui";

type MapSceneNode = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  status: "idle" | "active" | "blocked" | "done";
  x: number;
  y: number;
};

function createMapScenes(locale: "zh-CN" | "en"): Record<string, MapSceneNode[]> {
  if (locale === "zh-CN") {
    return {
      "project-hermit": [
        {
          id: "context-layering",
          title: "分层上下文",
          summary: "system / project / memory / task 四层",
          tags: ["上下文", "记忆"],
          status: "active",
          x: 38,
          y: 42,
        },
        {
          id: "deep-sniff",
          title: "深度嗅探",
          summary: "静态分析 + 路径扩展 + 综合总结",
          tags: ["嗅探", "分析"],
          status: "active",
          x: 268,
          y: 126,
        },
        {
          id: "workspace-assistant",
          title: "工作区助手",
          summary: "项目解释与回答编排",
          tags: ["助手", "作用域"],
          status: "idle",
          x: 140,
          y: 284,
        },
      ],
      "project-planner": [
        {
          id: "planning-window",
          title: "规划窗口",
          summary: "边界、时区与日级分割",
          tags: ["窗口", "时间"],
          status: "active",
          x: 42,
          y: 46,
        },
        {
          id: "conflict-engine",
          title: "冲突引擎",
          summary: "autoBlocks + checkTimeConflicts",
          tags: ["冲突", "约束"],
          status: "blocked",
          x: 278,
          y: 116,
        },
        {
          id: "snapshot-output",
          title: "Planner 快照",
          summary: "项目级冲突与建议输出",
          tags: ["快照", "排程"],
          status: "idle",
          x: 138,
          y: 296,
        },
      ],
      "project-userkiller": [
        {
          id: "session-adapter",
          title: "会话适配器",
          summary: "桥接 workspace / output 目录",
          tags: ["会话", "桥接"],
          status: "active",
          x: 34,
          y: 48,
        },
        {
          id: "artifact-loader",
          title: "产物加载器",
          summary: "暴露模板、输出物与生成代码",
          tags: ["产物", "模板"],
          status: "idle",
          x: 266,
          y: 134,
        },
        {
          id: "legacy-runtime",
          title: "遗留运行时说明",
          summary: "继续把 Python 执行保持在 Chariot 之外",
          tags: ["Python", "运行时"],
          status: "blocked",
          x: 126,
          y: 304,
        },
      ],
    };
  }

  return {
    "project-hermit": [
      {
        id: "context-layering",
        title: "Layered Context",
        summary: "System / project / memory / task layers",
        tags: ["context", "memory"],
        status: "active",
        x: 38,
        y: 42,
      },
      {
        id: "deep-sniff",
        title: "Deep Sniff",
        summary: "Static analysis + code-path expansion + synthesis",
        tags: ["sniff", "analysis"],
        status: "active",
        x: 268,
        y: 126,
      },
      {
        id: "workspace-assistant",
        title: "Workspace Assistant",
        summary: "Project interpretation and answer orchestration",
        tags: ["assistant", "scope"],
        status: "idle",
        x: 140,
        y: 284,
      },
    ],
    "project-planner": [
      {
        id: "planning-window",
        title: "Planning Window",
        summary: "Bounds, timezone, and daily boundaries",
        tags: ["window", "time"],
        status: "active",
        x: 42,
        y: 46,
      },
      {
        id: "conflict-engine",
        title: "Conflict Engine",
        summary: "autoBlocks + checkTimeConflicts",
        tags: ["conflicts", "constraints"],
        status: "blocked",
        x: 278,
        y: 116,
      },
      {
        id: "snapshot-output",
        title: "Planner Snapshot",
        summary: "Project-scoped conflicts and suggestions",
        tags: ["snapshot", "planner"],
        status: "idle",
        x: 138,
        y: 296,
      },
    ],
    "project-userkiller": [
      {
        id: "session-adapter",
        title: "Session Adapter",
        summary: "Bridge workspace / output directories",
        tags: ["session", "bridge"],
        status: "active",
        x: 34,
        y: 48,
      },
      {
        id: "artifact-loader",
        title: "Artifact Loader",
        summary: "Surface templates, outputs, and generated code",
        tags: ["artifact", "templates"],
        status: "idle",
        x: 266,
        y: 134,
      },
      {
        id: "legacy-runtime",
        title: "Legacy Runtime Notes",
        summary: "Keep Python execution external to Chariot",
        tags: ["python", "runtime"],
        status: "blocked",
        x: 126,
        y: 304,
      },
    ],
  };
}

export function ProjectMapPanel() {
  const { locale, t } = useChariotI18n();
  const activeProjectId = useKernelStore((state) => state.activeProjectId);
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const projects = useKernelStore((state) => state.projects);
  const workspaces = useKernelStore((state) => state.workspaces);

  const project =
    projects.find((candidate) => candidate.id === activeProjectId) ?? null;
  const workspace =
    workspaces.find((candidate) => candidate.id === activeWorkspaceId) ?? null;
  const sceneMap = createMapScenes(locale);
  const scene = activeProjectId ? sceneMap[activeProjectId] ?? [] : [];

  if (!project || !workspace) {
    return (
      <div
        style={{
          height: "100%",
          border: tokens.panelBorder,
          borderRadius: tokens.shellRadius,
          background: tokens.panelBgElevated,
          padding: "16px",
        }}
      >
        <Placeholder label={t("projectMap.placeholder")} />
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        minHeight: 0,
        display: "grid",
        gridTemplateRows: "auto minmax(0, 1fr) auto",
        border: tokens.panelBorder,
        borderRadius: tokens.shellRadius,
        background: tokens.panelBgElevated,
        overflow: "hidden",
        boxShadow: "0 28px 64px rgba(0, 0, 0, 0.24)",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: tokens.panelMutedBorder,
          display: "grid",
          gap: "8px",
        }}
      >
        <div className="chariot-microcopy">{t("projectMap.panelTitle")}</div>
        <div style={{ fontSize: "22px", fontWeight: 700 }}>{project.title}</div>
        <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
          {workspace.sniff?.summary ?? t("projectMap.fallback")}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          minHeight: 320,
          overflow: "hidden",
          background:
            "radial-gradient(circle at top left, rgba(215,164,89,0.1), transparent 34%), linear-gradient(180deg, rgba(13,18,16,0.2) 0%, rgba(8,11,10,0.38) 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.5,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div style={{ position: "absolute", inset: "20px" }}>
          {scene.map((node, index) => (
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
                statusLabel={getStatusLabel(node.status, locale)}
                hints={
                  index === 0
                    ? [
                        workspace.sniff?.suggestions[0] ?? t("projectMap.sniffPending"),
                        workspace.planner?.suggestions[0] ??
                          t("projectMap.plannerPending"),
                      ]
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: "14px 20px",
          borderTop: tokens.panelMutedBorder,
          display: "grid",
          gap: "8px",
        }}
      >
        <div className="chariot-microcopy">{t("projectMap.currentSignal")}</div>
        <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
          {workspace.planner?.conflicts[0]?.message ?? t("projectMap.clean")}
        </div>
      </div>
    </div>
  );
}
