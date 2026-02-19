import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import ConfirmModal from './ConfirmModal';
import { Plus, X, ChevronDown, ChevronUp, Image, Eye, EyeOff, Trash2, Pencil, Home } from 'lucide-react';

interface AdminService {
  id: string;
  service_key: string | null;
  title: string;
  short_title: string;
  description: string;
  features: string[];
  price: number;
  image_url: string | null;
  is_active: boolean;
  show_on_home: boolean;
  sort_order: number;
  created_at: string;
}

interface ServiceFormData {
  title: string;
  short_title: string;
  description: string;
  features: string[];
  price: string;
  image_url: string;
  is_active: boolean;
  show_on_home: boolean;
}

const emptyForm: ServiceFormData = {
  title: '',
  short_title: '',
  description: '',
  features: [''],
  price: '',
  image_url: '',
  is_active: true,
  show_on_home: false,
};

function serviceToForm(s: AdminService): ServiceFormData {
  return {
    title: s.title,
    short_title: s.short_title ?? '',
    description: s.description,
    features: s.features?.length ? s.features : [''],
    price: s.price > 0 ? String(s.price) : '',
    image_url: s.image_url ?? '',
    is_active: s.is_active,
    show_on_home: s.show_on_home ?? false,
  };
}

export default function AdminServicesPanel() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<ServiceFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminService | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const editFileRef = useRef<HTMLInputElement>(null);
  const addFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchServices(); }, []);

  async function fetchServices() {
    const { data } = await supabase
      .from('admin_services')
      .select('*')
      .order('sort_order', { ascending: true });
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, serviceId: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFor(serviceId);
    const url = await uploadImage(file, serviceId);
    if (url) setForm(p => ({ ...p, image_url: url }));
    setUploadingFor(null);
  }

  function startEdit(service: AdminService) {
    setEditingId(service.id);
    setShowAddForm(false);
    setExpandedId(service.id);
    setForm(serviceToForm(service));
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    const cleanFeatures = form.features.filter(f => f.trim() !== '');
    await supabase.from('admin_services').update({
      title: form.title,
      short_title: form.short_title || form.title,
      description: form.description,
      features: cleanFeatures,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url || null,
      is_active: form.is_active,
      show_on_home: form.show_on_home,
    }).eq('id', id);
    await fetchServices();
    setEditingId(null);
    setForm(emptyForm);
    setSaving(false);
  }

  async function handleAdd() {
    setSaving(true);
    const cleanFeatures = form.features.filter(f => f.trim() !== '');
    await supabase.from('admin_services').insert({
      title: form.title,
      short_title: form.short_title || form.title,
      description: form.description,
      features: cleanFeatures,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url || null,
      is_active: form.is_active,
      show_on_home: form.show_on_home,
      sort_order: services.length + 1,
    });
    await fetchServices();
    setShowAddForm(false);
    setForm(emptyForm);
    setSaving(false);
  }

  async function toggleActive(service: AdminService) {
    await supabase.from('admin_services').update({ is_active: !service.is_active }).eq('id', service.id);
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, is_active: !s.is_active } : s));
  }

  async function toggleShowOnHome(service: AdminService) {
    await supabase.from('admin_services').update({ show_on_home: !service.show_on_home }).eq('id', service.id);
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, show_on_home: !s.show_on_home } : s));
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
        <div>
          <h2 className="text-xl font-bold text-white">Services</h2>
          <p className="text-stone-500 text-xs mt-0.5">{services.length} service{services.length !== 1 ? 's' : ''} — changes appear live on the website</p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 rounded-2xl bg-[#242424] border border-stone-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-700">
            <span className="text-sm font-semibold text-white">New Service</span>
            <button onClick={() => { setShowAddForm(false); setForm(emptyForm); }} className="text-stone-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5">
            <ServiceForm
              form={form}
              setForm={setForm}
              onImageUpload={(e) => handleImageUpload(e, 'new')}
              fileInputRef={addFileRef}
              uploadingFor={uploadingFor}
              targetId="new"
            />
            <div className="flex gap-3 mt-5">
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
        </div>
      )}

      <div className="space-y-2">
        {services.map((service) => (
          <ServiceRow
            key={service.id}
            service={service}
            editingId={editingId}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            form={form}
            setForm={setForm}
            saving={saving}
            uploadingFor={uploadingFor}
            editFileRef={editFileRef}
            onStartEdit={startEdit}
            onCancelEdit={cancelEdit}
            onSaveEdit={saveEdit}
            onToggleActive={toggleActive}
            onToggleShowOnHome={toggleShowOnHome}
            onDelete={() => setDeleteTarget(service)}
            onImageUpload={(e) => handleImageUpload(e, service.id)}
          />
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

interface ServiceRowProps {
  service: AdminService;
  editingId: string | null;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  form: ServiceFormData;
  setForm: React.Dispatch<React.SetStateAction<ServiceFormData>>;
  saving: boolean;
  uploadingFor: string | null;
  editFileRef: React.RefObject<HTMLInputElement>;
  onStartEdit: (s: AdminService) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
  onToggleActive: (s: AdminService) => void;
  onToggleShowOnHome: (s: AdminService) => void;
  onDelete: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ServiceRow({
  service, editingId, expandedId, setExpandedId,
  form, setForm, saving, uploadingFor, editFileRef,
  onStartEdit, onCancelEdit, onSaveEdit, onToggleActive, onToggleShowOnHome, onDelete, onImageUpload,
}: ServiceRowProps) {
  const isEditing = editingId === service.id;
  const isExpanded = expandedId === service.id;

  return (
    <div className={`rounded-2xl border bg-[#242424] transition-all ${service.is_active ? 'border-stone-700' : 'border-stone-800'} ${!service.is_active ? 'opacity-50' : ''}`}>
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
        onClick={() => !isEditing && setExpandedId(isExpanded ? null : service.id)}
      >
        {service.image_url ? (
          <img src={service.image_url} alt={service.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center shrink-0">
            <Image className="w-4 h-4 text-stone-600" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm truncate">{service.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${service.is_active ? 'bg-emerald-900/50 text-emerald-400' : 'bg-stone-700 text-stone-500'}`}>
              {service.is_active ? 'Active' : 'Hidden'}
            </span>
            {service.show_on_home && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 bg-blue-900/50 text-blue-400 flex items-center gap-1">
                <Home className="w-2.5 h-2.5" /> Home
              </span>
            )}
            {service.price > 0 && (
              <span className="text-xs text-stone-400 shrink-0">${service.price}</span>
            )}
          </div>
          {!isExpanded && (
            <p className="text-stone-500 text-xs mt-0.5 truncate">{service.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onToggleShowOnHome(service)}
            title={service.show_on_home ? 'Remove from home page' : 'Show on home page'}
            className={`p-2 rounded-lg transition-colors ${service.show_on_home ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-950/30' : 'text-stone-500 hover:text-blue-400 hover:bg-stone-700'}`}
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleActive(service)}
            title={service.is_active ? 'Hide from website' : 'Show on website'}
            className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-stone-700 transition-colors"
          >
            {service.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onStartEdit(service)}
            title="Edit service"
            className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-stone-700 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            title="Delete service"
            className="p-2 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {!isEditing && (
            <button className="p-2 rounded-lg text-stone-600 transition-colors">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="px-5 pb-5 border-t border-stone-700 pt-4">
          <ServiceForm
            form={form}
            setForm={setForm}
            onImageUpload={onImageUpload}
            fileInputRef={editFileRef}
            uploadingFor={uploadingFor}
            targetId={service.id}
          />
          <div className="flex gap-3 mt-5">
            <button
              onClick={onCancelEdit}
              className="flex-1 py-2.5 rounded-xl border border-stone-600 text-stone-300 hover:bg-stone-700 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => onSaveEdit(service.id)}
              disabled={saving || !form.title}
              className="flex-1 py-2.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white transition-colors text-sm font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {!isEditing && isExpanded && (
        <div className="px-5 pb-5 border-t border-stone-700 pt-4 space-y-3">
          <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">Description</p>
            <p className="text-stone-300 text-sm leading-relaxed">{service.description}</p>
          </div>
          {service.features?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">Features</p>
              <ul className="space-y-1">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-300">
                    <span className="text-[#B91C1C] mt-0.5 shrink-0">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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

  function updateFeature(index: number, value: string) {
    setForm(p => {
      const features = [...p.features];
      features[index] = value;
      return { ...p, features };
    });
  }

  function addFeature() {
    setForm(p => ({ ...p, features: [...p.features, ''] }));
  }

  function removeFeature(index: number) {
    setForm(p => ({ ...p, features: p.features.filter((_, i) => i !== index) }));
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <label className="block text-xs font-medium text-stone-400 mb-1.5">Short Title (nav label)</label>
          <input
            type="text"
            value={form.short_title}
            onChange={(e) => setForm(p => ({ ...p, short_title: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a1a] border border-stone-700 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"
            placeholder="Same as name if blank"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-400 mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a1a] border border-stone-700 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors resize-none"
          placeholder="Describe this service..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-stone-400">What's Included (features)</label>
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-1 text-xs text-[#B91C1C] hover:text-red-400 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(i, e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-stone-700 text-white text-sm focus:outline-none focus:border-[#B91C1C] transition-colors"
                placeholder="Feature description..."
              />
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="p-2 text-stone-600 hover:text-red-400 transition-colors shrink-0"
                disabled={form.features.length === 1}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-400 mb-1.5">Starting Price ($) — leave blank if varies</label>
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
            <img src={form.image_url} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-700" />
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-600 text-stone-300 hover:bg-stone-700 text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Image className="w-3.5 h-3.5" />
            {isUploading ? 'Uploading...' : form.image_url ? 'Replace Photo' : 'Upload Photo'}
          </button>
          {form.image_url && (
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, image_url: '' }))}
              className="text-red-400 hover:text-red-300 text-xs transition-colors"
            >
              Remove
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
      </div>

      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.is_active ? 'bg-[#B91C1C]' : 'bg-stone-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <div>
            <span className="text-sm text-stone-300">Active on /services page</span>
            <p className="text-xs text-stone-600 mt-0.5">Controls visibility on the full Services page</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm(p => ({ ...p, show_on_home: !p.show_on_home }))}
            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.show_on_home ? 'bg-blue-600' : 'bg-stone-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.show_on_home ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <div>
            <span className="text-sm text-stone-300">Show on Home page</span>
            <p className="text-xs text-stone-600 mt-0.5">Appears in "Professional Auto Detailing Services" section</p>
          </div>
        </div>
      </div>
    </div>
  );
}
