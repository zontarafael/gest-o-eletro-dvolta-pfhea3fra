import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Package, Check, ChevronsUpDown } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

export function ProdutosSection({
  produtos,
  onChange,
}: {
  produtos?: any[]
  onChange?: (p: any[]) => void
}) {
  const [tipoProduto, setTipoProduto] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [produtosList, setProdutosList] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  const [selectedProducts, setSelectedProducts] = useState<any[]>([])

  useEffect(() => {
    if (produtos && produtos.length > 0 && selectedProducts.length === 0) {
      setSelectedProducts(produtos)
    }
  }, [produtos, selectedProducts.length])

  useEffect(() => {
    if (!open) return
    const fetchProdutos = async () => {
      let query = supabase.from('produtos').select('*').limit(20)
      if (search) {
        query = query.ilike('nome', `%${search}%`)
      }
      const { data } = await query
      setProdutosList(data || [])
    }
    const timer = setTimeout(fetchProdutos, 300)
    return () => clearTimeout(timer)
  }, [search, open])

  const handleAddProduct = () => {
    if (!selectedProduct && !search.trim()) return

    let newP
    if (selectedProduct) {
      const maxQtd = selectedProduct.quantidade || 0
      newP = {
        id: selectedProduct.id,
        nome: selectedProduct.nome,
        preco: Number(selectedProduct.preco_venda || selectedProduct.custo_unitario * 1.5 || 0),
        qtd: maxQtd > 0 ? 1 : 0,
        tipo: tipoProduto,
        key: Date.now(),
        estoque: maxQtd,
      }
    } else {
      newP = {
        id: 'N/A',
        nome: search,
        preco: 0,
        qtd: 1,
        tipo: tipoProduto,
        key: Date.now(),
        estoque: 999999,
      }
    }

    const newList = [...selectedProducts, newP]
    updateList(newList)
    setSearch('')
    setSelectedProduct(null)
    setTipoProduto('') // Reseta a natureza para forçar a escolha no próximo item
  }

  const updateList = (newList: any[]) => {
    setSelectedProducts(newList)
    if (onChange) onChange(newList)
  }

  const handleRemoveProduct = (key: number) => {
    updateList(selectedProducts.filter((p) => p.key !== key))
  }

  const updateQtd = (key: number, val: string) => {
    updateList(
      selectedProducts.map((p) => {
        if (p.key !== key) return p
        const maxQtd = p.id !== 'N/A' && p.estoque !== undefined ? p.estoque : 999999
        if (val === '') return { ...p, qtd: '' }
        let parsed = parseInt(val, 10)
        if (isNaN(parsed)) return { ...p, qtd: '' }
        return { ...p, qtd: Math.min(Math.max(0, parsed), maxQtd) }
      }),
    )
  }

  const updatePreco = (key: number, val: string) => {
    updateList(
      selectedProducts.map((p) => {
        if (p.key === key) {
          if (val === '') return { ...p, preco: '' }
          const parsed = parseFloat(val)
          return { ...p, preco: isNaN(parsed) ? '' : Math.max(0, parsed) }
        }
        return p
      }),
    )
  }

  const total = selectedProducts.reduce(
    (acc, p) => acc + (Number(p.preco) || 0) * (Number(p.qtd) || 0),
    0,
  )

  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="w-5 h-5 text-primary" /> 2. Produtos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1">
            <Label>Natureza do Produto</Label>
            <Select value={tipoProduto} onValueChange={setTipoProduto}>
              <SelectTrigger className="bg-[#F5F5F7] border-[#D1D1D1]">
                <SelectValue placeholder="Selecione a natureza..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Produto Novo">Produto Novo</SelectItem>
                <SelectItem value="Produto com Avaria">Produto com Avaria</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-[2]">
            <Label>Buscar Produto no Estoque</Label>
            <Popover
              open={open}
              onOpenChange={(val) => {
                if (tipoProduto) setOpen(val)
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    'w-full justify-between bg-[#F5F5F7] border-[#D1D1D1]',
                    !selectedProduct && 'text-muted-foreground',
                  )}
                  disabled={!tipoProduto}
                >
                  {selectedProduct ? selectedProduct.nome : 'Selecione ou digite um produto...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] md:w-[500px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Digite o nome do produto..."
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <div className="p-4 text-center text-sm text-muted-foreground flex flex-col gap-2">
                        <span>Nenhum produto encontrado.</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setOpen(false)
                            setSelectedProduct(null)
                          }}
                        >
                          Usar "{search}" como produto não cadastrado
                        </Button>
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {produtosList.map((produto) => (
                        <CommandItem
                          key={produto.id}
                          value={produto.nome}
                          onSelect={() => {
                            setSelectedProduct(produto)
                            setSearch('')
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedProduct?.id === produto.id ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          <span className="flex-1 truncate">{produto.nome}</span>
                          <span className="ml-2 text-xs text-muted-foreground shrink-0">
                            Estoque: {produto.quantidade || 0}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            type="button"
            onClick={handleAddProduct}
            disabled={!tipoProduto || (!selectedProduct && !search.trim())}
            className="gap-2 w-full md:w-auto shadow-sm"
          >
            <Plus className="w-4 h-4" /> Adicionar
          </Button>
        </div>

        {selectedProducts.length > 0 && (
          <div className="rounded-md border border-[#D1D1D1] overflow-hidden animate-fade-in">
            <Table>
              <TableHeader className="bg-[#F5F5F7]">
                <TableRow className="border-[#D1D1D1]">
                  <TableHead className="font-semibold text-foreground">Produto</TableHead>
                  <TableHead className="font-semibold text-foreground">Natureza</TableHead>
                  <TableHead className="w-32 font-semibold text-foreground">Qtd</TableHead>
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
                    <TableCell className="text-muted-foreground text-sm">{p.tipo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          max={p.estoque}
                          value={p.qtd}
                          onChange={(e) => updateQtd(p.key, e.target.value)}
                          onBlur={(e) => {
                            if (p.qtd === '' || Number(p.qtd) < 1) {
                              updateQtd(p.key, '1')
                            }
                          }}
                          className="h-8 w-16 bg-[#F5F5F7] border-[#D1D1D1] px-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {p.id !== 'N/A' && p.estoque !== undefined && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            / {p.estoque}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={p.preco}
                        onChange={(e) => updatePreco(p.key, e.target.value)}
                        onBlur={(e) => {
                          if (p.preco === '') updatePreco(p.key, '0')
                        }}
                        className="h-8 bg-[#F5F5F7] border-[#D1D1D1] px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </TableCell>
                    <TableCell className="font-bold text-primary">
                      R$ {((Number(p.preco) || 0) * (Number(p.qtd) || 0)).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
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
