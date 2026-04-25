import { useState, useEffect } from 'react';
import { rtdb, ref, onValue, off } from '../lib/firebase';

export function useDashboardStats() {
  const [stats, setStats] = useState({
    assetsProtected: 0,
    scansToday: 0,
    violationsToday: 0,
    rightsValueUsd: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const statsRef = ref(rtdb, 'dashboard_stats');
    const unsubscribe = onValue(statsRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            setStats({
                assetsProtected: data.assets_protected || 0,
                scansToday: data.total_scans_today || 0,
                violationsToday: data.violations_today || 0,
                rightsValueUsd: data.rights_value_protected_usd || 0
            });
        }
        setLoading(false);
    });
    return () => off(statsRef, 'value', unsubscribe);
  }, []);

  return { ...stats, loading };
}
