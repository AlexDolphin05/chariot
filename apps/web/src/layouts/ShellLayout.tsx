/**
 * Shell 布局：TopBar + MainViewport（按 mode 切换 Board / Workspace）+ BottomGlobalHermitBar + FloatingPlanetDock
 * 不是左右平铺的 dashboard，而是统一空间界面
 */
import { useKernelStore } from "@chariot/kernel";
import { BoardCanvasView, GlobalHermitBar } from "@chariot/board";
import { WorkspaceView, PlanetDock } from "@chariot/workbench";

export function ShellLayout() {
  const appViewMode = useKernelStore((s) => s.appViewMode);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* TopBar：轻量，workspace 模式下由 WorkspaceView 提供 Back to Board */}
      <header
        style={{
          height: "48px",
          flexShrink: 0,
          borderBottom: "1px solid rgba(128,128,128,0.2)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        Chariot
      </header>

      {/* MainViewport：按 appViewMode 渲染 Board 或 Workspace */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {appViewMode === "board" ? (
          <BoardCanvasView />
        ) : (
          <WorkspaceView />
        )}
      </div>

      {/* BottomGlobalHermitBar：常驻 */}
      <GlobalHermitBar />

      {/* FloatingPlanetDock：仅 workspace 模式 */}
      {appViewMode === "workspace" && (
        <div
          style={{
            position: "fixed",
            bottom: "72px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
          }}
        >
          <PlanetDock />
        </div>
      )}
    </div>
  );
}
