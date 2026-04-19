import { useState, useEffect, useRef } from 'react'
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
import { Search, Plus, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function ProdutoForm({
  freteTotal,
  totalOutrosCusto,
  onAdd,
}: {
  freteTotal: number
  totalOutrosCusto: number
  onAdd: (p: any) => void
}) {
  const { toast } = useToast()
  const [busca, setBusca] = useState('')
  const [produtoEncontrado, setProdutoEncontrado] = useState<any>(null)
  const [uploading, setUploading] = useState(false)

  const CATEGORY_MAP: Record<string, string> = {
    Geladeira: 'GEL',
    'Lava-louça': 'LAV',
    'Secadora de roupas': 'SEC',
    'Máquina de lavar roupas': 'MLR',
    Cervejeira: 'CER',
    Adega: 'ADE',
    'Purificador de água': 'PUR',
    Freezer: 'FRZ',
    'Ar condicionado': 'ARC',
    'Cortina de ar': 'CTA',
    Coifa: 'COI',
  }

  const defaultForm = {
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
    imagemUrl: '',
  }

  const [form, setForm] = useState(defaultForm)
  const [isNovaCategoria, setIsNovaCategoria] = useState(false)
  const [sugestoes, setSugestoes] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSugestoes, setShowSugestoes] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSugestoes(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSugestoes = async () => {
      if (busca.trim().length < 2) {
        setSugestoes([])
        setShowSugestoes(false)
        return
      }

      setIsSearching(true)
      const { data } = await supabase
        .from('produtos')
        .select('*')
        .or(`nome.ilike.%${busca}%,codigo.ilike.%${busca}%`)
        .limit(10)

      if (data && data.length > 0) {
        setSugestoes(data)
        setShowSugestoes(true)
      } else {
        setSugestoes([])
        setShowSugestoes(true)
      }
      setIsSearching(false)
    }

    const timeoutId = setTimeout(fetchSugestoes, 300)
    return () => clearTimeout(timeoutId)
  }, [busca])

  const selecionarProduto = (produto: any) => {
    setProdutoEncontrado(produto)
    const isKnownCat = produto.categoria
      ? Object.keys(CATEGORY_MAP).includes(produto.categoria)
      : false
    if (produto.categoria && !isKnownCat) {
      setIsNovaCategoria(true)
    } else {
      setIsNovaCategoria(false)
    }
    setForm({
      ...form,
      categoria: produto.categoria || '',
      codCategoria: produto.cod_categoria || '',
      codProduto: produto.codigo || '',
      codFabrica: produto.cod_fabrica || '',
      marca: produto.marca || '',
      nome: produto.nome || '',
      capacidade: produto.capacidade || '',
      portas: produto.portas || '',
      cor: produto.cor || '',
      observacoes: produto.observacoes || '',
      voltagem: produto.voltagem || '',
      custoUnitario: Number(produto.custo_unitario) || 0,
      imposto1: Number(produto.imposto1) || 0,
      imposto2: Number(produto.imposto2) || 0,
      imagemUrl: produto.imagem_url || '',
    })
    setBusca('')
    setShowSugestoes(false)
  }

  const handleBusca = async () => {
    if (!busca) return
    const { data } = await supabase
      .from('produtos')
      .select('*')
      .or(`nome.ilike.%${busca}%,codigo.ilike.%${busca}%`)
      .limit(1)
      .single()

    if (data) {
      setProdutoEncontrado(data)
      const isKnownCat = data.categoria ? Object.keys(CATEGORY_MAP).includes(data.categoria) : false
      if (data.categoria && !isKnownCat) {
        setIsNovaCategoria(true)
      } else {
        setIsNovaCategoria(false)
      }
      setForm({
        ...form,
        categoria: data.categoria || '',
        codCategoria: data.cod_categoria || '',
        codProduto: data.codigo || '',
        codFabrica: data.cod_fabrica || '',
        marca: data.marca || '',
        nome: data.nome || '',
        capacidade: data.capacidade || '',
        portas: data.portas || '',
        cor: data.cor || '',
        observacoes: data.observacoes || '',
        voltagem: data.voltagem || '',
        custoUnitario: Number(data.custo_unitario) || 0,
        imposto1: Number(data.imposto1) || 0,
        imposto2: Number(data.imposto2) || 0,
        imagemUrl: data.imagem_url || '',
      })
    } else {
      toast({
        title: 'Não encontrado',
        description: 'Produto não localizado na base.',
        variant: 'destructive',
      })
      setProdutoEncontrado(null)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('produtos').upload(fileName, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('produtos').getPublicUrl(fileName)

      if (produtoEncontrado?.id) {
        await supabase
          .from('produtos')
          .update({ imagem_url: publicUrl })
          .eq('id', produtoEncontrado.id)
      }

      setForm((prev) => ({ ...prev, imagemUrl: publicUrl }))
      toast({ title: 'Sucesso', description: 'Foto carregada com sucesso!' })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload da foto',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const custoAtual = form.quantidade * form.custoUnitario
  const custoGeral = totalOutrosCusto + custoAtual
  const proporcao = custoGeral > 0 ? custoAtual / custoGeral : 0
  const freteUnitario = form.quantidade > 0 ? (freteTotal * proporcao) / form.quantidade : 0

  const handleAdd = () => {
    if (!form.nome || form.quantidade <= 0) return
    onAdd({ ...form, id: Date.now().toString() })
    setForm(defaultForm)
    setBusca('')
    setProdutoEncontrado(null)
    setIsNovaCategoria(false)
  }

  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Produto / Item da Nota</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div className="w-32 h-32 border border-[#D1D1D1] rounded-lg overflow-hidden bg-[#F5F5F7] flex items-center justify-center relative group">
              {form.imagemUrl ? (
                <img src={form.imagemUrl} alt="Produto" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50 p-2 text-center">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span className="text-xs font-medium leading-tight">Sem Foto</span>
                </div>
              )}
            </div>
            <div className="relative w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs h-8 border-[#D1D1D1] shadow-subtle"
                disabled={uploading}
              >
                {uploading ? 'Enviando...' : form.imagemUrl ? 'Trocar Foto' : 'Adicionar Foto'}
              </Button>
              <Input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onChange={handleFileUpload}
                disabled={uploading}
                title="Adicionar ou trocar foto"
              />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex gap-2 w-full lg:w-1/2 relative" ref={wrapperRef}>
              <div className="relative w-full">
                <Input
                  placeholder="Buscar por Nome ou Código..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBusca()}
                  onFocus={() => {
                    if (busca.trim().length >= 2) setShowSugestoes(true)
                  }}
                  className="bg-[#F5F5F7] border-[#D1D1D1] w-full"
                />
                {showSugestoes && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#D1D1D1] rounded-md shadow-lg max-h-60 overflow-auto">
                    {isSearching ? (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        Buscando...
                      </div>
                    ) : sugestoes.length > 0 ? (
                      <ul className="py-1">
                        {sugestoes.map((prod) => (
                          <li
                            key={prod.id}
                            onClick={() => selecionarProduto(prod)}
                            className="px-3 py-2 hover:bg-[#F5F5F7] cursor-pointer text-sm flex flex-col transition-colors"
                          >
                            <span className="font-medium text-foreground">{prod.nome}</span>
                            {prod.codigo && (
                              <span className="text-xs text-muted-foreground">
                                Cód: {prod.codigo}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        Nenhum produto encontrado.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Button
                type="button"
                onClick={handleBusca}
                variant="secondary"
                className="border-[#D1D1D1]"
              >
                <Search className="w-4 h-4 mr-2" /> Buscar
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label>Categoria</Label>
                  {isNovaCategoria && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsNovaCategoria(false)
                        setForm({ ...form, categoria: '', codCategoria: '' })
                      }}
                      className="text-[10px] text-primary hover:underline"
                    >
                      Voltar à lista
                    </button>
                  )}
                </div>
                {isNovaCategoria ? (
                  <Input
                    autoFocus
                    placeholder="Nome da categoria..."
                    className="bg-[#F5F5F7] border-[#D1D1D1]"
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  />
                ) : (
                  <Select
                    value={form.categoria}
                    onValueChange={(v) => {
                      if (v === 'OUTRA') {
                        setIsNovaCategoria(true)
                        setForm({ ...form, categoria: '', codCategoria: '' })
                      } else {
                        setForm({ ...form, categoria: v, codCategoria: CATEGORY_MAP[v] || '' })
                      }
                    }}
                  >
                    <SelectTrigger className="bg-[#F5F5F7] border-[#D1D1D1]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(CATEGORY_MAP).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                      <SelectItem value="OUTRA" className="font-semibold text-primary">
                        + Nova Categoria
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-1">
                <Label>Cód. Categoria</Label>
                <Input
                  className="bg-[#F5F5F7] border-[#D1D1D1]"
                  value={form.codCategoria}
                  placeholder={isNovaCategoria ? 'Ex: NOV' : ''}
                  onChange={(e) => setForm({ ...form, codCategoria: e.target.value.toUpperCase() })}
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
              <div className="space-y-1 xl:col-span-2">
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
                <Select
                  value={form.voltagem}
                  onValueChange={(v) => setForm({ ...form, voltagem: v })}
                >
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
              <div className="space-y-1 xl:col-span-3">
                <Label>Observações</Label>
                <Input
                  className="bg-[#F5F5F7] border-[#D1D1D1]"
                  value={form.observacoes}
                  onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-[#D1D1D1] gap-4">
          <div className="text-sm font-semibold text-muted-foreground p-3 bg-[#F5F5F7] rounded-md border border-[#D1D1D1]">
            Frete Unitário Calculado:{' '}
            <span className="text-primary font-bold ml-1">R$ {freteUnitario.toFixed(2)}</span>
          </div>
          <Button
            type="button"
            onClick={handleAdd}
            className="gap-2 shadow-subtle w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Adicionar à Entrada
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
