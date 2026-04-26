import { useState, useEffect } from "react";
import { rtdb, ref, onValue, off } from "../lib/firebase";

export function useRealtimeFeed() {
  const [violations, setViolations] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const violationsRef = ref(rtdb, "violations_live");
    const unsubscribe = onValue(violationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        list.sort((a, b) => b.detected_at - a.detected_at);
        setViolations(list.slice(0, 10));
      } else {
        setViolations([]);
      }
      setIsConnected(true);
    });
    return () => off(violationsRef, "value", unsubscribe);
  }, []);

  return { violations, isConnected };
}
