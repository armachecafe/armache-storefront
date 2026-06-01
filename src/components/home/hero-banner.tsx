import Link from 'next/link';
import type { Theme } from '@/lib/api';

interface HeroBannerProps {
  theme: Theme;
}

export function HeroBanner({ theme }: HeroBannerProps) {
  return (
    <section
      className="relative h-[500px] flex items-center justify-center text-white"
      style={{
        backgroundImage: theme.heroBannerUrl ? `url(${theme.heroBannerUrl})` : undefined,
        backgroundColor: theme.primaryColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      data-testid="hero-banner"
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <h1 className="font-display text-4xl md:text-6xl mb-4">
          {theme.heroBannerTitle || theme.storeTitle}
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200">
          {theme.heroBannerSubtitle || theme.storeSubtitle}
        </p>
        {theme.heroBannerCta && (
          <Link
            href={theme.heroBannerLink || '/catalogo'}
            className="inline-block bg-brand-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-accent/90 transition-colors"
            data-testid="hero-cta-button"
          >
            {theme.heroBannerCta}
          </Link>
        )}
      </div>
    </section>
  );
}
