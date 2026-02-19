import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface AdminServiceRecord {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
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
        .order('created_at', { ascending: true });

      if (error) {
        setError(true);
      } else {
        setServices(data ?? []);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return { services, loading, error };
}
