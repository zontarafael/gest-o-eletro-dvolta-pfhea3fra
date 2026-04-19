DO $$
BEGIN
  -- Tables
  CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.fornecedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    documento TEXT,
    rua TEXT,
    numero TEXT,
    bairro TEXT,
    referencia TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    email TEXT,
    telefones JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    codigo TEXT,
    cod_categoria TEXT,
    cod_fabrica TEXT,
    marca TEXT,
    nome TEXT NOT NULL,
    categoria TEXT,
    capacidade TEXT,
    portas TEXT,
    cor TEXT,
    voltagem TEXT,
    observacoes TEXT,
    quantidade INTEGER DEFAULT 0,
    custo_unitario NUMERIC(10,2) DEFAULT 0,
    imposto1 NUMERIC(10,2) DEFAULT 0,
    imposto2 NUMERIC(10,2) DEFAULT 0,
    valor_frete_unitario NUMERIC(10,2) DEFAULT 0,
    status TEXT DEFAULT 'Normal',
    fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    documento TEXT,
    rua TEXT,
    numero TEXT,
    bairro TEXT,
    referencia TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    email TEXT,
    telefones JSONB DEFAULT '[]'::jsonb,
    total_gasto NUMERIC(10,2) DEFAULT 0,
    status TEXT DEFAULT 'Ativo',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.vendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    codigo TEXT NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE RESTRICT,
    valor_total NUMERIC(10,2) DEFAULT 0,
    status TEXT DEFAULT 'Em Processamento',
    forma_pagamento TEXT,
    assinatura_digital BOOLEAN DEFAULT false,
    data_venda TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.venda_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venda_id UUID REFERENCES public.vendas(id) ON DELETE CASCADE NOT NULL,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE RESTRICT,
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS public.movimentacoes_financeiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    descricao TEXT NOT NULL,
    tipo TEXT NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'Pendente',
    data_movimentacao TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- RLS Enable
  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.venda_itens ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.movimentacoes_financeiras ENABLE ROW LEVEL SECURITY;
END $$;

-- Policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "profiles_policy" ON public.profiles;
  DROP POLICY IF EXISTS "fornecedores_policy" ON public.fornecedores;
  DROP POLICY IF EXISTS "produtos_policy" ON public.produtos;
  DROP POLICY IF EXISTS "clientes_policy" ON public.clientes;
  DROP POLICY IF EXISTS "vendas_policy" ON public.vendas;
  DROP POLICY IF EXISTS "venda_itens_policy" ON public.venda_itens;
  DROP POLICY IF EXISTS "financeiro_policy" ON public.movimentacoes_financeiras;

  CREATE POLICY "profiles_policy" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  CREATE POLICY "fornecedores_policy" ON public.fornecedores FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "produtos_policy" ON public.produtos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "clientes_policy" ON public.clientes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "vendas_policy" ON public.vendas FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "venda_itens_policy" ON public.venda_itens FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "financeiro_policy" ON public.movimentacoes_financeiras FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
END $$;

-- Seed User & Data
DO $$
DECLARE
  admin_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'zontarafael@yahoo.com.br') THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      admin_id, '00000000-0000-0000-0000-000000000000', 'zontarafael@yahoo.com.br',
      crypt('Skip@Pass', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Admin Eletro DVolta"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.profiles (id, email, name, is_admin)
    VALUES (admin_id, 'zontarafael@yahoo.com.br', 'Admin Eletro DVolta', true)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.fornecedores (id, user_id, nome, documento, email, telefones)
    VALUES ('f1111111-1111-1111-1111-111111111111'::uuid, admin_id, 'Eletro Fornecedor S.A', '12.345.678/0001-90', 'contato@eletro.com', '["(11) 4002-8922"]'::jsonb)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.produtos (id, user_id, nome, codigo, categoria, quantidade, custo_unitario, status, fornecedor_id)
    VALUES 
      ('p1111111-1111-1111-1111-111111111111'::uuid, admin_id, 'Smart TV 55" OLED', 'PRD-001', 'Eletrônicos', 45, 3500.00, 'Normal', 'f1111111-1111-1111-1111-111111111111'::uuid),
      ('p2222222-2222-2222-2222-222222222222'::uuid, admin_id, 'Ar Condicionado 12000 BTUs', 'PRD-004', 'Eletrodomésticos', 2, 2200.00, 'Crítico', 'f1111111-1111-1111-1111-111111111111'::uuid)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.clientes (id, user_id, nome, documento, email, telefones, total_gasto)
    VALUES 
      ('c1111111-1111-1111-1111-111111111111'::uuid, admin_id, 'João Silva', '111.111.111-11', 'joao@email.com', '["(11) 99999-9999"]'::jsonb, 4500.00),
      ('c2222222-2222-2222-2222-222222222222'::uuid, admin_id, 'Empresa X Ltda', '22.222.222/0001-22', 'compras@empresax.com', '["(11) 4002-8922"]'::jsonb, 24000.00)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.vendas (id, user_id, codigo, cliente_id, valor_total, status, forma_pagamento)
    VALUES 
      ('v1111111-1111-1111-1111-111111111111'::uuid, admin_id, 'PED-001', 'c1111111-1111-1111-1111-111111111111'::uuid, 1500.00, 'Concluído', 'vista'),
      ('v2222222-2222-2222-2222-222222222222'::uuid, admin_id, 'PED-002', 'c2222222-2222-2222-2222-222222222222'::uuid, 8900.00, 'Em Processamento', 'credito1x')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.movimentacoes_financeiras (id, user_id, descricao, tipo, valor, status)
    VALUES 
      ('m1111111-1111-1111-1111-111111111111'::uuid, admin_id, 'Recebimento NF 1024 (Empresa X)', 'Receita', 12300.00, 'Liquidado'),
      ('m2222222-2222-2222-2222-222222222222'::uuid, admin_id, 'Conta de Energia Elétrica', 'Despesa', 850.00, 'Liquidado')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
