import { useSyncExternalStore } from 'react';
import { site, store, zapiski } from '@/content';
import type { Localized, Product, ProductVariant } from '@/content';

export interface ZapiskaName {
  prefix: string;
  name: string;
}

export interface ZapiskaSlip {
  id: string;
  type: 'health' | 'repose';
  names: ZapiskaName[];
  commemoration: string;
  /** candle id, or "" for none */
  candle: string;
  /** optional free-amount donation */
  extra: number;
}

export type CartLine =
  | { key: string; kind: 'product'; productId: string; variantId: string; qty: number }
  | { key: string; kind: 'zapiska'; slip: ZapiskaSlip };

const KEY = `${site.id}-cart`;
const listeners = new Set<() => void>();
let lines: CartLine[] = read();

function read(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isValid) : [];
  } catch {
    return [];
  }
}

function isValid(line: CartLine): boolean {
  if (line.kind === 'product') return !!findProduct(line.productId);
  return line.kind === 'zapiska' && !!line.slip;
}

function write(next: CartLine[]) {
  lines = next;
  window.localStorage.setItem(KEY, JSON.stringify(lines));
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      lines = read();
      fn();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener('storage', onStorage);
  };
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, () => lines, () => lines);
}

export function findProduct(id: string): Product | undefined {
  return store.products.find((p) => p.id === id);
}

export function findVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((v) => v.id === variantId);
}

export function unitPrice(product: Product, variantId: string): number {
  return findVariant(product, variantId)?.price ?? product.price;
}

export function stockOf(product: Product, variantId: string): number {
  return product.variants.length ? (findVariant(product, variantId)?.stock ?? 0) : product.stock;
}

export function totalStock(product: Product): number {
  return product.variants.length ? product.variants.reduce((n, v) => n + v.stock, 0) : product.stock;
}

export function lowestPrice(product: Product): number {
  return product.variants.length ? Math.min(...product.variants.map((v) => v.price ?? product.price)) : product.price;
}

export function slipTotal(slip: ZapiskaSlip): number {
  const commemoration = zapiski.commemorations.find((c) => c.id === slip.commemoration)?.suggested ?? 0;
  const candle = zapiski.candles.find((c) => c.id === slip.candle)?.price ?? 0;
  return commemoration + candle + (slip.extra > 0 ? slip.extra : 0);
}

export function lineTotal(line: CartLine): number {
  if (line.kind === 'zapiska') return slipTotal(line.slip);
  const product = findProduct(line.productId);
  return product ? unitPrice(product, line.variantId) * line.qty : 0;
}

export function cartCount(list: CartLine[]): number {
  return list.reduce((n, l) => n + (l.kind === 'product' ? l.qty : 1), 0);
}

export function addProduct(productId: string, variantId: string, qty: number) {
  const product = findProduct(productId);
  if (!product) return;
  const max = stockOf(product, variantId);
  const key = `p:${productId}:${variantId}`;
  const existing = lines.find((l) => l.key === key);
  if (existing && existing.kind === 'product') {
    write(lines.map((l) => (l.key === key ? { ...existing, qty: Math.min(max, existing.qty + qty) } : l)));
  } else {
    write([...lines, { key, kind: 'product', productId, variantId, qty: Math.min(max, qty) }]);
  }
}

export function setQty(key: string, qty: number) {
  write(
    lines.flatMap((l) => {
      if (l.key !== key || l.kind !== 'product') return [l];
      if (qty <= 0) return [];
      const product = findProduct(l.productId);
      return [{ ...l, qty: Math.min(qty, product ? stockOf(product, l.variantId) : qty) }];
    }),
  );
}

export function addSlips(slips: ZapiskaSlip[]) {
  write([...lines, ...slips.map((slip): CartLine => ({ key: `z:${slip.id}`, kind: 'zapiska', slip }))]);
}

export function removeLine(key: string) {
  write(lines.filter((l) => l.key !== key));
}

export function clearCart() {
  write([]);
}

export function shippingFor(subtotalShippable: number): number {
  if (subtotalShippable <= 0) return 0;
  return subtotalShippable >= store.shipping.freeOver ? 0 : store.shipping.flatRate;
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Readable labels for a slip: its type, commemoration, candle and the names with prefixes. */
export function slipLabels(slip: ZapiskaSlip, t: (field: Localized) => string) {
  const type = zapiski.slipTypes.find((s) => s.id === slip.type);
  const commemoration = zapiski.commemorations.find((c) => c.id === slip.commemoration);
  const candle = zapiski.candles.find((c) => c.id === slip.candle);
  const names = slip.names
    .filter((n) => n.name.trim())
    .map((n) => {
      const prefix = zapiski.prefixes.find((p) => p.id === n.prefix);
      return prefix ? `${t(prefix.label)} ${n.name.trim()}` : n.name.trim();
    });
  return { type: type ? t(type.label) : '', commemoration: commemoration ? t(commemoration.label) : '', candle: candle ? t(candle.label) : '', names };
}
