import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Printer, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { FornecedorForm } from '@/components/estoque/FornecedorForm'
import { ProdutoForm } from '@/components/estoque/ProdutoForm'
import { ProdutosList } from '@/components/estoque/ProdutosList'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export default function NovoProduto() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()

  const [freteTotal, setFreteTotal] = useState(0)
  const [notaFiscal, setNotaFiscal] = useState('')
  const [produtos, setProdutos] = useState<any[]>([])

  const lote = useMemo(() => {
    const numStr = notaFiscal.replace(/\D/g, '')
    if (!numStr) return ''
    const paddedNota = numStr.padStart(6, '0').slice(-6)
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yy = String(today.getFullYear()).slice(-2)
    return `${dd}.${mm}.${yy}.${paddedNota}`
  }, [notaFiscal])
  const [fornecedor, setFornecedor] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState<any>(null)

  const totalCustoProdutos = useMemo(
    () => produtos.reduce((acc, p) => acc + p.quantidade * p.custoUnitario, 0),
    [produtos],
  )

  const handleSave = async () => {
    if (!user) return
    setLoading(true)

    let fornecedorId = fornecedor.id
    if (!fornecedorId && fornecedor.nome) {
      const { data: newForn } = await supabase
        .from('fornecedores')
        .insert({
          user_id: user.id,
          nome: fornecedor.nome,
          documento: fornecedor.documento,
          rua: fornecedor.rua,
          numero: fornecedor.numero,
          bairro: fornecedor.bairro,
          referencia: fornecedor.referencia,
          cidade: fornecedor.cidade,
          estado: fornecedor.estado,
          cep: fornecedor.cep,
          email: fornecedor.email,
          telefones: fornecedor.telefones,
        })
        .select()
        .single()
      if (newForn) fornecedorId = newForn.id
    }

    const produtosToInsert: any[] = produtos.map((p) => {
      const custoTotalItem = p.quantidade * p.custoUnitario
      const proporcao = totalCustoProdutos > 0 ? custoTotalItem / totalCustoProdutos : 0
      const freteUnitario = p.quantidade > 0 ? (freteTotal * proporcao) / p.quantidade : 0

      return {
        user_id: user.id,
        codigo: p.codProduto,
        cod_categoria: p.codCategoria,
        cod_fabrica: p.codFabrica,
        marca: p.marca,
        nome: p.nome,
        categoria: p.categoria,
        capacidade: p.capacidade,
        portas: p.portas,
        cor: p.cor,
        voltagem: p.voltagem,
        observacoes: p.observacoes,
        quantidade: p.quantidade,
        custo_unitario: p.custoUnitario,
        imposto1: p.imposto1,
        imposto2: p.imposto2,
        valor_frete_unitario: freteUnitario,
        preco_venda: p.precoVenda || 0,
        despesas_adicionais: p.despesasAdicionais || 0,
        fornecedor_id: fornecedorId,
        lote,
        imagem_url: p.imagemUrl || null,
        status: 'Em preparação',
      }
    })

    await supabase.from('produtos').insert(produtosToInsert)

    setLoading(false)
    toast({
      title: 'Entrada Registrada',
      description: 'O estoque foi atualizado com sucesso no sistema.',
    })
    navigate('/estoque')
  }

  const handlePrintLabel = () =>
    toast({ title: 'Impressão', description: 'Enviando etiquetas para a impressora...' })
  const handlePrintQR = () =>
    toast({ title: 'QR Code', description: 'Gerando QR Codes dos produtos...' })

  return (
    <div className="space-y-6 animate-fade-in-up pb-12 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="rounded-full shadow-subtle border-[#D1D1D1] bg-white hover:bg-[#F5F5F7] transition-colors shrink-0"
        >
          <Link to="/estoque">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Nova Entrada de Estoque
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registre novos produtos, notas fiscais e fornecedores.
          </p>
        </div>
      </div>

      <Card className="border-[#D1D1D1] shadow-subtle bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Dados da Nota Fiscal</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="space-y-2 flex-1">
              <Label className="font-semibold text-foreground">Número da Nota Fiscal</Label>
              <Input
                value={notaFiscal}
                onChange={(e) => setNotaFiscal(e.target.value)}
                placeholder="Ex: 129"
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label className="font-semibold text-foreground">Valor do Frete Total (R$)</Label>
              <Input
                type="number"
                value={freteTotal}
                onChange={(e) => setFreteTotal(Number(e.target.value))}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="space-y-2 flex-1">
              <Label className="font-semibold text-foreground">Lote</Label>
              <Input
                value={lote}
                readOnly
                placeholder="Gerado automaticamente"
                className="bg-[#E5E5E5] border-[#D1D1D1] text-muted-foreground cursor-not-allowed focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2 flex-1 hidden sm:block"></div>
          </div>
        </CardContent>
      </Card>

      <FornecedorForm onChange={setFornecedor} />
      <ProdutoForm
        freteTotal={freteTotal}
        totalOutrosCusto={totalCustoProdutos}
        produtoEditando={produtoEditando}
        onCancelEdit={() => setProdutoEditando(null)}
        onAdd={(p) => {
          if (produtoEditando) {
            setProdutos(produtos.map((prod) => (prod.id === p.id ? p : prod)))
            setProdutoEditando(null)
          } else {
            setProdutos([...produtos, p])
          }
        }}
      />
      <ProdutosList
        produtos={produtos}
        freteTotal={freteTotal}
        totalCusto={totalCustoProdutos}
        onEdit={(p) => {
          setProdutoEditando(p)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onDelete={(id) => {
          setProdutos(produtos.filter((p) => p.id !== id))
          if (produtoEditando?.id === id) setProdutoEditando(null)
        }}
      />

      {produtos.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 mt-4 border-t border-[#D1D1D1] gap-4">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handlePrintLabel}
              className="shadow-subtle gap-2 bg-white border-[#D1D1D1] flex-1 sm:flex-none"
            >
              <Printer className="w-4 h-4" /> Etiqueta
            </Button>
            <Button
              variant="outline"
              onClick={handlePrintQR}
              className="shadow-subtle gap-2 bg-white border-[#D1D1D1] flex-1 sm:flex-none"
            >
              <QrCode className="w-4 h-4" /> QR Code
            </Button>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="gap-2 shadow-subtle px-8 w-full sm:w-auto transition-transform hover:-translate-y-0.5"
          >
            <Save className="w-5 h-5" /> {loading ? 'Salvando...' : 'Salvar Entrada'}
          </Button>
        </div>
      )}
    </div>
  )
}
