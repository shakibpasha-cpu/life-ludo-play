import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FUNNEL_STEPS } from "@/lib/analytics";
import { BarChart3, MousePointerClick, Globe } from "lucide-react";

type EventRow = {
  id: string;
  session_id: string;
  event_name: string;
  page_path: string;
  source: string | null;
  created_at: string;
};

const RANGES = [
  { id: 7, label: "7 days" },
  { id: 30, label: "30 days" },
  { id: 90, label: "90 days" },
];

const EVENT_LABELS: Record<string, string> = {
  page_view: "Page views",
  cta_book_click: "Book CTA clicks",
  cta_demo_click: "Demo CTA clicks",
  demo_played: "Demo played",
  booking_form_start: "Booking form started",
  booking_submitted: "Bookings submitted",
  shop_order_click: "Shop order clicks",
  whatsapp_click: "WhatsApp clicks",
  contact_click: "Contact clicks",
};

const AnalyticsPanel = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const { data } = await supabase
        .from("analytics_events")
        .select("id, session_id, event_name, page_path, source, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);
      setEvents((data as EventRow[]) ?? []);
      setLoading(false);
    };
    load();
  }, [days]);

  const uniqueBy = (name: string) =>
    new Set(events.filter(e => e.event_name === name).map(e => e.session_id));

  const funnel = useMemo(() => {
    const top = uniqueBy(FUNNEL_STEPS[0].event).size || 0;
    return FUNNEL_STEPS.map(step => {
      const count = uniqueBy(step.event).size;
      return { ...step, count, pct: top ? Math.round((count / top) * 100) : 0 };
    });
  }, [events]);

  const byEvent = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach(e => map.set(e.event_name, (map.get(e.event_name) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [events]);

  /** Which pages produce bookings: booking/shop/whatsapp conversions attributed to the page they fired on. */
  const CONVERSION_EVENTS = ["booking_submitted", "shop_order_click", "whatsapp_click"];
  const byPage = useMemo(() => {
    const map = new Map<string, { views: Set<string>; conversions: number }>();
    events.forEach(e => {
      const key = e.page_path.split("#")[0] || "/";
      const row = map.get(key) ?? { views: new Set<string>(), conversions: 0 };
      if (e.event_name === "page_view") row.views.add(e.session_id);
      if (CONVERSION_EVENTS.includes(e.event_name)) row.conversions += 1;
      map.set(key, row);
    });
    return [...map.entries()]
      .map(([path, r]) => ({
        path,
        views: r.views.size,
        conversions: r.conversions,
        rate: r.views.size ? Math.round((r.conversions / r.views.size) * 100) : 0,
      }))
      .sort((a, b) => b.conversions - a.conversions || b.views - a.views);
  }, [events]);

  const bySource = useMemo(() => {
    const map = new Map<string, { sessions: Set<string>; bookings: number }>();
    events.forEach(e => {
      const key = e.source || "direct";
      const row = map.get(key) ?? { sessions: new Set<string>(), bookings: 0 };
      row.sessions.add(e.session_id);
      if (e.event_name === "booking_submitted") row.bookings += 1;
      map.set(key, row);
    });
    return [...map.entries()]
      .map(([source, r]) => ({ source, sessions: r.sessions.size, bookings: r.bookings }))
      .sort((a, b) => b.bookings - a.bookings || b.sessions - a.sessions)
      .slice(0, 8);
  }, [events]);

  if (loading) {
    return <p className="text-muted-foreground py-10 text-center">Loading analytics...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {events.length} tracked events · {new Set(events.map(e => e.session_id)).size} visitors
        </p>
        <div className="flex gap-1">
          {RANGES.map(r => (
            <button
              key={r.id}
              onClick={() => setDays(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                days === r.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Funnel */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" /> Conversion funnel
        </h3>
        <div className="space-y-3">
          {funnel.map(step => (
            <div key={step.event}>
              <div className="flex justify-between text-sm mb-1">
                <span>{step.label}</span>
                <span className="font-bold">{step.count} <span className="text-muted-foreground font-normal">({step.pct}%)</span></span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${step.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pages */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-bold mb-4">Pages generating bookings</h3>
          {byPage.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left font-medium pb-2">Page</th>
                  <th className="text-right font-medium pb-2">Visitors</th>
                  <th className="text-right font-medium pb-2">Conversions</th>
                  <th className="text-right font-medium pb-2">Rate</th>
                </tr>
              </thead>
              <tbody>
                {byPage.map(p => (
                  <tr key={p.path} className="border-t border-border/60">
                    <td className="py-2 truncate max-w-[160px]">{p.path}</td>
                    <td className="py-2 text-right">{p.views}</td>
                    <td className="py-2 text-right font-bold">{p.conversions}</td>
                    <td className="py-2 text-right text-primary">{p.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Sources */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Traffic sources
          </h3>
          {bySource.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {bySource.map(s => (
                <li key={s.source} className="flex justify-between border-t border-border/60 pt-2 first:border-0 first:pt-0">
                  <span className="truncate">{s.source}</span>
                  <span className="text-muted-foreground">{s.sessions} visitors · <span className="text-foreground font-bold">{s.bookings}</span> bookings</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Events */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">
          <MousePointerClick className="w-4 h-4 text-primary" /> Event breakdown
        </h3>
        {byEvent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events recorded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {byEvent.map(([name, count]) => (
              <div key={name} className="rounded-lg bg-secondary/60 p-3">
                <p className="text-xl font-display font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{EVENT_LABELS[name] ?? name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPanel;
