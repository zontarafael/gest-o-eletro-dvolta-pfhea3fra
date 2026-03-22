import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, FileText, Receipt, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function ImpressoesSection() {
  const { toast } = useToast()

  const handlePrint = (docName: string) => {
    toast({
      title: 'Impressão Solicitada',
      description: `Gerando documento: ${docName}...`,
    })
  }

  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Printer className="w-5 h-5 text-primary" /> 6. Impressões
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            type="button"
            variant="outline"
            className="gap-3 h-auto py-3 bg-[#F5F5F7] border-[#D1D1D1] hover:bg-white hover:border-primary hover:text-primary transition-colors justify-start text-left"
            onClick={() => handlePrint('Pedido de venda')}
          >
            <FileText className="w-5 h-5 shrink-0" />
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-semibold text-sm">Pedido de venda</span>
              <span className="text-[11px] text-muted-foreground font-normal leading-tight">
                Via do cliente e arquivo
              </span>
            </div>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="gap-3 h-auto py-3 bg-[#F5F5F7] border-[#D1D1D1] hover:bg-white hover:border-primary hover:text-primary transition-colors justify-start text-left"
            onClick={() => handlePrint('Nota Fiscal')}
          >
            <Receipt className="w-5 h-5 shrink-0" />
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-semibold text-sm">Nota Fiscal</span>
              <span className="text-[11px] text-muted-foreground font-normal leading-tight">
                DANFE Simplificado
              </span>
            </div>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="gap-3 h-auto py-3 bg-[#F5F5F7] border-[#D1D1D1] hover:bg-white hover:border-primary hover:text-primary transition-colors justify-start text-left"
            onClick={() => handlePrint('Termo de garantia')}
          >
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-semibold text-sm">Termo de garantia</span>
              <span className="text-[11px] text-muted-foreground font-normal leading-tight">
                Condições e prazos legais
              </span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
