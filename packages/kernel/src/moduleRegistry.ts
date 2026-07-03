/**
 * Module Registry — 内建模块（hermit / planner / userkiller）在启动时注册。
 * 未来第三方模块也走同一个注册入口。
 */
import type { ChariotModuleManifest } from "@chariot/types";

const registry = new Map<string, ChariotModuleManifest>();

export function registerModule(manifest: ChariotModuleManifest): void {
  if (registry.has(manifest.id)) {
    // 重复注册直接覆盖（开发热更新时会发生），不抛错。
    registry.delete(manifest.id);
  }
  registry.set(manifest.id, manifest);
}

export function getModule(id: string): ChariotModuleManifest | null {
  return registry.get(id) ?? null;
}

export function listModules(): ChariotModuleManifest[] {
  return [...registry.values()];
}

export function listWorkbenchModules(): ChariotModuleManifest[] {
  return listModules().filter((m) => m.supports.includes("workbench"));
}
