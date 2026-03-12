/**
 * @chariot/workbench — Workspace 项目空间视图
 * 进入项目后的空间：Project Map 主区域 + Workspace Hermit + 次级模块（Planner/Userkiller）
 */
import { WorkspaceHeader } from "./WorkspaceHeader";
import { ProjectMapView } from "./ProjectMapView";
import { HermitPanel } from "./HermitPanel";
import { ModuleHost } from "./ModuleHost";

export function WorkspaceView() {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <WorkspaceHeader />
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Project Map：主区域，占大部分 */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <ProjectMapView />
        </div>
        {/* 右侧：Workspace Hermit（默认可见）+ 次级模块区 */}
        <div
          style={{
            width: "320px",
            flexShrink: 0,
            borderLeft: "1px solid rgba(128,128,128,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
            <HermitPanel />
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(128,128,128,0.2)",
              padding: "16px",
              maxHeight: "40%",
              overflow: "auto",
            }}
          >
            <ModuleHost />
          </div>
        </div>
      </div>
    </div>
  );
}
