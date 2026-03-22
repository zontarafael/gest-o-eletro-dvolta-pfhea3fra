import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Truck } from 'lucide-react'

export function TransporteSection() {
  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Truck className="w-5 h-5 text-primary" /> 3. Transporte
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label>Modalidade de Transporte</Label>
          <Select defaultValue="0">
            <SelectTrigger className="w-full bg-[#F5F5F7] border-[#D1D1D1]">
              <SelectValue placeholder="Selecione a modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">
                0 - Contratação do Frete por conta do Remetente (CIF)
              </SelectItem>
              <SelectItem value="1">
                1 - Contratação do Frete por conta do Destinatário (FOB)
              </SelectItem>
              <SelectItem value="2">2 - Contratação do Frete por conta de Terceiros</SelectItem>
              <SelectItem value="3">3 - Transporte Próprio por conta do Remetente</SelectItem>
              <SelectItem value="4">4 - Transporte Próprio por conta do Destinatário</SelectItem>
              <SelectItem value="5">5 - Sem Ocorrência de Transporte</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
