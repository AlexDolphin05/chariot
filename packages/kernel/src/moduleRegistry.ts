/**
 * @chariot/kernel — 模块注册表
 * 可注册内建模块：hermit, planner, userkiller
 */
import type { ChariotModuleManifest } from "@chariot/types";

const registry = new Map<string, ChariotModuleManifest>();

export function registerModule(manifest: ChariotModuleManifest): void {
  registry.set(manifest.id, manifest);
}

export function getModule(id: string): ChariotModuleManifest | undefined {
  return registry.get(id);
}

export function getAllModules(): ChariotModuleManifest[] {
  return Array.from(registry.values());
}
