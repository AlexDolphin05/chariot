import type {
  ChariotAutomationArtifact,
  ChariotAutomationRun,
  ChariotLocale,
} from "@chariot/types";

export type UserkillerAutomationTemplate = {
  id: string;
  name: string;
  description: string;
  outputLabel: string;
};

export function getAutomationTemplates(
  locale: ChariotLocale = "en",
): UserkillerAutomationTemplate[] {
  if (locale === "zh-CN") {
    return [
      {
        id: "follow-up-draft",
        name: "跟进邮件",
        description: "把 brief 转成一封可直接编辑的对外跟进邮件。",
        outputLabel: "邮件草稿",
      },
      {
        id: "ops-summary",
        name: "运营摘要",
        description: "把零散事项整理成一页项目摘要与行动清单。",
        outputLabel: "摘要文档",
      },
      {
        id: "meeting-pack",
        name: "会议包",
        description: "生成会议议程、负责人和会后动作项。",
        outputLabel: "会议清单",
      },
    ];
  }

  return [
    {
      id: "follow-up-draft",
      name: "Follow-up Draft",
      description: "Turn a brief into an editable outbound follow-up email.",
      outputLabel: "Email Draft",
    },
    {
      id: "ops-summary",
      name: "Ops Summary",
      description: "Turn scattered notes into a one-page project summary and action list.",
      outputLabel: "Summary Doc",
    },
    {
      id: "meeting-pack",
      name: "Meeting Pack",
      description: "Generate an agenda, owners, and follow-up action items.",
      outputLabel: "Meeting Checklist",
    },
  ];
}

function buildArtifacts(
  templateId: string,
  brief: string,
  locale: ChariotLocale,
): ChariotAutomationArtifact[] {
  const summaryLead =
    locale === "zh-CN"
      ? "来自 Userkiller 自动办公台的可编辑产物。"
      : "Editable artifact generated from the Userkiller automation desk.";

  switch (templateId) {
    case "follow-up-draft":
      return [
        {
          id: `${templateId}-email`,
          name: locale === "zh-CN" ? "follow-up.md" : "follow-up.md",
          type: "email",
          summary: summaryLead,
          content:
            locale === "zh-CN"
              ? `主题：关于 ${brief || "当前项目"} 的跟进\n\n你好，\n\n我整理了当前进展，建议下一步聚焦以下三点：\n1. 明确本周交付边界。\n2. 对齐风险与依赖。\n3. 决定是否需要自动化支援。\n\n如果你方便，我们可以在今天晚些时候确认执行顺序。\n\nAlex`
              : `Subject: Follow-up on ${brief || "the current project"}\n\nHi,\n\nI pulled together the latest progress and suggest we focus on three things next:\n1. Lock the delivery boundary for this week.\n2. Align on risks and dependencies.\n3. Decide what should move into automation.\n\nIf it works for you, we can confirm execution order later today.\n\nAlex`,
        },
      ];
    case "meeting-pack":
      return [
        {
          id: `${templateId}-agenda`,
          name: locale === "zh-CN" ? "meeting-pack.md" : "meeting-pack.md",
          type: "checklist",
          summary: summaryLead,
          content:
            locale === "zh-CN"
              ? `会议主题：${brief || "项目推进"}\n\n议程：\n- 当前状态\n- 关键阻塞\n- 责任分配\n\n动作项：\n- Alex：整理核心能力抽取顺序\n- Tia：确认视觉壳交界\n- 系统：补齐自动化桥接验证`
              : `Meeting topic: ${brief || "Project progress"}\n\nAgenda:\n- Current status\n- Key blockers\n- Ownership alignment\n\nAction items:\n- Alex: confirm capability extraction order\n- Tia: confirm shell/visual boundary\n- System: validate automation bridge`,
        },
      ];
    default:
      return [
        {
          id: `${templateId}-summary`,
          name: locale === "zh-CN" ? "ops-summary.md" : "ops-summary.md",
          type: "document",
          summary: summaryLead,
          content:
            locale === "zh-CN"
              ? `项目摘要\n\n主题：${brief || "当前工作流"}\n\n现状：\n- 上下文已形成\n- 排程需要继续收敛\n- 自动办公可以承担重复整理工作\n\n下一步：\n- 确认优先级\n- 固化时间块\n- 生成对外材料`
              : `Project Summary\n\nTheme: ${brief || "Current workflow"}\n\nStatus:\n- Context is in place\n- Scheduling still needs convergence\n- Automation can absorb repetitive organization work\n\nNext:\n- Confirm priority\n- Lock time blocks\n- Generate outbound materials`,
        },
      ];
  }
}

export async function runAutomationTemplate(
  workspaceId: string,
  templateId: string,
  brief: string,
  locale: ChariotLocale = "en",
): Promise<ChariotAutomationRun> {
  const template =
    getAutomationTemplates(locale).find((candidate) => candidate.id === templateId) ??
    getAutomationTemplates(locale)[0];

  return {
    id: `run-${workspaceId}-${Date.now()}`,
    workspaceId,
    templateId: template.id,
    templateName: template.name,
    brief,
    status: "completed",
    createdAt: Date.now(),
    artifacts: buildArtifacts(template.id, brief, locale),
  };
}
