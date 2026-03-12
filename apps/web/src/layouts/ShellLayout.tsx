/**
 * Shell 布局：左 Board + 右 Workbench + 底 Global Hermit Bar
 */
import { BoardPane, GlobalHermitBar } from "@chariot/board";
import { WorkbenchPane } from "@chariot/workbench";

export function ShellLayout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: "48px",
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

      {/* Main: Board (left) + Workbench (right) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        <aside
          style={{
            width: "320px",
            minWidth: "280px",
            borderRight: "1px solid rgba(128,128,128,0.2)",
            overflow: "hidden",
          }}
        >
          <BoardPane />
        </aside>
        <main
          style={{
            flex: 1,
            overflow: "hidden",
          }}
        >
          <WorkbenchPane />
        </main>
      </div>

      {/* Bottom: Global Hermit Bar */}
      <GlobalHermitBar />
    </div>
  );
}
