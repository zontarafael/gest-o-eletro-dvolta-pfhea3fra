import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export function ImpressoesSection() {
  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Printer className="w-5 h-5 text-primary" /> 6. Impressões
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button type="button" variant="outline" className="shadow-sm gap-2">
            <Printer className="w-4 h-4" /> Pedido de Venda
          </Button>
          <Button type="button" variant="outline" className="shadow-sm gap-2">
            <Printer className="w-4 h-4" /> Nota Fiscal
          </Button>
          <Button type="button" variant="outline" className="shadow-sm gap-2">
            <Printer className="w-4 h-4" /> Termo de Garantia
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
