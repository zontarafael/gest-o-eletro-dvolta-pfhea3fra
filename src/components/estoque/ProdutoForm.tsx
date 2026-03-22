import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus } from 'lucide-react'

export function ProdutoForm({
  freteTotal,
  totalOutrosCusto,
  onAdd,
}: {
  freteTotal: number
  totalOutrosCusto: number
  onAdd: (p: any) => void
}) {
  const [busca, setBusca] = useState('')
  const [form, setForm] = useState({
    categoria: '',
    codCategoria: '',
    codProduto: '',
    codFabrica: '',
    marca: '',
    nome: '',
    capacidade: '',
    portas: '',
    cor: '',
    observacoes: '',
    voltagem: '',
    quantidade: 1,
    custoUnitario: 0,
    imposto1: 0,
    imposto2: 0,
  })

  const handleBusca = () => {
    if (busca.toLowerCase().includes('geladeira') || busca === '123') {
      setForm({
        ...form,
        categoria: 'Geladeira',
        codCategoria: 'GEL',
        codProduto: 'GEL-1001',
        codFabrica: 'FB-992',
        marca: 'Brastemp',
        nome: 'Geladeira Frost Free 400L',
        capacidade: '400L',
        portas: '2',
        voltagem: '220V',
        cor: 'Inox',
        custoUnitario: 2500,
      })
    }
  }

  const custoAtual = form.quantidade * form.custoUnitario
  const custoGeral = totalOutrosCusto + custoAtual
  const proporcao = custoGeral > 0 ? custoAtual / custoGeral : 0
  const freteUnitario = form.quantidade > 0 ? (freteTotal * proporcao) / form.quantidade : 0

  const handleAdd = () => {
    if (!form.nome || form.quantidade <= 0) return
    onAdd({ ...form, id: Date.now().toString() })
    setForm({
      categoria: '',
      codCategoria: '',
      codProduto: '',
      codFabrica: '',
      marca: '',
      nome: '',
      capacidade: '',
      portas: '',
      cor: '',
      observacoes: '',
      voltagem: '',
      quantidade: 1,
      custoUnitario: 0,
      imposto1: 0,
      imposto2: 0,
    })
    setBusca('')
  }

  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Produto / Item da Nota</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 w-full md:w-1/2">
          <Input
            placeholder="Buscar por Nome ou Código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="bg-[#F5F5F7] border-[#D1D1D1]"
          />
          <Button onClick={handleBusca} variant="secondary" className="border-[#D1D1D1]">
            <Search className="w-4 h-4 mr-2" /> Buscar
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label>Categoria</Label>
            <Select
              value={form.categoria}
              onValueChange={(v) => setForm({ ...form, categoria: v })}
            >
              <SelectTrigger className="bg-[#F5F5F7] border-[#D1D1D1]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {[
                  'Geladeira',
                  'Lava-louça',
                  'Secadora de roupas',
                  'Máquina de lavar roupas',
                  'Cervejeira',
                  'Adega',
                  'Purificador de água',
                  'Freezer',
                  'Ar condicionado',
                  'Cortina de ar',
                  'Coifa',
                ].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Cód. Categoria</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.codCategoria}
              onChange={(e) => setForm({ ...form, codCategoria: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Cód. Produto</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.codProduto}
              onChange={(e) => setForm({ ...form, codProduto: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Cód. Fábrica</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.codFabrica}
              onChange={(e) => setForm({ ...form, codFabrica: e.target.value })}
            />
          </div>

          <div className="space-y-1 lg:col-span-2">
            <Label>Nome do Produto</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Marca</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.marca}
              onChange={(e) => setForm({ ...form, marca: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Capacidade/Tamanho</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.capacidade}
              onChange={(e) => setForm({ ...form, capacidade: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label>Portas/Outros</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.portas}
              onChange={(e) => setForm({ ...form, portas: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Cor</Label>
            <Select value={form.cor} onValueChange={(v) => setForm({ ...form, cor: v })}>
              <SelectTrigger className="bg-[#F5F5F7] border-[#D1D1D1]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {[
                  'Inox',
                  'Inox Preto',
                  'Preto',
                  'Preto Fosco',
                  'Branco',
                  'Azul',
                  'Vermelha',
                  'Amarela',
                  'Cinza',
                  'Outros',
                ].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Voltagem</Label>
            <Select value={form.voltagem} onValueChange={(v) => setForm({ ...form, voltagem: v })}>
              <SelectTrigger className="bg-[#F5F5F7] border-[#D1D1D1]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {['110V', '220V', 'Automático'].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Qtd.</Label>
            <Input
              type="number"
              min="1"
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.quantidade}
              onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-1">
            <Label>Custo Unitário (R$)</Label>
            <Input
              type="number"
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.custoUnitario}
              onChange={(e) => setForm({ ...form, custoUnitario: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-1">
            <Label>Imposto 1 (%)</Label>
            <Input
              type="number"
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.imposto1}
              onChange={(e) => setForm({ ...form, imposto1: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-1">
            <Label>Imposto 2 (%)</Label>
            <Input
              type="number"
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.imposto2}
              onChange={(e) => setForm({ ...form, imposto2: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-1 lg:col-span-4">
            <Label>Observações</Label>
            <Input
              className="bg-[#F5F5F7] border-[#D1D1D1]"
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-[#D1D1D1] gap-4">
          <div className="text-sm font-semibold text-muted-foreground p-3 bg-[#F5F5F7] rounded-md border border-[#D1D1D1]">
            Frete Unitário Calculado:{' '}
            <span className="text-primary font-bold ml-1">R$ {freteUnitario.toFixed(2)}</span>
          </div>
          <Button onClick={handleAdd} className="gap-2 shadow-subtle w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Adicionar à Entrada
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
