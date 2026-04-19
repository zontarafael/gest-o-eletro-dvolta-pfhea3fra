import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function FornecedorForm({ onChange }: { onChange: (data: any) => void }) {
  const [busca, setBusca] = useState('')
  const [form, setForm] = useState<any>({
    nome: '',
    documento: '',
    rua: '',
    numero: '',
    bairro: '',
    referencia: '',
    cidade: '',
    estado: '',
    cep: '',
    email: '',
  })
  const [telefones, setTelefones] = useState<string[]>([''])

  const handleBusca = async () => {
    if (!busca) return
    const { data } = await supabase
      .from('fornecedores')
      .select('*')
      .or(`nome.ilike.%${busca}%,documento.ilike.%${busca}%`)
      .limit(1)
      .single()

    if (data) {
      setForm(data)
      const tels = data.telefones && data.telefones.length > 0 ? data.telefones : ['']
      setTelefones(tels)
      onChange({ ...data, telefones: tels })
    }
  }

  const updateForm = (field: string, value: string) => {
    const newForm = { ...form, [field]: value }
    setForm(newForm)
    onChange({ ...newForm, telefones })
  }

  const updateTelefones = (newTels: string[]) => {
    setTelefones(newTels)
    onChange({ ...form, telefones: newTels })
  }

  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Fornecedor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 w-full md:w-1/2">
          <Input
            placeholder="Buscar por Nome ou CPF/CNPJ..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBusca()}
            className="bg-[#F5F5F7] border-[#D1D1D1]"
          />
          <Button
            type="button"
            onClick={handleBusca}
            variant="secondary"
            className="border-[#D1D1D1]"
          >
            <Search className="w-4 h-4 mr-2" /> Buscar
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label>Nome</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.nome}
              onChange={(e) => updateForm('nome', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>CPF/CNPJ</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.documento}
              onChange={(e) => updateForm('documento', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>E-mail</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>CEP</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.cep}
              onChange={(e) => updateForm('cep', e.target.value)}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Rua</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.rua}
              onChange={(e) => updateForm('rua', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Número</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.numero}
              onChange={(e) => updateForm('numero', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Bairro</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.bairro}
              onChange={(e) => updateForm('bairro', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Cidade</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.cidade}
              onChange={(e) => updateForm('cidade', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Estado</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.estado}
              onChange={(e) => updateForm('estado', e.target.value)}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Referência</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.referencia}
              onChange={(e) => updateForm('referencia', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Telefones</Label>
          <div className="flex flex-col gap-2">
            {telefones.map((t, idx) => (
              <div key={idx} className="flex gap-2 w-full md:w-1/3">
                <Input
                  className="bg-[#F5F5F7] border-[#D1D1D1]"
                  value={t}
                  onChange={(e) => {
                    const n = [...telefones]
                    n[idx] = e.target.value
                    updateTelefones(n)
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0 border-[#D1D1D1]"
                  onClick={() => {
                    const n = telefones.filter((_, i) => i !== idx)
                    updateTelefones(n.length ? n : [''])
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => updateTelefones([...telefones, ''])}
            className="text-muted-foreground"
          >
            <Plus className="w-4 h-4 mr-2" /> Adicionar Telefone
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
