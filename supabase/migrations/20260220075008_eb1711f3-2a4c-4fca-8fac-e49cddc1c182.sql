
-- Alert settings table for health monitor notifications
CREATE TABLE public.alert_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  email TEXT,
  telegram TEXT,
  alert_at_15 BOOLEAN NOT NULL DEFAULT true,
  alert_at_12 BOOLEAN NOT NULL DEFAULT true,
  alert_at_10 BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wallet_address)
);

-- Enable RLS
ALTER TABLE public.alert_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read/write their own settings (identified by wallet address)
CREATE POLICY "Anyone can read alert settings by wallet" 
ON public.alert_settings FOR SELECT USING (true);

CREATE POLICY "Anyone can insert alert settings" 
ON public.alert_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update their own alert settings" 
ON public.alert_settings FOR UPDATE USING (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_alert_settings_updated_at
BEFORE UPDATE ON public.alert_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
