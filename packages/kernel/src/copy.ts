import type {
  ChariotLocale,
  ChariotProjectStatus,
  ChariotWorkbenchModuleId,
} from "@chariot/types";
import { useKernelStore } from "./store";

type CopyKey =
  | "shell.microcopy"
  | "shell.title"
  | "shell.projects"
  | "shell.modules"
  | "shell.active"
  | "shell.noActiveWorkspace"
  | "shell.language"
  | "shell.zh"
  | "shell.en"
  | "board.microcopy"
  | "board.title"
  | "board.activeTarget"
  | "board.selectProject"
  | "board.rightWorkbenchHint"
  | "globalHermit.title"
  | "globalHermit.subtitle"
  | "globalHermit.scopeCount"
  | "globalHermit.placeholder"
  | "globalHermit.ask"
  | "globalHermit.sniffing"
  | "globalHermit.defaultAnswer"
  | "planner.overlayTitle"
  | "planner.conflicts"
  | "planner.impactedProjects"
  | "planner.none"
  | "planner.panelTitle"
  | "planner.scope"
  | "planner.activeConflicts"
  | "planner.updatedAt"
  | "planner.refresh"
  | "planner.refreshing"
  | "planner.conflictType"
  | "planner.noConflicts"
  | "planner.suggestions"
  | "planner.select"
  | "workbench.microcopy"
  | "workbench.selectProject"
  | "workbench.description"
  | "workbench.activeModule"
  | "hermit.panelTitle"
  | "hermit.context"
  | "hermit.entities"
  | "hermit.risks"
  | "hermit.output"
  | "hermit.select"
  | "hermit.defaultAnswer"
  | "hermit.emptyRisk"
  | "hermit.inputLabel"
  | "hermit.inputPlaceholder"
  | "hermit.ask"
  | "hermit.asking"
  | "hermit.history"
  | "hermit.noHistory"
  | "projectMap.panelTitle"
  | "projectMap.placeholder"
  | "projectMap.fallback"
  | "projectMap.sniffPending"
  | "projectMap.plannerPending"
  | "projectMap.currentSignal"
  | "projectMap.clean"
  | "planetDock.title"
  | "moduleHost.title"
  | "moduleHost.hermitFocus"
  | "moduleHost.plannerFocus"
  | "moduleHost.userkillerTitle"
  | "moduleHost.userkillerFallback"
  | "moduleHost.bridgeStatus"
  | "moduleHost.templateCount"
  | "moduleHost.workspacePath"
  | "moduleHost.outputPath"
  | "moduleHost.artifacts"
  | "moduleHost.bridgeNotes"
  | "moduleHost.reload"
  | "moduleHost.loading"
  | "moduleHost.noArtifacts"
  | "common.module";

type CopyParams = Record<string, string | number>;

const copy: Record<ChariotLocale, Record<CopyKey, string>> = {
  "zh-CN": {
    "shell.microcopy": "Chariot / 统一壳层",
    "shell.title": "Board + Workbench",
    "shell.projects": "{count} 个源项目",
    "shell.modules": "{count} 个已注册模块",
    "shell.active": "当前：{name}",
    "shell.noActiveWorkspace": "未激活工作区",
    "shell.language": "语言",
    "shell.zh": "中文",
    "shell.en": "English",
    "board.microcopy": "Board / 画布",
    "board.title": "跨项目场域视图",
    "board.activeTarget": "当前工作区目标",
    "board.selectProject": "选择一个项目卡片",
    "board.rightWorkbenchHint": "点击任意项目卡后，右侧 Workbench 会同步切换到对应项目上下文。",
    "globalHermit.title": "全局 Hermit",
    "globalHermit.subtitle": "面向全部项目的 board-scope 嗅探入口",
    "globalHermit.scopeCount": "作用域内 {count} 个项目",
    "globalHermit.placeholder": "询问集成风险、契约漂移或跨项目排序建议……",
    "globalHermit.ask": "提问",
    "globalHermit.sniffing": "嗅探中…",
    "globalHermit.defaultAnswer": "Board 作用域已就绪。你可以跨 HERMIT、Emergency Planner 和 Userkiller 提问。",
    "planner.overlayTitle": "全局 Planner 浮层",
    "planner.conflicts": "{count} 个冲突",
    "planner.impactedProjects": "{count} 个受影响项目",
    "planner.none": "当前没有检测到跨项目冲突。",
    "planner.panelTitle": "Planner 面板",
    "planner.scope": "{scope} 作用域",
    "planner.activeConflicts": "{count} 个活动冲突",
    "planner.updatedAt": "最近刷新：{value}",
    "planner.refresh": "刷新快照",
    "planner.refreshing": "刷新中…",
    "planner.conflictType": "类型：{value}",
    "planner.noConflicts": "当前没有冲突。",
    "planner.suggestions": "建议",
    "planner.select": "选择项目后可查看该项目的 Planner 快照。",
    "workbench.microcopy": "Workbench / 工作区",
    "workbench.selectProject": "选择一个 Board 项目",
    "workbench.description": "右侧是稳定的项目工作区。点击左侧项目卡后，会绑定当前项目上下文、Planner 快照和模块入口。",
    "workbench.activeModule": "当前模块：{name}",
    "hermit.panelTitle": "Hermit 面板",
    "hermit.context": "项目作用域上下文",
    "hermit.entities": "实体",
    "hermit.risks": "风险",
    "hermit.output": "Mock Runner 输出",
    "hermit.select": "选择项目后可查看工作区 Hermit 上下文。",
    "hermit.defaultAnswer": "项目作用域 Hermit 会在这里总结当前工作区。",
    "hermit.emptyRisk": "当前没有登记项目风险。",
    "hermit.inputLabel": "项目级提问",
    "hermit.inputPlaceholder": "询问当前项目该先抽什么、哪里有风险、下一步做什么……",
    "hermit.ask": "发送",
    "hermit.asking": "思考中…",
    "hermit.history": "最近问答",
    "hermit.noHistory": "这里会显示当前工作区最近的 Hermit 问答。",
    "projectMap.panelTitle": "项目地图面板",
    "projectMap.placeholder": "选择项目卡后即可填充项目地图。",
    "projectMap.fallback": "这里已经为未来的图结构、依赖关系与视觉系统预留好了占位。",
    "projectMap.sniffPending": "等待嗅探建议。",
    "projectMap.plannerPending": "等待 Planner 建议。",
    "projectMap.currentSignal": "当前 Planner 信号",
    "projectMap.clean": "当前工作区还没有 Planner 冲突。",
    "planetDock.title": "Planet Dock",
    "moduleHost.title": "模块宿主",
    "moduleHost.hermitFocus": "继续保持 board-scope 和 project-scope 的上下文构建分离。HERMIT 的优先抽取目标仍然是 contextAssembler、deepSniff 和 profileBuilder。",
    "moduleHost.plannerFocus": "先抽纯语义：planningWindow、autoBlocks、scheduler。第一阶段不要把 planner 页面整块搬进来。",
    "moduleHost.userkillerTitle": "Userkiller 桥接",
    "moduleHost.userkillerFallback": "这里只保留 adapter 占位。真实执行仍然在旧 Python 栈里。",
    "moduleHost.bridgeStatus": "桥接状态",
    "moduleHost.templateCount": "{count} 个模板",
    "moduleHost.workspacePath": "工作区路径",
    "moduleHost.outputPath": "输出路径",
    "moduleHost.artifacts": "桥接产物",
    "moduleHost.bridgeNotes": "遗留桥接说明",
    "moduleHost.reload": "重新加载桥接",
    "moduleHost.loading": "桥接中…",
    "moduleHost.noArtifacts": "当前没有可显示的桥接产物。",
    "common.module": "模块 {name}",
  },
  en: {
    "shell.microcopy": "Chariot / Unified Shell",
    "shell.title": "Board + Workbench",
    "shell.projects": "{count} source projects",
    "shell.modules": "{count} registered modules",
    "shell.active": "Active: {name}",
    "shell.noActiveWorkspace": "No active workspace",
    "shell.language": "Language",
    "shell.zh": "中文",
    "shell.en": "English",
    "board.microcopy": "Board / Canvas",
    "board.title": "Cross-project field view",
    "board.activeTarget": "Active Workspace Target",
    "board.selectProject": "Select a project card",
    "board.rightWorkbenchHint": "The right-side workbench will update as soon as a board card is selected.",
    "globalHermit.title": "Global Hermit",
    "globalHermit.subtitle": "Board-scope sniffing across all linked projects",
    "globalHermit.scopeCount": "{count} projects in scope",
    "globalHermit.placeholder": "Ask about integration risks, contract drift, or cross-project sequencing...",
    "globalHermit.ask": "Ask",
    "globalHermit.sniffing": "Sniffing...",
    "globalHermit.defaultAnswer": "Board scope is live. Ask across HERMIT, Emergency Planner, and Userkiller.",
    "planner.overlayTitle": "Global Planner Overlay",
    "planner.conflicts": "{count} conflicts",
    "planner.impactedProjects": "{count} impacted projects",
    "planner.none": "No cross-project conflicts detected.",
    "planner.panelTitle": "Planner Panel",
    "planner.scope": "{scope} scope",
    "planner.activeConflicts": "{count} active conflicts",
    "planner.updatedAt": "Last refreshed: {value}",
    "planner.refresh": "Refresh Snapshot",
    "planner.refreshing": "Refreshing...",
    "planner.conflictType": "Type: {value}",
    "planner.noConflicts": "No conflicts right now.",
    "planner.suggestions": "Suggestions",
    "planner.select": "Select a project to see planner snapshot data.",
    "workbench.microcopy": "Workbench / Workspace",
    "workbench.selectProject": "Select a board card",
    "workbench.description": "The right pane is the stable project workbench. Click a board card to bind project context, planner snapshot, and module host.",
    "workbench.activeModule": "Active module: {name}",
    "hermit.panelTitle": "Hermit Panel",
    "hermit.context": "Project Scope Context",
    "hermit.entities": "Entities",
    "hermit.risks": "Risks",
    "hermit.output": "Mock Runner Output",
    "hermit.select": "Select a project to see workspace Hermit context.",
    "hermit.defaultAnswer": "Project-scope Hermit will summarize the active workspace here.",
    "hermit.emptyRisk": "No project risk is registered yet.",
    "hermit.inputLabel": "Project Question",
    "hermit.inputPlaceholder": "Ask what to extract first, where the risk is, or what should happen next...",
    "hermit.ask": "Send",
    "hermit.asking": "Thinking...",
    "hermit.history": "Recent Exchanges",
    "hermit.noHistory": "Recent Hermit exchanges for this workspace will appear here.",
    "projectMap.panelTitle": "Project Map Panel",
    "projectMap.placeholder": "Select a project card to populate the project map.",
    "projectMap.fallback": "Map placeholder is ready for future graph and dependency visuals.",
    "projectMap.sniffPending": "Sniff suggestion pending.",
    "projectMap.plannerPending": "Planner suggestion pending.",
    "projectMap.currentSignal": "Current Planner Signal",
    "projectMap.clean": "Planner snapshot is clean for this workspace.",
    "planetDock.title": "Planet Dock",
    "moduleHost.title": "Module Host",
    "moduleHost.hermitFocus": "Keep board-scope and project-scope context builders independent. The main extraction targets remain contextAssembler, deepSniff, and profileBuilder.",
    "moduleHost.plannerFocus": "Pull pure scheduling semantics first: planningWindow, autoBlocks, scheduler. Keep planner pages out of the first pass.",
    "moduleHost.userkillerTitle": "Userkiller Bridge",
    "moduleHost.userkillerFallback": "Adapter-only placeholder. Real workflow execution remains in the legacy Python stack.",
    "moduleHost.bridgeStatus": "Bridge Status",
    "moduleHost.templateCount": "{count} templates",
    "moduleHost.workspacePath": "Workspace Path",
    "moduleHost.outputPath": "Output Path",
    "moduleHost.artifacts": "Bridge Artifacts",
    "moduleHost.bridgeNotes": "Legacy Bridge Notes",
    "moduleHost.reload": "Reload Bridge",
    "moduleHost.loading": "Loading bridge...",
    "moduleHost.noArtifacts": "No bridge artifacts to show yet.",
    "common.module": "Module {name}",
  },
};

function format(template: string, params?: CopyParams): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

export function translate(
  locale: ChariotLocale,
  key: CopyKey,
  params?: CopyParams,
): string {
  return format(copy[locale][key], params);
}

export function useChariotI18n() {
  const locale = useKernelStore((state) => state.locale);
  const setLocale = useKernelStore((state) => state.setLocale);

  return {
    locale,
    setLocale,
    t: (key: CopyKey, params?: CopyParams) => translate(locale, key, params),
  };
}

export function getStatusLabel(
  status: ChariotProjectStatus,
  locale: ChariotLocale,
): string {
  const labels: Record<ChariotLocale, Record<ChariotProjectStatus, string>> = {
    "zh-CN": {
      idle: "空闲",
      active: "进行中",
      blocked: "阻塞",
      done: "完成",
    },
    en: {
      idle: "idle",
      active: "active",
      blocked: "blocked",
      done: "done",
    },
  };

  return labels[locale][status];
}

export function getModuleLabel(
  moduleId: ChariotWorkbenchModuleId,
  locale: ChariotLocale,
): string {
  const labels: Record<ChariotLocale, Record<ChariotWorkbenchModuleId, string>> = {
    "zh-CN": {
      hermit: "Hermit",
      planner: "Planner",
      userkiller: "Userkiller",
    },
    en: {
      hermit: "Hermit",
      planner: "Planner",
      userkiller: "Userkiller",
    },
  };

  return labels[locale][moduleId];
}
