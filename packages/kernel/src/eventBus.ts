/**
 * 轻量类型安全 EventBus。
 * 跨 package 通信（board → workbench、planner → 全局提示）一律走这里，
 * 不要让 package 之间互相直接调用 UI 层函数。
 */
import type { ChariotEvent, ChariotEventType } from "@chariot/types";

type EventOf<T extends ChariotEventType> = Extract<ChariotEvent, { type: T }>;
type Handler<T extends ChariotEventType> = (event: EventOf<T>) => void;

const handlers = new Map<ChariotEventType, Set<Handler<ChariotEventType>>>();

export const eventBus = {
  publish(event: ChariotEvent): void {
    handlers.get(event.type)?.forEach((handler) => {
      handler(event as EventOf<ChariotEventType>);
    });
  },

  /** 返回取消订阅函数。 */
  subscribe<T extends ChariotEventType>(
    type: T,
    handler: Handler<T>,
  ): () => void {
    if (!handlers.has(type)) {
      handlers.set(type, new Set());
    }
    const set = handlers.get(type)!;
    set.add(handler as Handler<ChariotEventType>);
    return () => {
      set.delete(handler as Handler<ChariotEventType>);
    };
  },
};
