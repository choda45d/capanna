import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SeasonProvider, useSeason } from './context/SeasonContext';
import Navbar from './components/Navbar';
import CursorTrail from './components/CursorTrail';
import AmbientEffect from './components/AmbientEffect';
import LoadingScreen from './components/LoadingScreen';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => {
      setKey(pathname);
      setVisible(true);
    }, 200);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div
      key={key}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {children}
    </div>
  );
}

function AppRoutes() {
  const { isBeach } = useSeason();
  return (
    <div data-season={isBeach ? 'beach' : 'city'}>
      <LoadingScreen />
      <ScrollToTop />
      <CursorTrail />
      <AmbientEffect />
      <Navbar />
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/meni" element={<MenuPage />} />
          <Route path="/galerija" element={<GalleryPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </PageTransition>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <SeasonProvider>
        <AppRoutes />
      </SeasonProvider>
    </HashRouter>
  );
}
