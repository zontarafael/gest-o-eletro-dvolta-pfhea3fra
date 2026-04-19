import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { CreditCard } from 'lucide-react'

export function PagamentoSection({ onChange }: { onChange?: (v: string) => void }) {
  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="w-5 h-5 text-primary" /> 4. Forma de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label>Opção de Pagamento</Label>
          <Select defaultValue="vista" onValueChange={onChange}>
            <SelectTrigger className="w-full bg-[#F5F5F7] border-[#D1D1D1]">
              <SelectValue placeholder="Selecione a forma de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vista">A vista em dinheiro, PIX ou cartão de débito</SelectItem>
              <SelectItem value="credito1x">No cartão de crédito em 1 vez</SelectItem>
              <SelectItem value="creditoparcelado">
                No cartão de crédito de 2 a 10 parcelas com juros
              </SelectItem>
              <SelectItem value="boleto">No boleto bancário</SelectItem>
              <SelectItem value="cheque">No cheque</SelectItem>
              <SelectItem value="multiplas">Mais de uma opção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
