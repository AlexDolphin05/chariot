import type { ChariotModuleManifest } from "@chariot/types";

const registry = new Map<string, ChariotModuleManifest>();

export function registerModule(manifest: ChariotModuleManifest): void {
  registry.set(manifest.id, manifest);
}

export function registerModules(manifests: ChariotModuleManifest[]): void {
  manifests.forEach((manifest) => {
    registerModule(manifest);
  });
}

export function getModule(id: string): ChariotModuleManifest | undefined {
  return registry.get(id);
}

export function getAllModules(): ChariotModuleManifest[] {
  return Array.from(registry.values());
}

export function getWorkbenchModules(): ChariotModuleManifest[] {
  return getAllModules().filter((manifest) =>
    manifest.supports.includes("workbench"),
  );
}
