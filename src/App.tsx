import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DeveloperSignature from './components/DeveloperSignature';
import SchemaMarkup from './components/SchemaMarkup';
import ChatPlaceholder from './components/ChatPlaceholder';
import { ToastProvider } from './components/ui/Toast';
import { useDetailMode } from './features/easterEggs/useDetailMode';
import { useToast } from './components/ui/Toast';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function DetailModeOverlay() {
  return (
    <div className="detail-mode-overlay">
      <div className="detail-mode-sweep" />
    </div>
  );
}

function DetailModeManager() {
  const { show } = useToast();
  useDetailMode((isOn) => {
    show(isOn ? 'Detail Mode Activated' : 'Detail Mode Off');
  });
  return <DetailModeOverlay />;
}

function Layout() {
  return (
    <>
      <ScrollToTop />
      <SchemaMarkup />
      <DetailModeManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <DeveloperSignature />
      <Footer />
      <ChatPlaceholder />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ToastProvider>
  );
}
