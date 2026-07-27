import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "hsl_session_id";
const SOURCE_KEY = "hsl_session_source";

/** Funnel steps, in order. Used by the CRM funnel report. */
export const FUNNEL_STEPS = [
  { event: "page_view", label: "Visited site" },
  { event: "booking_form_start", label: "Started booking form" },
  { event: "booking_submitted", label: "Submitted booking" },
] as const;

export type TrackableEvent =
  | "page_view"
  | "cta_book_click"
  | "cta_demo_click"
  | "demo_played"
  | "booking_form_start"
  | "booking_submitted"
  | "shop_order_click"
  | "whatsapp_click"
  | "contact_click";

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getSource(): string {
  if (typeof window === "undefined") return "direct";
  const stored = sessionStorage.getItem(SOURCE_KEY);
  if (stored) return stored;
  const params = new URLSearchParams(window.location.search);
  const utm = params.get("utm_source");
  let source = "direct";
  if (utm) source = utm.slice(0, 64);
  else if (document.referrer) {
    try {
      const host = new URL(document.referrer).hostname;
      if (host && host !== window.location.hostname) source = host;
    } catch { /* ignore malformed referrer */ }
  }
  sessionStorage.setItem(SOURCE_KEY, source);
  return source;
}

/** Fire-and-forget event tracking. Never blocks or breaks the UI. */
export async function trackEvent(
  event: TrackableEvent,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await supabase.from("analytics_events").insert({
      session_id: getSessionId(),
      event_name: event,
      page_path: `${window.location.pathname}${window.location.hash || ""}`.slice(0, 512),
      referrer: document.referrer ? document.referrer.slice(0, 512) : null,
      source: getSource(),
      metadata: metadata as never,
    });
  } catch {
    /* analytics must never surface errors to visitors */
  }
}

export function trackPageView(path: string) {
  return trackEvent("page_view", { path });
}
