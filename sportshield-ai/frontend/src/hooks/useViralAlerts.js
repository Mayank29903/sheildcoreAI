import { useState, useEffect } from 'react';
import { rtdb, ref, onValue, off } from '../lib/firebase';

export function useViralAlerts() {
    const [alert, setAlert] = useState(null);
    const [allAlerts, setAllAlerts] = useState([]);

    useEffect(() => {
        const alertsRef = ref(rtdb, 'viral_alerts');
        const unsubscribe = onValue(alertsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const active = Object.keys(data)
                    .map(k => ({ id: k, ...data[k] }))
                    .filter(a => a.is_active);

                setAllAlerts(active);
                
                if (active.length > 0) {
                    const priority = { 'VIRAL_SPREAD': 3, 'RAPID_SPREAD': 2, 'SPREADING': 1 };
                    active.sort((a, b) => (priority[b.alert_level] || 0) - (priority[a.alert_level] || 0));
                    setAlert(active[0]);
                } else {
                    setAlert(null);
                }
            } else {
                setAllAlerts([]);
                setAlert(null);
            }
        });
        return () => off(alertsRef, 'value', unsubscribe);
    }, []);

    return { alert, allAlerts };
}
