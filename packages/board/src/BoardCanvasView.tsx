/**
 * @chariot/board — Board 画布主视图
 * 全局 scope：画布上的项目对象散布，非侧边列表
 */
import { useKernelStore } from "@chariot/kernel";
import { BoardProjectCard } from "./BoardProjectCard";
import { GlobalPlannerOverlay } from "./GlobalPlannerOverlay";

export function BoardCanvasView() {
  const projects = useKernelStore((s) => s.projects);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "rgba(0,0,0,0.15)",
      }}
    >
      {/* 画布：项目节点按 boardPosition 散布（绝对定位） */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "24px",
        }}
      >
        {projects.map((card) => (
          <div
            key={card.id}
            style={{
              position: "absolute",
              left: card.boardPosition.x,
              top: card.boardPosition.y,
            }}
          >
            <BoardProjectCard card={card} />
          </div>
        ))}
      </div>

      {/* Global Planner Overlay：右下角 */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          right: "16px",
          maxWidth: "280px",
        }}
      >
        <GlobalPlannerOverlay />
      </div>
    </div>
  );
}
