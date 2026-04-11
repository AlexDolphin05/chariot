import type { ChariotEvent } from "@chariot/types";

type Listener<T extends ChariotEvent = ChariotEvent> = (event: T) => void;

type EventType = ChariotEvent["type"];

const listeners = new Set<Listener>();
const typedListeners = new Map<EventType, Set<(event: ChariotEvent) => void>>();

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function subscribeTo<TType extends EventType>(
  type: TType,
  listener: Listener<Extract<ChariotEvent, { type: TType }>>,
): () => void {
  const bucket =
    typedListeners.get(type) ?? new Set<(event: ChariotEvent) => void>();
  typedListeners.set(type, bucket);

  bucket.add(listener as (event: ChariotEvent) => void);

  return () => {
    bucket.delete(listener as (event: ChariotEvent) => void);
  };
}

export function publish<E extends ChariotEvent>(event: E): void {
  listeners.forEach((fn) => fn(event));
  typedListeners.get(event.type)?.forEach((fn) => fn(event));
}
