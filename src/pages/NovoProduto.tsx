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

export default function NovoProduto() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [freteTotal, setFreteTotal] = useState(0)
  const [notaFiscal, setNotaFiscal] = useState('')
  const [produtos, setProdutos] = useState<any[]>([])
  const [fornecedor, setFornecedor] = useState<any>({})

  const totalCustoProdutos = useMemo(
    () => produtos.reduce((acc, p) => acc + p.quantidade * p.custoUnitario, 0),
    [produtos],
  )

  const handleSave = () => {
    toast({
      title: 'Entrada Registrada',
      description: 'O estoque foi atualizado com sucesso no sistema.',
    })
    setTimeout(() => navigate('/estoque'), 1500)
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
        <CardContent className="flex flex-col sm:flex-row gap-6">
          <div className="space-y-2 flex-1">
            <Label className="font-semibold text-foreground">Número da Nota Fiscal</Label>
            <Input
              value={notaFiscal}
              onChange={(e) => setNotaFiscal(e.target.value)}
              placeholder="Ex: 000.000.000"
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
        </CardContent>
      </Card>

      <FornecedorForm onChange={setFornecedor} />

      <ProdutoForm
        freteTotal={freteTotal}
        totalOutrosCusto={totalCustoProdutos}
        onAdd={(p) => setProdutos([...produtos, p])}
      />

      <ProdutosList produtos={produtos} freteTotal={freteTotal} totalCusto={totalCustoProdutos} />

      {produtos.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 mt-4 border-t border-[#D1D1D1] gap-4">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handlePrintLabel}
              className="shadow-subtle gap-2 bg-white border-[#D1D1D1] flex-1 sm:flex-none"
            >
              <Printer className="w-4 h-4" /> Etiqueta do Produto
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
            className="gap-2 shadow-subtle px-8 w-full sm:w-auto transition-transform hover:-translate-y-0.5"
          >
            <Save className="w-5 h-5" /> Salvar Entrada
          </Button>
        </div>
      )}
    </div>
  )
}
