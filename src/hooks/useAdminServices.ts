import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface AdminServiceRecord {
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

export function useAdminServices() {
  const [services, setServices] = useState<AdminServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('admin_services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        setError(true);
      } else {
        setServices(data ?? []);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  const homeServices = services.filter(s => s.show_on_home);

  return { services, homeServices, loading, error };
}
