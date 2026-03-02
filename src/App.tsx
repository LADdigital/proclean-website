import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import DeveloperSignature from './components/DeveloperSignature';
import SchemaMarkup from './components/SchemaMarkup';
import ChatPlaceholder from './components/ChatPlaceholder';
import { ToastProvider } from './components/ui/Toast';
import { useDetailMode } from './features/easterEggs/useDetailMode';
import { useToast } from './components/ui/Toast';
import { useSEO } from './hooks/useSEO';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import GiftCard from './pages/GiftCard';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import AdminGuard from './admin/AdminGuard';
import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';

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

function SEOManager() {
  useSEO();
  return null;
}

function PublicLayout({ showLoader }: { showLoader: boolean }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <ScrollToTop />
      <SEOManager />
      <SchemaMarkup />
      <DetailModeManager />
      <Header onOpenChat={() => setChatOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gift-card" element={<GiftCard />} />
        </Routes>
      </main>
      <DeveloperSignature />
      <Footer />
      {!showLoader && <ChatPlaceholder isOpen={chatOpen} setIsOpen={setChatOpen} />}
    </>
  );
}

function AdminLayout() {
  return (
    <AdminAuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />
      </Routes>
    </AdminAuthProvider>
  );
}

function AppRoutes({ showLoader }: { showLoader: boolean }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <AdminLayout />;
  }

  return <PublicLayout showLoader={showLoader} />;
}

export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');
  const [showLoader, setShowLoader] = useState(!isAdmin);
  const handleDone = useCallback(() => setShowLoader(false), []);

  return (
    <ToastProvider>
      {showLoader && <LoadingScreen onDone={handleDone} />}
      <BrowserRouter>
        <AppRoutes showLoader={showLoader} />
      </BrowserRouter>
    </ToastProvider>
  );
}
