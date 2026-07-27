CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  page_path TEXT NOT NULL DEFAULT '/',
  referrer TEXT,
  source TEXT,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record an analytics event"
ON public.analytics_events FOR INSERT TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL AND session_id <> ''
  AND event_name IS NOT NULL AND event_name <> ''
  AND length(event_name) <= 64
  AND length(page_path) <= 512
);

CREATE POLICY "Admins can view analytics events"
ON public.analytics_events FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_analytics_events_created_at ON public.analytics_events (created_at DESC);
CREATE INDEX idx_analytics_events_name ON public.analytics_events (event_name);
CREATE INDEX idx_analytics_events_page ON public.analytics_events (page_path);