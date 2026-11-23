import type { ReactNode } from 'react';
import Reveal from '@/components/Reveal';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-900 pb-14 pt-32 sm:pb-16 sm:pt-40">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "url('/images/mother-of-god-of-vladimir-559768.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 22%',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,24,40,0.72) 0%, rgba(8,24,40,0.62) 40%, #0d2338 100%)',
        }}
      />
      <div className="container-px container-max relative">
        <Reveal>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300 sm:text-[12px] sm:tracking-[0.24em]">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl font-serif text-[32px] font-semibold leading-[1.12] text-white sm:text-5xl">
              {title}
            </h1>
            <div className="gold-rule mt-6" />
            {subtitle && (
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-navy-100 sm:text-base">
                {subtitle}
              </p>
            )}
            {children}
          </Reveal>
      </div>
    </section>
  );
}
