/**
 * 轻量类型安全 EventBus。
 * 跨 package 通信（board → workbench、planner → 全局提示）一律走这里，
 * 不要让 package 之间互相直接调用 UI 层函数。
 */
import type { ChariotEvent, ChariotEventType } from "@chariot/types";

type EventOf<T extends ChariotEventType> = Extract<ChariotEvent, { type: T }>;
type Handler<T extends ChariotEventType> = (event: EventOf<T>) => void;

/**
 * 内部统一按宽类型存储；subscribe 的泛型签名保证了
 * 只有匹配 type 的事件会派发给对应 handler，所以这里的收窄是安全的。
 */
type AnyHandler = (event: ChariotEvent) => void;

const handlers = new Map<ChariotEventType, Set<AnyHandler>>();

export const eventBus = {
  publish(event: ChariotEvent): void {
    handlers.get(event.type)?.forEach((handler) => {
      handler(event);
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
    const wrapped = handler as unknown as AnyHandler;
    set.add(wrapped);
    return () => {
      set.delete(wrapped);
    };
  },
};
