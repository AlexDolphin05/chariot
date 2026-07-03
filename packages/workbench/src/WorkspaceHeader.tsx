import { useActiveProject, useActiveWorkspace } from "@chariot/kernel";
import { statusColor, statusLabel } from "@chariot/ui";

export function WorkspaceHeader() {
  const project = useActiveProject();
  const workspace = useActiveWorkspace();
  if (!project || !workspace) return null;

  return (
    <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
      <div>
        <h2 className="text-base font-bold text-slate-800">{project.title}</h2>
        <p className="text-xs text-slate-400">{workspace.name}</p>
      </div>
      <span className="flex items-center gap-1.5 text-xs text-slate-500">
        <span className={`h-2 w-2 rounded-full ${statusColor[project.status]}`} />
        {statusLabel[project.status]}
        {project.priority ? ` · P${project.priority}` : ""}
      </span>
    </header>
  );
}
