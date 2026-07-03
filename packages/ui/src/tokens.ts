/**
 * 基础 tokens — 第一阶段只定义语义常量，视觉细节留给 Tia。
 * Tailwind 类名散落在组件里没问题，但状态色等语义映射统一从这里取。
 */
import type { ChariotProjectStatus } from "@chariot/types";

export const statusColor: Record<ChariotProjectStatus, string> = {
  idle: "bg-slate-400",
  active: "bg-emerald-500",
  blocked: "bg-rose-500",
  done: "bg-sky-500",
};

export const statusLabel: Record<ChariotProjectStatus, string> = {
  idle: "待启动",
  active: "进行中",
  blocked: "被阻塞",
  done: "已完成",
};
