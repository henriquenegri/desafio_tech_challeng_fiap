import { useEffect, useState } from "react";

export interface DashboardWidgets {
  showCharts: boolean;
  showSavingsGoal: boolean;
  showSpendingAlert: boolean;
  showCards: boolean;
}

const DEFAULT_WIDGETS: DashboardWidgets = {
  showCharts: true,
  showSavingsGoal: true,
  showSpendingAlert: true,
  showCards: true,
};

export function useDashboardWidgets() {
  const [widgets, setWidgets] = useState<DashboardWidgets>(DEFAULT_WIDGETS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadWidgets = () => {
      const saved = localStorage.getItem("dashboardWidgets");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setWidgets(parsed);
        } catch (e) {
          console.error("Failed to parse widget preferences", e);
        }
      }
    };

    window.setTimeout(() => {
      loadWidgets();
      setIsLoaded(true);
    }, 0);

    const handleStorageChange = () => {
      loadWidgets();
    };

    window.addEventListener("dashboardWidgetsUpdated", handleStorageChange);
    return () =>
      window.removeEventListener(
        "dashboardWidgetsUpdated",
        handleStorageChange,
      );
  }, []);

  const updateWidgets = (newWidgets: Partial<DashboardWidgets>) => {
    const updated = { ...widgets, ...newWidgets };
    setWidgets(updated);
    localStorage.setItem("dashboardWidgets", JSON.stringify(updated));
    window.dispatchEvent(new Event("dashboardWidgetsUpdated"));
  };

  return { widgets, updateWidgets, isLoaded };
}
