import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { store } from '@/content';
import type { Product } from '@/content';

/** A product photo, or a quiet framed icon of the category when the photo is missing. */
export default function ProductImage({ product, index = 0, className = '' }: { product: Product; index?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  const src = product.images[index];
  const icon = store.categories.find((c) => c.id === product.category)?.icon ?? 'cross';
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-b from-accent-50 to-primary-50 ${className}`}>
        <span className="flex h-20 w-20 items-center justify-center rounded-t-full rounded-b-md border-2 border-accent-400 bg-[rgb(var(--color-ivory))] text-accent-700">
          <Icon name={icon} className="h-9 w-9" strokeWidth={1.4} />
        </span>
      </div>
    );
  }
  return <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
