import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import OrthodoxCross from '@/components/ui/OrthodoxCross';
import { getPage, payments } from '@/content';
import { useI18n } from '@/i18n';
import { findProduct, findVariant, lineTotal, removeLine, setQty, slipLabels, stockOf, unitPrice } from '@/lib/cart';
import type { CartLine } from '@/lib/cart';
import { formatMoney } from '@/lib/format';
import ProductImage from './ProductImage';
import QtyStepper from './QtyStepper';

/** One line of the cart: a product with quantity, or a commemoration slip. */
export default function CartLineView({ line, editable = true }: { line: CartLine; editable?: boolean }) {
  const { t, ui, language } = useI18n();
  const money = (n: number) => formatMoney(n, payments.currency, language.locale);

  if (line.kind === 'zapiska') {
    const l = slipLabels(line.slip, t);
    const repose = line.slip.type === 'repose';
    return (
      <li className="flex gap-4 py-5">
        <span
          aria-hidden
          className={`flex h-20 w-16 shrink-0 flex-col items-center rounded-md border-2 bg-white pt-2 ${repose ? 'border-ink-900' : 'border-rose-700'}`}
        >
          <OrthodoxCross className={`h-6 w-6 ${repose ? 'text-ink-900' : 'text-rose-700'}`} strokeWidth={2} />
          <span className={`mt-2 h-px w-8 ${repose ? 'bg-ink-900/40' : 'bg-rose-700/40'}`} />
          <span className={`mt-1.5 h-px w-8 ${repose ? 'bg-ink-900/40' : 'bg-rose-700/40'}`} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-lg font-normal text-ink-900">
            {ui('zapiski.slip')}: {l.type}
          </p>
          <p className="text-[13px] text-ink-500">{[l.commemoration, l.candle && `${ui('zapiski.candle')}: ${l.candle}`].filter(Boolean).join(' · ')}</p>
          <p className="mt-1 line-clamp-2 text-[14px] text-ink-700">{l.names.join(', ')}</p>
          {editable && (
            <button type="button" onClick={() => removeLine(line.key)} className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-[13px] font-medium text-rose-700 hover:text-rose-800">
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
              {ui('store.remove')}
            </button>
          )}
        </div>
        <p className="shrink-0 text-[15px] font-semibold text-primary-900">{money(lineTotal(line))}</p>
      </li>
    );
  }

  const product = findProduct(line.productId);
  if (!product) return null;
  const variant = findVariant(product, line.variantId);
  const productPage = getPage('product');
  return (
    <li className="flex gap-4 py-5">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-primary-100">
        <ProductImage product={product} className="h-full w-full" />
      </div>
      <div className="min-w-0 flex-1">
        {productPage ? (
          <Link to={productPage.path.replace(':productId', product.id)} className="font-heading text-lg font-normal leading-snug text-ink-900 hover:text-accent-700">
            {t(product.name)}
          </Link>
        ) : (
          <p className="font-heading text-lg font-normal text-ink-900">{t(product.name)}</p>
        )}
        <p className="text-[13px] text-ink-500">
          {[variant && t(variant.label), `${money(unitPrice(product, line.variantId))} ${ui('store.each')}`].filter(Boolean).join(' · ')}
        </p>
        {editable ? (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <QtyStepper value={line.qty} max={stockOf(product, line.variantId)} onChange={(n) => setQty(line.key, n)} label={ui('store.quantity')} />
            <button type="button" onClick={() => removeLine(line.key)} className="inline-flex min-h-9 items-center gap-1.5 text-[13px] font-medium text-rose-700 hover:text-rose-800">
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
              {ui('store.remove')}
            </button>
          </div>
        ) : (
          <p className="text-[13px] text-ink-500">
            {ui('store.quantity')}: {line.qty}
          </p>
        )}
      </div>
      <p className="shrink-0 text-[15px] font-semibold text-primary-900">{money(lineTotal(line))}</p>
    </li>
  );
}
