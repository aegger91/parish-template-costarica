import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Church, Truck } from 'lucide-react';
import ProductImage from '@/components/store/ProductImage';
import StockNote from '@/components/store/StockNote';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import { getPage, payments, store } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { lowestPrice, totalStock } from '@/lib/cart';
import { formatMoney } from '@/lib/format';

export interface StoreCatalogSection extends SectionBase {
  intro?: Localized;
}

export default function StoreCatalog({ section }: { section: StoreCatalogSection }) {
  const { t, ui, language } = useI18n();
  const [category, setCategory] = useState('');
  const productPage = getPage('product');
  const products = useMemo(
    () =>
      store.products
        .filter((p) => !category || p.category === category)
        .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || Number(totalStock(b) > 0) - Number(totalStock(a) > 0)),
    [category],
  );
  const counts = Object.fromEntries(store.categories.map((c) => [c.id, store.products.filter((p) => p.category === c.id).length]));
  const money = (n: number) => formatMoney(n, payments.currency, language.locale);

  return (
    <section className="section bg-white">
      <div className="container-px mx-auto max-w-[80rem]">
        {section.intro && <p className="max-w-3xl text-[15px] leading-relaxed text-ink-700">{t(section.intro)}</p>}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <p className="flex items-start gap-3 rounded-xl bg-primary-50 px-4 py-3 text-[13.5px] text-ink-700">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.8} aria-hidden />
            {ui('store.shippingNote', { rate: money(store.shipping.flatRate), free: money(store.shipping.freeOver) })}
          </p>
          <p className="flex items-start gap-3 rounded-xl bg-primary-50 px-4 py-3 text-[13.5px] text-ink-700">
            <Church className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.8} aria-hidden />
            {ui('store.pickupNote', { place: t(store.pickup.location) })}
          </p>
        </div>

        <div role="group" aria-label={ui('store.categories')} className="-mx-5 mt-8 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            <button type="button" onClick={() => setCategory('')} aria-pressed={!category} className={`chip ${!category ? 'chip-on' : 'chip-off'}`}>
              {ui('all')}
            </button>
            {store.categories.map((c) => (
              <button key={c.id} type="button" onClick={() => setCategory(c.id)} aria-pressed={category === c.id} className={`chip ${category === c.id ? 'chip-on' : 'chip-off'}`}>
                <Icon name={c.icon} className="h-4 w-4" strokeWidth={1.7} />
                {t(c.label)}
                <span className="text-[11px] opacity-70">{counts[c.id]}</span>
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => {
            const stock = totalStock(p);
            const from = lowestPrice(p);
            const varies = p.variants.some((v) => (v.price ?? p.price) !== from);
            const to = productPage ? productPage.path.replace(':productId', p.id) : '#';
            return (
              <li key={p.id}>
                <Reveal delay={0.04 * (i % 4)} className="h-full">
                  <Link to={to} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-accent-300 hover:shadow-xl hover:shadow-primary-900/10">
                    <div className="relative aspect-square overflow-hidden">
                      <ProductImage product={p} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                      {stock <= 0 && (
                        <span className="absolute start-2 top-2 rounded-pill bg-primary-950/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                          {ui('store.soldOut')}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-3 sm:p-5">
                      <h3 className="font-heading text-[17px] font-semibold leading-snug text-primary-900 sm:text-xl">{t(p.name)}</h3>
                      <p className="mt-1 line-clamp-2 hidden text-[13.5px] leading-snug text-ink-500 sm:block">{t(p.summary)}</p>
                      <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 pt-3">
                        <span className="text-[15px] font-semibold text-primary-900">{varies ? ui('store.from', { price: money(from) }) : money(from)}</span>
                        {stock > 0 && <StockNote stock={stock} />}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
