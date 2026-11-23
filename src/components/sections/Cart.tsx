import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CartLineView from '@/components/store/CartLineView';
import OrthodoxIcon from '@/components/ui/OrthodoxIcon';
import { getPage, payments } from '@/content';
import type { SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { lineTotal, useCart } from '@/lib/cart';
import { formatMoney } from '@/lib/format';

export type CartSection = SectionBase;

export default function Cart() {
  const { ui, language } = useI18n();
  const lines = useCart();
  const checkout = getPage('checkout');
  const store = getPage('store');
  const zapiski = getPage('zapiski');
  const subtotal = lines.reduce((n, l) => n + lineTotal(l), 0);

  return (
    <section className="section bg-white">
      <div className="container-px mx-auto max-w-[72rem]">
        {lines.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-primary-100 bg-primary-50 p-8 text-center">
            <OrthodoxIcon name="candle" className="mx-auto h-10 w-10 text-accent-600" strokeWidth={1.4} />
            <p className="mt-4 font-heading text-2xl font-semibold text-primary-900">{ui('cart.empty')}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {store && (
                <Link to={store.path} className="btn-accent">
                  {ui('cart.browse')}
                </Link>
              )}
              {zapiski && (
                <Link to={zapiski.path} className="btn-outline">
                  {ui('hero.commemoration')}
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <ul className="divide-y divide-primary-100 border-y border-primary-100">
              {lines.map((line) => (
                <CartLineView key={line.key} line={line} />
              ))}
            </ul>
            <aside className="h-fit rounded-2xl bg-primary-50 p-6 lg:sticky lg:top-28">
              <p className="flex justify-between text-[15px] text-ink-700">
                <span>{ui('cart.subtotal')}</span>
                <span className="font-semibold text-primary-900">{formatMoney(subtotal, payments.currency, language.locale)}</span>
              </p>
              <p className="mt-2 text-[13px] text-ink-500">{ui('cart.shippingLater')}</p>
              {checkout && (
                <Link to={checkout.path} className="btn-accent mt-6 w-full">
                  {ui('cart.checkout')}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" strokeWidth={2} aria-hidden />
                </Link>
              )}
              {store && (
                <Link to={store.path} className="mt-3 block text-center text-[13px] font-semibold text-primary-700 underline-offset-4 hover:underline">
                  {ui('cart.continue')}
                </Link>
              )}
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
