import { Button } from '@/components/ui/button'
import { ClienteSection } from '@/components/vendas/ClienteSection'
import { ProdutosSection } from '@/components/vendas/ProdutosSection'
import { TransporteSection } from '@/components/vendas/TransporteSection'
import { PagamentoSection } from '@/components/vendas/PagamentoSection'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

export default function NovaVenda() {
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSave = () => {
    toast({
      title: 'Venda Concluída',
      description: 'A nova venda foi registrada com sucesso no sistema.',
    })
    setTimeout(() => navigate('/vendas'), 1500)
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-12 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="rounded-full shadow-subtle border-[#D1D1D1] bg-white hover:bg-[#F5F5F7] transition-colors shrink-0"
        >
          <Link to="/vendas">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Nova Venda</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registre um novo pedido de venda com facilidade.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ClienteSection />
        <ProdutosSection />
        <TransporteSection />
        <PagamentoSection />

        <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-[#D1D1D1]">
          <Button variant="outline" asChild className="shadow-subtle bg-white border-[#D1D1D1]">
            <Link to="/vendas">Cancelar</Link>
          </Button>
          <Button
            onClick={handleSave}
            className="gap-2 shadow-subtle px-8 transition-transform hover:-translate-y-0.5"
          >
            <CheckCircle2 className="w-5 h-5" /> Finalizar Venda
          </Button>
        </div>
      </div>
    </div>
  )
}
