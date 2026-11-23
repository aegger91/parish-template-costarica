import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { LangProvider } from '@/context/LangContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Worship from '@/pages/Worship';
import Visit from '@/pages/Visit';
import Gallery from '@/pages/Gallery';
import Sacraments from '@/pages/Sacraments';
import Projects from '@/pages/Projects';
import Contact from '@/pages/Contact';
import Announcements from '@/pages/Announcements';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LangProvider>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/worship" element={<Worship />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/sacraments" element={<Sacraments />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LangProvider>
  );
}
