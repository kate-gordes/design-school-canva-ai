import { useSyncExternalStore } from 'react';

type Listener = () => void;

let version = 0;
const globalListeners = new Set<Listener>();

function notifyGlobalListeners() {
  version += 1;
  globalListeners.forEach(listener => listener());
}

function subscribeGlobal(listener: Listener) {
  globalListeners.add(listener);
  return () => {
    globalListeners.delete(listener);
  };
}

function getVersion() {
  return version;
}

export interface ReadonlySignal<T> {
  readonly value: T;
}

export interface Signal<T> extends ReadonlySignal<T> {
  value: T;
}

class SignalImpl<T> implements Signal<T> {
  private currentValue: T;

  constructor(initialValue: T) {
    this.currentValue = initialValue;
  }

  get value(): T {
    return this.currentValue;
  }

  set value(nextValue: T) {
    if (Object.is(this.currentValue, nextValue)) {
      return;
    }
    this.currentValue = nextValue;
    notifyGlobalListeners();
  }
}

class ComputedSignalImpl<T> implements ReadonlySignal<T> {
  private readonly getter: () => T;

  constructor(getter: () => T) {
    this.getter = getter;
  }

  get value(): T {
    return this.getter();
  }
}

export function signal<T>(initialValue: T): Signal<T> {
  return new SignalImpl(initialValue);
}

export function computed<T>(getter: () => T): ReadonlySignal<T> {
  return new ComputedSignalImpl(getter);
}

export function batch<T>(fn: () => T): T {
  return fn();
}

export function effect(fn: () => void): () => void {
  fn();
  return () => {};
}

export function useSignals(): void {
  useSyncExternalStore(subscribeGlobal, getVersion, getVersion);
}
