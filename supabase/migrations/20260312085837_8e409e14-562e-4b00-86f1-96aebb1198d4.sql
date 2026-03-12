
CREATE TABLE public.forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  is_pinned boolean NOT NULL DEFAULT false,
  replies_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.liquidation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  liquidator_address text NOT NULL,
  borrower_address text NOT NULL,
  collateral_asset text NOT NULL,
  debt_asset text NOT NULL,
  debt_repaid numeric NOT NULL,
  collateral_seized numeric NOT NULL,
  bonus_earned numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liquidation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read forum threads" ON public.forum_threads FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert forum threads" ON public.forum_threads FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Authors can update own threads" ON public.forum_threads FOR UPDATE TO public USING (true);
CREATE POLICY "Authors can delete own threads" ON public.forum_threads FOR DELETE TO public USING (true);

CREATE POLICY "Anyone can read forum replies" ON public.forum_replies FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert forum replies" ON public.forum_replies FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Authors can delete own replies" ON public.forum_replies FOR DELETE TO public USING (true);

CREATE POLICY "Anyone can read liquidation log" ON public.liquidation_log FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert liquidation log" ON public.liquidation_log FOR INSERT TO public WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_thread_replies_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_threads SET replies_count = replies_count + 1, updated_at = now() WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_threads SET replies_count = replies_count - 1 WHERE id = OLD.thread_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_reply_change
AFTER INSERT OR DELETE ON public.forum_replies
FOR EACH ROW EXECUTE FUNCTION public.update_thread_replies_count();

CREATE TRIGGER update_forum_threads_updated_at
BEFORE UPDATE ON public.forum_threads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
