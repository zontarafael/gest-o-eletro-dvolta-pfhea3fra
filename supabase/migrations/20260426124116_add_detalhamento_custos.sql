DO $$
BEGIN
  ALTER TABLE public.produtos 
    ADD COLUMN IF NOT EXISTS despesas_detalhadas JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS impostos_detalhados JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS custo_final NUMERIC DEFAULT 0;
END $$;
