import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/** Records a page_view on every route change (admin routes excluded). */
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/.lovable")) return;
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;
