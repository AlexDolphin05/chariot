/**
 * Userkiller 面板 — mock 会话与产物列表。
 * 数据来自 module-userkiller 的 mock adapter；未来通过 legacy bridge
 * 直连 userkiller Flask API，不迁移其 Python 核心。
 */
import { useEffect, useState } from "react";
import { useActiveWorkspace } from "@chariot/kernel";
import {
  loadAutomationArtifacts,
  openUserkillerWorkspace,
  type UserkillerArtifact,
  type UserkillerSession,
} from "@chariot/module-userkiller";
import { PanelShell, Placeholder } from "@chariot/ui";

export function UserkillerPanel() {
  const workspace = useActiveWorkspace();
  const [sessions, setSessions] = useState<UserkillerSession[]>([]);
  const [artifacts, setArtifacts] = useState<UserkillerArtifact[]>([]);

  useEffect(() => {
    if (!workspace) return;
    void openUserkillerWorkspace(workspace.id).then(setSessions);
    setArtifacts([]);
  }, [workspace?.id]);

  if (!workspace) return null;

  return (
    <PanelShell title="Userkiller" badge="legacy bridge · mock">
      {sessions.length > 0 ? (
        <ul className="space-y-1.5">
          {sessions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => void loadAutomationArtifacts(s.id).then(setArtifacts)}
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-left text-xs hover:border-amber-300"
              >
                <span className="font-medium text-slate-700">{s.name}</span>
                <span className="ml-2 text-slate-400">{s.status}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Placeholder
          label="Automation Sessions"
          note="该 workspace 没有 mock 会话。未来接 GET /api/sessions。"
        />
      )}
      {artifacts.length > 0 ? (
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium text-slate-500">产物</p>
          {artifacts.map((a) => (
            <div key={a.id} className="rounded-md bg-slate-50 px-2 py-1.5 text-xs">
              <span className="font-medium text-slate-700">{a.name}</span>
              <p className="text-slate-400">{a.summary}</p>
            </div>
          ))}
        </div>
      ) : null}
    </PanelShell>
  );
}
