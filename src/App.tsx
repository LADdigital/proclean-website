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
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
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

function PublicLayout() {
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

function AppRoutes() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <AdminLayout />;
  }

  return <PublicLayout />;
}

export default function App() {
  const [showLoader, setShowLoader] = useState(true);
  const handleDone = useCallback(() => setShowLoader(false), []);

  return (
    <ToastProvider>
      {showLoader && <LoadingScreen onDone={handleDone} />}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ToastProvider>
  );
}
