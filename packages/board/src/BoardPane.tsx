/**
 * @chariot/board — Board 主面板
 * 占位结构，完整视觉由 Tia 后续实现
 */
import { useKernelStore } from "@chariot/kernel";
import { BoardProjectCard } from "./BoardProjectCard";
import { Placeholder } from "@chariot/ui";

export function BoardPane() {
  const projects = useKernelStore((s) => s.projects);

  return (
    <div
      style={{
        height: "100%",
        overflow: "auto",
        padding: "16px",
      }}
    >
      <div style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>
        Board
      </div>
      {projects.length === 0 ? (
        <Placeholder label="No projects (add mock data to see cards)" />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {projects.map((card) => (
            <BoardProjectCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
