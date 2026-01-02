import { createContext, useContext, useEffect, useState } from "react";
import { getActivities, createActivity } from "../utils/api";

const ActivityContext = createContext(null);

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getActivities()
      .then(data => {
        if (mounted) {
          setActivities(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function addActivity(payload) {
    const created = await createActivity(payload);
    setActivities(prev => [created, ...prev]);
  }

  return (
    <ActivityContext.Provider
      value={{
        activities,
        loading,
        addActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const ctx = useContext(ActivityContext);
  if (!ctx) {
    throw new Error("useActivities must be used inside ActivityProvider");
  }
  return ctx;
}
