import { useEffect, useMemo, useState } from "react";
import {
  syncWorkspacePlannerSnapshot,
  useChariotI18n,
  useKernelStore,
} from "@chariot/kernel";
import {
  buildLivePlanningSnapshot,
  detectTaskConflicts,
  sortPlannerTasks,
} from "@chariot/module-planner";
import { PanelShell } from "@chariot/ui";

function formatInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function PlannerPanel() {
  const { locale } = useChariotI18n();
  const activeWorkspaceId = useKernelStore((state) => state.activeWorkspaceId);
  const plannerTasksByWorkspace = useKernelStore(
    (state) => state.plannerTasksByWorkspace,
  );
  const workspaces = useKernelStore((state) => state.workspaces);
  const addPlannerTask = useKernelStore((state) => state.addPlannerTask);
  const updatePlannerTaskStatus = useKernelStore(
    (state) => state.updatePlannerTaskStatus,
  );

  const workspace =
    workspaces.find((candidate) => candidate.id === activeWorkspaceId) ?? null;
  const tasks = activeWorkspaceId
    ? plannerTasksByWorkspace[activeWorkspaceId] ?? []
    : [];
  const orderedTasks = useMemo(() => sortPlannerTasks(tasks), [tasks]);
  const conflicts = useMemo(() => detectTaskConflicts(tasks, locale), [tasks, locale]);

  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<"task" | "meeting" | "automation" | "review">(
    "task",
  );
  const [lane, setLane] = useState(locale === "zh-CN" ? "深度工作" : "deep work");
  const [startsAt, setStartsAt] = useState(() =>
    formatInputValue(new Date("2026-04-12T16:00:00+10:00")),
  );
  const [durationMinutes, setDurationMinutes] = useState("60");

  useEffect(() => {
    if (!activeWorkspaceId) {
      return;
    }

    syncWorkspacePlannerSnapshot(
      activeWorkspaceId,
      buildLivePlanningSnapshot(tasks, locale),
    );
  }, [activeWorkspaceId, locale, tasks]);

  useEffect(() => {
    setLane(locale === "zh-CN" ? "深度工作" : "deep work");
  }, [locale]);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }),
    [locale],
  );

  function handleAddTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeWorkspaceId || !title.trim()) {
      return;
    }

    const startValue = new Date(startsAt).getTime();
    const endValue = startValue + Number(durationMinutes || "0") * 60_000;

    addPlannerTask({
      id: `${activeWorkspaceId}-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      title: title.trim(),
      kind,
      status: "planned",
      startsAt: startValue,
      endsAt: endValue,
      lane,
    });

    setTitle("");
  }

  const summaryText =
    conflicts.length > 0
      ? locale === "zh-CN"
        ? `现在有 ${conflicts.length} 个时间冲突需要先处理。`
        : `There are ${conflicts.length} timing conflicts to resolve first.`
      : locale === "zh-CN"
        ? "当前排程干净，可以继续往里填执行块。"
        : "The schedule is clean and ready for more execution blocks.";

  return (
    <PanelShell title={locale === "zh-CN" ? "Emergency Planner" : "Emergency Planner"}>
      {workspace && activeWorkspaceId ? (
        <div style={{ display: "grid", gap: "16px", fontSize: "13px" }}>
          <div className="chariot-detail-header">
            <div>
              <div className="chariot-microcopy">
                {locale === "zh-CN" ? "Scheduling Desk" : "Scheduling Desk"}
              </div>
              <div className="chariot-detail-title">
                {locale === "zh-CN" ? "项目排程台" : "Project Scheduler"}
              </div>
            </div>
            <div className="chariot-status-row">
              <span className="chariot-chip">
                {locale === "zh-CN" ? `${tasks.length} 个时间块` : `${tasks.length} blocks`}
              </span>
              <span className="chariot-chip">
                {locale === "zh-CN"
                  ? `${conflicts.length} 个冲突`
                  : `${conflicts.length} conflicts`}
              </span>
            </div>
          </div>

          <div className="chariot-soft-block">
            <div className="chariot-soft-copy">{summaryText}</div>
          </div>

          <form onSubmit={handleAddTask} className="chariot-form-grid">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={locale === "zh-CN" ? "新增一个排程块…" : "Add a schedule block..."}
              className="chariot-input"
            />
            <div className="chariot-quiet-grid">
              <select
                value={kind}
                onChange={(event) =>
                  setKind(
                    event.target.value as "task" | "meeting" | "automation" | "review",
                  )
                }
                className="chariot-input"
              >
                <option value="task">{locale === "zh-CN" ? "任务" : "Task"}</option>
                <option value="meeting">{locale === "zh-CN" ? "会议" : "Meeting"}</option>
                <option value="automation">
                  {locale === "zh-CN" ? "自动化" : "Automation"}
                </option>
                <option value="review">{locale === "zh-CN" ? "复盘" : "Review"}</option>
              </select>
              <input
                value={lane}
                onChange={(event) => setLane(event.target.value)}
                placeholder={locale === "zh-CN" ? "执行泳道" : "Execution lane"}
                className="chariot-input"
              />
            </div>
            <div className="chariot-quiet-grid">
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(event) => setStartsAt(event.target.value)}
                className="chariot-input"
              />
              <input
                type="number"
                min="15"
                step="15"
                value={durationMinutes}
                onChange={(event) => setDurationMinutes(event.target.value)}
                className="chariot-input"
              />
            </div>
            <div className="chariot-action-row">
              <button type="submit" className="chariot-primary-button">
                {locale === "zh-CN" ? "加入排程" : "Add to Schedule"}
              </button>
            </div>
          </form>

          <div className="chariot-quiet-grid">
            <div className="chariot-soft-block">
              <div className="chariot-microcopy">
                {locale === "zh-CN" ? "时间轴" : "Timeline"}
              </div>
              {orderedTasks.length > 0 ? (
                <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
                  {orderedTasks.map((task) => (
                    <div key={task.id} className="chariot-history-item">
                      <div className="chariot-history-question">{task.title}</div>
                      <div className="chariot-soft-copy">
                        {formatter.format(task.startsAt)} - {formatter.format(task.endsAt)}
                      </div>
                      <div className="chariot-status-row" style={{ marginTop: "8px" }}>
                        <span className="chariot-chip">{task.kind}</span>
                        <span className="chariot-chip">{task.lane}</span>
                        <button
                          type="button"
                          className="chariot-secondary-button"
                          onClick={() =>
                            updatePlannerTaskStatus(
                              activeWorkspaceId,
                              task.id,
                              task.status === "done" ? "active" : "done",
                            )
                          }
                        >
                          {task.status === "done"
                            ? locale === "zh-CN"
                              ? "标记为进行中"
                              : "Mark active"
                            : locale === "zh-CN"
                              ? "标记完成"
                              : "Mark done"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="chariot-soft-copy">
                  {locale === "zh-CN"
                    ? "这里会显示当前项目的时间块。"
                    : "Current schedule blocks will appear here."}
                </div>
              )}
            </div>

            <div className="chariot-soft-block">
              <div className="chariot-microcopy">
                {locale === "zh-CN" ? "冲突检测" : "Conflict Detection"}
              </div>
              {conflicts.length > 0 ? (
                <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
                  {conflicts.map((conflict) => (
                    <div key={conflict.id} className="chariot-history-item">
                      <div className="chariot-history-question">{conflict.type}</div>
                      <div className="chariot-soft-copy">{conflict.message}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="chariot-soft-copy">
                  {locale === "zh-CN"
                    ? "当前没有时间重叠。"
                    : "No timing overlaps right now."}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ color: "var(--text-muted)" }}>
          {locale === "zh-CN"
            ? "选择项目后可查看排程台。"
            : "Select a project to open the scheduler."}
        </div>
      )}
    </PanelShell>
  );
}
