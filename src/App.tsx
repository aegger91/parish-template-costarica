import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { getPage, pages } from '@/content';
import { LangProvider, useI18n } from '@/i18n';
import Page from '@/pages/Page';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function SkipLink() {
  const { ui } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only z-[80] rounded-pill bg-accent-400 px-5 py-3 text-sm font-semibold text-primary-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
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
        <div className="flex min-h-screen flex-col">
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
