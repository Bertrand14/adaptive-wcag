import type { AdaptiveWCAGEvent, AdaptiveWCAGEventPayload } from './types';

type Handler<E extends AdaptiveWCAGEvent> = (payload: AdaptiveWCAGEventPayload[E]) => void;

export class EventBus {
  private listeners = new Map<AdaptiveWCAGEvent, Set<Handler<any>>>();

  on<E extends AdaptiveWCAGEvent>(event: E, handler: Handler<E>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(handler);
    return () => this.off(event, handler);
  }

  off<E extends AdaptiveWCAGEvent>(event: E, handler: Handler<E>): void {
    this.listeners.get(event)?.delete(handler);
  }

  emit<E extends AdaptiveWCAGEvent>(event: E, payload: AdaptiveWCAGEventPayload[E]): void {
    this.listeners.get(event)?.forEach((handler) => handler(payload));
  }
}
