import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Church, ShoppingBag, Truck } from 'lucide-react';
import { NoticeCard } from '@/components/sections/ComingSoon';
import { PageHeroFrame } from '@/components/sections/PageHero';
import { useCrumbs } from '@/lib/crumbs';
import ProductImage from '@/components/store/ProductImage';
import QtyStepper from '@/components/store/QtyStepper';
import StockNote from '@/components/store/StockNote';
import { getPage, payments, site, store } from '@/content';
import type { SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { addProduct, findProduct, stockOf, unitPrice } from '@/lib/cart';
import { formatMoney } from '@/lib/format';

export type ProductDetailSection = SectionBase;

export default function ProductDetail() {
  const { t, ui, language } = useI18n();
  const { productId = '' } = useParams();
  const product = findProduct(productId);
  const storePage = getPage('store');
  const cartPage = getPage('cart');
  const firstInStock = product?.variants.find((v) => v.stock > 0)?.id ?? product?.variants[0]?.id ?? '';
  const [variant, setVariant] = useState(firstInStock);
  const [image, setImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const crumbs = useCrumbs(product ? [{ label: t(product.name) }] : []);

  useEffect(() => {
    setVariant(firstInStock);
    setImage(0);
    setQty(1);
    setAdded(false);
  }, [productId, firstInStock]);

  useEffect(() => {
    if (product) document.title = `${t(product.name)} | ${t(site.name)}`;
  }, [product, t]);

  if (!product) {
    return (
      <>
        <PageHeroFrame title={ui('store.notFound')} crumbs={crumbs} />
        <section className="section bg-white">
          <div className="container-px container-max">
            <NoticeCard title={ui('store.notFound')} text={ui('store.notFoundText')} link={storePage ? { to: storePage.path, label: storePage.navLabel ?? storePage.seo.title } : undefined} />
          </div>
        </section>
      </>
    );
  }

  const stock = stockOf(product, variant);
  const price = unitPrice(product, variant);
  const category = store.categories.find((c) => c.id === product.category);
  const money = (n: number) => formatMoney(n, payments.currency, language.locale);

  return (
    <>
      <PageHeroFrame eyebrow={category ? t(category.label) : undefined} title={t(product.name)} crumbs={crumbs} />
      <section className="section bg-white">
        <div className="container-px mx-auto grid max-w-[72rem] gap-8 md:grid-cols-2 lg:gap-14">
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl border border-primary-100 bg-primary-50">
              <ProductImage key={image} product={product} index={image} className="h-full w-full" />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImage(i)}
                    aria-pressed={image === i}
                    aria-label={ui('store.photo', { n: String(i + 1) })}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${image === i ? 'border-accent-400' : 'border-transparent'}`}
                  >
                    <ProductImage product={product} index={i} className="h-full w-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="font-heading text-3xl font-semibold text-primary-900">{money(price)}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-700">{t(product.description)}</p>

            {product.variants.length > 0 && (
              <fieldset className="mt-6">
                <legend className="label">{ui('store.choose')}</legend>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <label
                      key={v.id}
                      className={`chip cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-400 ${variant === v.id ? 'chip-on' : 'chip-off'} ${v.stock <= 0 ? 'line-through opacity-60' : ''}`}
                    >
                      <input
                        type="radio"
                        name="variant"
                        value={v.id}
                        checked={variant === v.id}
                        onChange={() => {
                          setVariant(v.id);
                          setQty(1);
                          setAdded(false);
                        }}
                        className="sr-only"
                      />
                      {t(v.label)}
                      {v.price !== undefined && v.price !== product.price && <span className="opacity-75">{money(v.price)}</span>}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {stock > 0 && <QtyStepper value={qty} max={stock} onChange={(n) => setQty(Math.max(1, Math.min(stock, n)))} label={ui('store.quantity')} />}
              <StockNote stock={stock} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={stock <= 0}
                onClick={() => {
                  addProduct(product.id, variant, qty);
                  setAdded(true);
                }}
                className="btn-accent"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                {ui('store.add')}
              </button>
              {added && cartPage && (
                <Link to={cartPage.path} className="btn-outline">
                  {ui('store.viewCart')}
                </Link>
              )}
            </div>
            <p role="status" className="mt-3 min-h-6 text-[14px] text-emerald-700">
              {added && (
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
                  {ui('store.added')}
                </span>
              )}
            </p>

            <ul className="mt-4 space-y-3 border-t border-primary-100 pt-5 text-[14px] text-ink-700">
              {product.shippable && (
                <li className="flex gap-3">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.8} aria-hidden />
                  {ui('store.shippingNote', { rate: money(store.shipping.flatRate), free: money(store.shipping.freeOver) })}
                </li>
              )}
              <li className="flex gap-3">
                <Church className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.8} aria-hidden />
                {product.shippable ? ui('store.pickupNote', { place: t(store.pickup.location) }) : ui('store.digital')}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
