CREATE TABLE IF NOT EXISTS public.empresa_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    razao_social TEXT,
    cnpj TEXT,
    email TEXT,
    telefone TEXT,
    endereco TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

ALTER TABLE public.empresa_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "empresa_config_select" ON public.empresa_config;
CREATE POLICY "empresa_config_select" ON public.empresa_config
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "empresa_config_insert" ON public.empresa_config;
CREATE POLICY "empresa_config_insert" ON public.empresa_config
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "empresa_config_update" ON public.empresa_config;
CREATE POLICY "empresa_config_update" ON public.empresa_config
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

INSERT INTO storage.buckets (id, name, public) 
VALUES ('empresa_logos', 'empresa_logos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Logos are publicly accessible" ON storage.objects;
CREATE POLICY "Logos are publicly accessible" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'empresa_logos');

DROP POLICY IF EXISTS "Users can upload logos" ON storage.objects;
CREATE POLICY "Users can upload logos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'empresa_logos');

DROP POLICY IF EXISTS "Users can update logos" ON storage.objects;
CREATE POLICY "Users can update logos" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'empresa_logos');

DROP POLICY IF EXISTS "Users can delete logos" ON storage.objects;
CREATE POLICY "Users can delete logos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'empresa_logos');
