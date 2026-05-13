/**
 * Utility for iOS keyboard activation via proxy input.
 */

let proxyInputRef: HTMLInputElement | null = null;

export function setProxyInputRef(el: HTMLInputElement | null): void {
  proxyInputRef = el;
}

export function focusMobileAIInput(): void {
  proxyInputRef?.focus();
}
