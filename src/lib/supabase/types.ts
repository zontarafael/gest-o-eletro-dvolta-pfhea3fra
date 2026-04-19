// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          created_at: string | null
          documento: string | null
          email: string | null
          estado: string | null
          id: string
          nome: string
          numero: string | null
          referencia: string | null
          rua: string | null
          status: string | null
          telefones: Json | null
          total_gasto: number | null
          user_id: string
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          documento?: string | null
          email?: string | null
          estado?: string | null
          id?: string
          nome: string
          numero?: string | null
          referencia?: string | null
          rua?: string | null
          status?: string | null
          telefones?: Json | null
          total_gasto?: number | null
          user_id: string
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          documento?: string | null
          email?: string | null
          estado?: string | null
          id?: string
          nome?: string
          numero?: string | null
          referencia?: string | null
          rua?: string | null
          status?: string | null
          telefones?: Json | null
          total_gasto?: number | null
          user_id?: string
        }
        Relationships: []
      }
      fornecedores: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          created_at: string | null
          documento: string | null
          email: string | null
          estado: string | null
          id: string
          nome: string
          numero: string | null
          referencia: string | null
          rua: string | null
          telefones: Json | null
          user_id: string
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          documento?: string | null
          email?: string | null
          estado?: string | null
          id?: string
          nome: string
          numero?: string | null
          referencia?: string | null
          rua?: string | null
          telefones?: Json | null
          user_id: string
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          documento?: string | null
          email?: string | null
          estado?: string | null
          id?: string
          nome?: string
          numero?: string | null
          referencia?: string | null
          rua?: string | null
          telefones?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      movimentacoes_financeiras: {
        Row: {
          created_at: string | null
          data_movimentacao: string | null
          descricao: string
          id: string
          status: string | null
          tipo: string
          user_id: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_movimentacao?: string | null
          descricao: string
          id?: string
          status?: string | null
          tipo: string
          user_id: string
          valor: number
        }
        Update: {
          created_at?: string | null
          data_movimentacao?: string | null
          descricao?: string
          id?: string
          status?: string | null
          tipo?: string
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      produtos: {
        Row: {
          capacidade: string | null
          categoria: string | null
          cod_categoria: string | null
          cod_fabrica: string | null
          codigo: string | null
          cor: string | null
          created_at: string | null
          custo_unitario: number | null
          fornecedor_id: string | null
          id: string
          imposto1: number | null
          imposto2: number | null
          marca: string | null
          nome: string
          observacoes: string | null
          portas: string | null
          quantidade: number | null
          status: string | null
          user_id: string
          valor_frete_unitario: number | null
          voltagem: string | null
        }
        Insert: {
          capacidade?: string | null
          categoria?: string | null
          cod_categoria?: string | null
          cod_fabrica?: string | null
          codigo?: string | null
          cor?: string | null
          created_at?: string | null
          custo_unitario?: number | null
          fornecedor_id?: string | null
          id?: string
          imposto1?: number | null
          imposto2?: number | null
          marca?: string | null
          nome: string
          observacoes?: string | null
          portas?: string | null
          quantidade?: number | null
          status?: string | null
          user_id: string
          valor_frete_unitario?: number | null
          voltagem?: string | null
        }
        Update: {
          capacidade?: string | null
          categoria?: string | null
          cod_categoria?: string | null
          cod_fabrica?: string | null
          codigo?: string | null
          cor?: string | null
          created_at?: string | null
          custo_unitario?: number | null
          fornecedor_id?: string | null
          id?: string
          imposto1?: number | null
          imposto2?: number | null
          marca?: string | null
          nome?: string
          observacoes?: string | null
          portas?: string | null
          quantidade?: number | null
          status?: string | null
          user_id?: string
          valor_frete_unitario?: number | null
          voltagem?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          is_admin?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          name?: string
        }
        Relationships: []
      }
      venda_itens: {
        Row: {
          id: string
          preco_unitario: number
          produto_id: string | null
          quantidade: number
          subtotal: number
          venda_id: string
        }
        Insert: {
          id?: string
          preco_unitario: number
          produto_id?: string | null
          quantidade: number
          subtotal: number
          venda_id: string
        }
        Update: {
          id?: string
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          subtotal?: number
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venda_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venda_itens_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      vendas: {
        Row: {
          assinatura_digital: boolean | null
          cliente_id: string | null
          codigo: string
          created_at: string | null
          data_venda: string | null
          forma_pagamento: string | null
          id: string
          status: string | null
          user_id: string
          valor_total: number | null
        }
        Insert: {
          assinatura_digital?: boolean | null
          cliente_id?: string | null
          codigo: string
          created_at?: string | null
          data_venda?: string | null
          forma_pagamento?: string | null
          id?: string
          status?: string | null
          user_id: string
          valor_total?: number | null
        }
        Update: {
          assinatura_digital?: boolean | null
          cliente_id?: string | null
          codigo?: string
          created_at?: string | null
          data_venda?: string | null
          forma_pagamento?: string | null
          id?: string
          status?: string | null
          user_id?: string
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: clientes
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   nome: text (not null)
//   documento: text (nullable)
//   rua: text (nullable)
//   numero: text (nullable)
//   bairro: text (nullable)
//   referencia: text (nullable)
//   cidade: text (nullable)
//   estado: text (nullable)
//   cep: text (nullable)
//   email: text (nullable)
//   telefones: jsonb (nullable, default: '[]'::jsonb)
//   total_gasto: numeric (nullable, default: 0)
//   status: text (nullable, default: 'Ativo'::text)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: fornecedores
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   nome: text (not null)
//   documento: text (nullable)
//   rua: text (nullable)
//   numero: text (nullable)
//   bairro: text (nullable)
//   referencia: text (nullable)
//   cidade: text (nullable)
//   estado: text (nullable)
//   cep: text (nullable)
//   email: text (nullable)
//   telefones: jsonb (nullable, default: '[]'::jsonb)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: movimentacoes_financeiras
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   descricao: text (not null)
//   tipo: text (not null)
//   valor: numeric (not null)
//   status: text (nullable, default: 'Pendente'::text)
//   data_movimentacao: timestamp with time zone (nullable, default: now())
//   created_at: timestamp with time zone (nullable, default: now())
// Table: produtos
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   codigo: text (nullable)
//   cod_categoria: text (nullable)
//   cod_fabrica: text (nullable)
//   marca: text (nullable)
//   nome: text (not null)
//   categoria: text (nullable)
//   capacidade: text (nullable)
//   portas: text (nullable)
//   cor: text (nullable)
//   voltagem: text (nullable)
//   observacoes: text (nullable)
//   quantidade: integer (nullable, default: 0)
//   custo_unitario: numeric (nullable, default: 0)
//   imposto1: numeric (nullable, default: 0)
//   imposto2: numeric (nullable, default: 0)
//   valor_frete_unitario: numeric (nullable, default: 0)
//   status: text (nullable, default: 'Normal'::text)
//   fornecedor_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: profiles
//   id: uuid (not null)
//   email: text (not null)
//   name: text (not null)
//   is_admin: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: venda_itens
//   id: uuid (not null, default: gen_random_uuid())
//   venda_id: uuid (not null)
//   produto_id: uuid (nullable)
//   quantidade: integer (not null)
//   preco_unitario: numeric (not null)
//   subtotal: numeric (not null)
// Table: vendas
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   codigo: text (not null)
//   cliente_id: uuid (nullable)
//   valor_total: numeric (nullable, default: 0)
//   status: text (nullable, default: 'Em Processamento'::text)
//   forma_pagamento: text (nullable)
//   assinatura_digital: boolean (nullable, default: false)
//   data_venda: timestamp with time zone (nullable, default: now())
//   created_at: timestamp with time zone (nullable, default: now())

// --- CONSTRAINTS ---
// Table: clientes
//   PRIMARY KEY clientes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY clientes_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: fornecedores
//   PRIMARY KEY fornecedores_pkey: PRIMARY KEY (id)
//   FOREIGN KEY fornecedores_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: movimentacoes_financeiras
//   PRIMARY KEY movimentacoes_financeiras_pkey: PRIMARY KEY (id)
//   FOREIGN KEY movimentacoes_financeiras_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: produtos
//   FOREIGN KEY produtos_fornecedor_id_fkey: FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE SET NULL
//   PRIMARY KEY produtos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY produtos_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: venda_itens
//   PRIMARY KEY venda_itens_pkey: PRIMARY KEY (id)
//   FOREIGN KEY venda_itens_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
//   FOREIGN KEY venda_itens_venda_id_fkey: FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE
// Table: vendas
//   FOREIGN KEY vendas_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT
//   PRIMARY KEY vendas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY vendas_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: clientes
//   Policy "clientes_policy" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: fornecedores
//   Policy "fornecedores_policy" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: movimentacoes_financeiras
//   Policy "financeiro_policy" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: produtos
//   Policy "produtos_policy" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)
// Table: profiles
//   Policy "profiles_policy" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//     WITH CHECK: (auth.uid() = id)
// Table: venda_itens
//   Policy "venda_itens_policy" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: vendas
//   Policy "vendas_policy" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//     WITH CHECK: (auth.uid() = user_id)

