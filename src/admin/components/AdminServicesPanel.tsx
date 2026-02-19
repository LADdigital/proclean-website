import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import ConfirmModal from './ConfirmModal';

interface AdminService {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

interface ServiceFormData {
  title: string;
  description: string;
  price: string;
  image_url: string;
  is_active: boolean;
}

const emptyForm: ServiceFormData = {
  title: '',
  description: '',
  price: '',
  image_url: '',
  is_active: true,
};

export default function AdminServicesPanel() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<ServiceFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminService | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const { data } = await supabase
      .from('admin_services')
      .select('*')
      .order('created_at', { ascending: true });
    setServices(data ?? []);
    setLoading(false);
  }

  async function uploadImage(file: File, serviceId?: string): Promise<string | null> {
    const ext = file.name.split('.').pop();
    const path = `services/${serviceId ?? 'new'}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('admin-gallery').upload(path, file, { upsert: true });
    if (error) return null;
    const { data } = supabase.storage.from('admin-gallery').getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleEditImageUpload(e: React.ChangeEvent<HTMLInputElement>, serviceId: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFor(serviceId);
    const url = await uploadImage(file, serviceId);
    if (url) {
      setForm(prev => ({ ...prev, image_url: url }));
    }
    setUploadingFor(null);
  }

  async function handleAddImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFor('new');
    const url = await uploadImage(file, 'new');
    if (url) {
      setForm(prev => ({ ...prev, image_url: url }));
    }
    setUploadingFor(null);
  }

  function startEdit(service: AdminService) {
    setEditingId(service.id);
    setShowAddForm(false);
    setForm({
      title: service.title,
      description: service.description,
      price: String(service.price),
      image_url: service.image_url ?? '',
      is_active: service.is_active,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    await supabase
      .from('admin_services')
      .update({
        title: form.title,
        description: form.description,
        price: parseFloat(form.price) || 0,
        image_url: form.image_url || null,
        is_active: form.is_active,
      })
      .eq('id', id);
    await fetchServices();
    setEditingId(null);
    setForm(emptyForm);
    setSaving(false);
  }

  async function handleAdd() {
    setSaving(true);
    await supabase.from('admin_services').insert({
      title: form.title,
      description: form.description,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url || null,
      is_active: form.is_active,
    });
    await fetchServices();
    setShowAddForm(false);
    setForm(emptyForm);
    setSaving(false);
  }

  async function toggleActive(service: AdminService) {
    await supabase
      .from('admin_services')
      .update({ is_active: !service.is_active })
      .eq('id', service.id);
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, is_active: !s.is_active } : s));
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await supabase.from('admin_services').delete().eq('id', deleteTarget.id);
    await fetchServices();
    setDeleteTarget(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#B91C1C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Services</h2>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); setForm(emptyForm); }}
          className="px-4 py-2 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-sm font-medium transition-colors"
        >
          + Add Service
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-5 rounded-2xl bg-[#2a2a2a] border border-stone-700">
          <h3 className="text-base font-semibold text-white mb-4">New Service</h3>
          <ServiceForm
            form={form}
            setForm={setForm}
            onImageUpload={handleAddImageUpload}
            fileInputRef={addFileInputRef}
            uploadingFor={uploadingFor}
            targetId="new"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => { setShowAddForm(false); setForm(emptyForm); }}
              className="flex-1 py-2.5 rounded-xl border border-stone-600 text-stone-300 hover:bg-stone-700 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={saving || !form.title}
              className="flex-1 py-2.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white transition-colors text-sm font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {services.length === 0 && (
          <p className="text-stone-500 text-sm text-center py-10">No services yet. Add one above.</p>
        )}
        {services.map((service) => (
          <div
            key={service.id}
            className={`rounded-2xl border bg-[#2a2a2a] transition-colors ${service.is_active ? 'border-stone-700' : 'border-stone-800 opacity-60'}`}
          >
            {editingId === service.id ? (
              <div className="p-5">
                <ServiceForm
                  form={form}
                  setForm={setForm}
                  onImageUpload={(e) => handleEditImageUpload(e, service.id)}
                  fileInputRef={fileInputRef}
                  uploadingFor={uploadingFor}
                  targetId={service.id}
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={cancelEdit}
                    className="flex-1 py-2.5 rounded-xl border border-stone-600 text-stone-300 hover:bg-stone-700 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(service.id)}
                    disabled={saving || !form.title}
                    className="flex-1 py-2.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {service.image_url && (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">{service.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${service.is_active ? 'bg-green-900/40 text-green-400' : 'bg-stone-700 text-stone-400'}`}>
                        {service.is_active ? 'Active' : 'Hidden'}
                      </span>
                      {service.price > 0 && (
                        <span className="text-xs text-stone-400">${service.price}</span>
                      )}
                    </div>
                    <p className="text-stone-400 text-sm mt-1 line-clamp-2">{service.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => startEdit(service)}
                    className="px-3 py-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(service)}
                    className="px-3 py-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs font-medium transition-colors"
                  >
                    {service.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(service)}
                    className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-950/70 text-red-400 text-xs font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete Service"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

interface ServiceFormProps {
  form: ServiceFormData;
  setForm: React.Dispatch<React.SetStateAction<ServiceFormData>>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  uploadingFor: string | null;
  targetId: string;
}

function ServiceForm({ form, setForm, onImageUpload, fileInputRef, uploadingFor, targetId }: ServiceFormProps) {
  const isUploading = uploadingFor === targetId;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-stone-400 mb-1.5">Service Name</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a1a] border border-stone-700 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"
          placeholder="e.g. Ceramic Coating"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-400 mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a1a] border border-stone-700 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors resize-none"
          placeholder="Describe this service..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-400 mb-1.5">Price ($)</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a1a] border border-stone-700 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"
          placeholder="0"
          min="0"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-400 mb-1.5">Photo</label>
        <div className="flex items-center gap-3">
          {form.image_url && (
            <img src={form.image_url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-2 rounded-lg border border-stone-600 text-stone-300 hover:bg-stone-700 text-xs font-medium transition-colors disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : form.image_url ? 'Replace Photo' : 'Upload Photo'}
          </button>
          {form.image_url && (
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, image_url: '' }))}
              className="text-red-400 hover:text-red-300 text-xs"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
          className={`relative w-10 h-6 rounded-full transition-colors ${form.is_active ? 'bg-[#B91C1C]' : 'bg-stone-600'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
        <span className="text-sm text-stone-300">Show on website</span>
      </div>
    </div>
  );
}
