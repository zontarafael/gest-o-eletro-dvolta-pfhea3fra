import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Package } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const MOCK_PRODUCTS = [
  { id: 'PRD-001', nome: 'Smart TV 55" OLED', preco: 3500 },
  { id: 'PRD-002', nome: 'Notebook Pro 15', preco: 7500 },
  { id: 'PRD-003', nome: 'Cabo HDMI 2m', preco: 45 },
  { id: 'PRD-004', nome: 'Ar Condicionado 12000 BTUs', preco: 2200 },
  { id: 'PRD-005', nome: 'Monitor Curvo 27"', preco: 1800 },
]

export function ProdutosSection() {
  const [search, setSearch] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])

  const handleAddProduct = () => {
    if (!search.trim()) return

    const found = MOCK_PRODUCTS.find((p) => p.nome.toLowerCase().includes(search.toLowerCase()))
    if (found) {
      setSelectedProducts([...selectedProducts, { ...found, qtd: 1, key: Date.now() }])
    } else {
      setSelectedProducts([
        ...selectedProducts,
        { id: 'N/A', nome: search, preco: 0, qtd: 1, key: Date.now() },
      ])
    }
    setSearch('')
  }

  const handleRemoveProduct = (key: number) => {
    setSelectedProducts(selectedProducts.filter((p) => p.key !== key))
  }

  const updateQtd = (key: number, qtd: number) => {
    setSelectedProducts(
      selectedProducts.map((p) => (p.key === key ? { ...p, qtd: Math.max(1, qtd) } : p)),
    )
  }

  const updatePreco = (key: number, preco: number) => {
    setSelectedProducts(
      selectedProducts.map((p) => (p.key === key ? { ...p, preco: Math.max(0, preco) } : p)),
    )
  }

  const total = selectedProducts.reduce((acc, p) => acc + p.preco * p.qtd, 0)

  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="w-5 h-5 text-primary" /> 2. Produtos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-2 items-end">
          <div className="space-y-2 flex-1 w-full">
            <Label>Buscar Produto</Label>
            <Input
              placeholder="Digite o nome do produto e tecle Enter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddProduct()}
              className="bg-[#F5F5F7] border-[#D1D1D1]"
            />
          </div>
          <Button onClick={handleAddProduct} className="gap-2 w-full sm:w-auto shadow-sm">
            <Plus className="w-4 h-4" /> Adicionar
          </Button>
        </div>

        {selectedProducts.length > 0 && (
          <div className="rounded-md border border-[#D1D1D1] overflow-hidden animate-fade-in">
            <Table>
              <TableHeader className="bg-[#F5F5F7]">
                <TableRow className="border-[#D1D1D1]">
                  <TableHead className="font-semibold text-foreground">Produto</TableHead>
                  <TableHead className="w-24 font-semibold text-foreground">Qtd</TableHead>
                  <TableHead className="w-40 font-semibold text-foreground">
                    Preço Un. (R$)
                  </TableHead>
                  <TableHead className="w-32 font-semibold text-foreground">Subtotal</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProducts.map((p) => (
                  <TableRow key={p.key} className="border-[#D1D1D1]">
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={1}
                        value={p.qtd}
                        onChange={(e) => updateQtd(p.key, parseInt(e.target.value) || 1)}
                        className="h-8 bg-[#F5F5F7] border-[#D1D1D1] px-2 text-center"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={p.preco}
                        onChange={(e) => updatePreco(p.key, parseFloat(e.target.value) || 0)}
                        className="h-8 bg-[#F5F5F7] border-[#D1D1D1] px-2"
                      />
                    </TableCell>
                    <TableCell className="font-bold text-primary">
                      R$ {(p.preco * p.qtd).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveProduct(p.key)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 bg-[#F5F5F7]/80 flex justify-end items-center border-t border-[#D1D1D1]">
              <span className="text-sm font-semibold text-muted-foreground mr-4 uppercase tracking-wider">
                Total do Pedido:
              </span>
              <span className="text-2xl font-bold text-foreground">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
