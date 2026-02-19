import { useState } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import AdminServicesPanel from './components/AdminServicesPanel';
import AdminGalleryPanel from './components/AdminGalleryPanel';
import { LogOut, Layers, Image } from 'lucide-react';

type Tab = 'services' | 'gallery';

export default function AdminDashboard() {
  const { user, signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<Tab>('services');

  return (
    <div className="min-h-screen bg-[#131210]">
      <header className="sticky top-0 z-40 bg-[#131210]/95 backdrop-blur-sm border-b border-stone-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/Photoroom_20260213_195605.png"
              alt="Pro Clean Auto Detail Systems"
              className="h-8 w-auto"
            />
            <div className="w-px h-5 bg-stone-700" />
            <span className="text-stone-400 text-xs font-medium tracking-wide uppercase">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-stone-600 text-xs hidden sm:block">{user?.email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 pb-8 border-b border-stone-800">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#B91C1C]/20 border border-[#B91C1C]/30 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">Pro Clean Dashboard</h1>
              <p className="text-stone-500 text-sm mt-0.5">Manage services and gallery — all changes go live immediately.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-[#1e1c1a] border border-stone-800 mb-8 w-fit">
          <TabButton
            active={activeTab === 'services'}
            onClick={() => setActiveTab('services')}
            icon={<Layers className="w-3.5 h-3.5" />}
          >
            Services
          </TabButton>
          <TabButton
            active={activeTab === 'gallery'}
            onClick={() => setActiveTab('gallery')}
            icon={<Image className="w-3.5 h-3.5" />}
          >
            Gallery
          </TabButton>
        </div>

        {activeTab === 'services' && <AdminServicesPanel />}
        {activeTab === 'gallery' && <AdminGalleryPanel />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-[#B91C1C] text-white shadow-sm'
          : 'text-stone-400 hover:text-stone-200'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
