import type {
  ChariotLocale,
  ChariotPlannerConflict,
  ChariotPlannerTask,
  PlannerSnapshot,
} from "@chariot/types";

function formatTimeRange(
  startsAt: number,
  endsAt: number,
  locale: ChariotLocale,
): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });

  return `${formatter.format(startsAt)} - ${formatter.format(endsAt)}`;
}

export function sortPlannerTasks(tasks: ChariotPlannerTask[]): ChariotPlannerTask[] {
  return [...tasks].sort((left, right) => left.startsAt - right.startsAt);
}

export function detectTaskConflicts(
  tasks: ChariotPlannerTask[],
  locale: ChariotLocale = "en",
): ChariotPlannerConflict[] {
  const sortedTasks = sortPlannerTasks(tasks);
  const conflicts: ChariotPlannerConflict[] = [];

  for (let index = 0; index < sortedTasks.length - 1; index += 1) {
    const current = sortedTasks[index];
    const next = sortedTasks[index + 1];

    if (current.endsAt <= next.startsAt) {
      continue;
    }

    conflicts.push({
      id: `${current.id}-${next.id}`,
      type: "time-overlap",
      message:
        locale === "zh-CN"
          ? `${current.title} 与 ${next.title} 在 ${formatTimeRange(
              next.startsAt,
              current.endsAt,
              locale,
            )} 发生重叠。`
          : `${current.title} overlaps with ${next.title} across ${formatTimeRange(
              next.startsAt,
              current.endsAt,
              locale,
            )}.`,
      relatedProjectIds: [],
    });
  }

  return conflicts;
}

export function suggestPlannerActions(
  tasks: ChariotPlannerTask[],
  conflicts: ChariotPlannerConflict[],
  locale: ChariotLocale = "en",
): string[] {
  if (conflicts.length > 0) {
    return locale === "zh-CN"
      ? [
          "先把重叠事项拆开，再决定哪些任务应该交给自动化或晚一点处理。",
          "优先保护深度工作块，把会议和复盘压到边缘时段。",
        ]
      : [
          "Resolve overlaps first, then decide which blocks should move to automation or later windows.",
          "Protect deep-work blocks first and push meetings or reviews to the edges.",
        ];
  }

  const sortedTasks = sortPlannerTasks(tasks);
  const nextTask = sortedTasks.find((task) => task.status !== "done") ?? null;

  if (!nextTask) {
    return locale === "zh-CN"
      ? ["当前排程很干净，可以为这个项目补一个下一步执行块。"]
      : ["The schedule is clean. Add one concrete next block for this workspace."];
  }

  return locale === "zh-CN"
    ? [
        `下一个执行块是 ${nextTask.title}，建议先保护 ${nextTask.lane} 的连续时间。`,
      ]
    : [
        `The next execution block is ${nextTask.title}; protect a continuous ${nextTask.lane} lane for it.`,
      ];
}

export function buildLivePlanningSnapshot(
  tasks: ChariotPlannerTask[],
  locale: ChariotLocale = "en",
): PlannerSnapshot {
  const conflicts = detectTaskConflicts(tasks, locale);

  return {
    scope: "project",
    conflicts,
    suggestions: suggestPlannerActions(tasks, conflicts, locale),
    updatedAt: Date.now(),
  };
}
