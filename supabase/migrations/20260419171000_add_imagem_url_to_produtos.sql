ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS imagem_url TEXT;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('produtos', 'produtos', true) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects 
  FOR SELECT USING (bucket_id = 'produtos');

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload" ON storage.objects 
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'produtos');

DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
CREATE POLICY "Authenticated users can update" ON storage.objects 
  FOR UPDATE TO authenticated USING (bucket_id = 'produtos');
