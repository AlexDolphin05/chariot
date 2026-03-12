/**
 * @chariot/kernel — 轻量 publish/subscribe 事件总线
 */
import type { ChariotEvent } from "@chariot/types";

type Listener<T extends ChariotEvent = ChariotEvent> = (event: T) => void;

const listeners = new Set<Listener>();

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publish<E extends ChariotEvent>(event: E): void {
  listeners.forEach((fn) => fn(event));
}
