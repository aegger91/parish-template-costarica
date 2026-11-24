import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { getPage, pages } from '@/content';
import { LangProvider, useI18n } from '@/i18n';
import Page from '@/pages/Page';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }
    let tries = 10;
    let timer = 0;
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else if (tries-- > 0) timer = window.setTimeout(find, 100);
    };
    find();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
  return null;
}

function SkipLink() {
  const { ui } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only z-[90] rounded-pill bg-primary-600 px-5 py-3 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
    >
      {ui('skipToContent')}
    </a>
  );
}

const notFound = getPage('not-found');

export default function App() {
  return (
    <LangProvider>
      <MotionConfig reducedMotion="user">
        <ScrollToTop />
        <SkipLink />
        <div className="site-frame">
          <Header />
          <main id="main" className="flex-1">
            <Routes>
              {pages
                .filter((p) => p.path !== '*')
                .map((p) => (
                  <Route key={p.id} path={p.path} element={<Page page={p} />} />
                ))}
              {notFound && <Route path="*" element={<Page page={notFound} />} />}
            </Routes>
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </LangProvider>
  );
}
