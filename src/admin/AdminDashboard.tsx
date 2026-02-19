import { useState } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import AdminServicesPanel from './components/AdminServicesPanel';
import AdminGalleryPanel from './components/AdminGalleryPanel';

type Tab = 'services' | 'gallery';

export default function AdminDashboard() {
  const { user, signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<Tab>('services');

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <header className="sticky top-0 z-40 bg-[#1a1a1a] border-b border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#B91C1C] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z"/>
              </svg>
            </div>
            <span className="font-bold text-white text-sm">Pro Clean Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-stone-500 text-xs hidden sm:block">{user?.email}</span>
            <button
              onClick={signOut}
              className="px-3 py-1.5 rounded-lg border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 text-xs font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-stone-400 text-sm">Manage your services and gallery photos.</p>
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-[#2a2a2a] border border-stone-700 mb-8 w-fit">
          <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')}>
            Services
          </TabButton>
          <TabButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')}>
            Gallery
          </TabButton>
        </div>

        {activeTab === 'services' && <AdminServicesPanel />}
        {activeTab === 'gallery' && <AdminGalleryPanel />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-[#B91C1C] text-white' : 'text-stone-400 hover:text-white'}`}
    >
      {children}
    </button>
  );
}
