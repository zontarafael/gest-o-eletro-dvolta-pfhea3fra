import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { FileSignature } from 'lucide-react'

export function AssinaturaSection() {
  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileSignature className="w-5 h-5 text-primary" /> 5. Assinatura Digital
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-w-md">
          <Label>Assinatura Digital Exigida</Label>
          <Select defaultValue="nao">
            <SelectTrigger className="w-full bg-[#F5F5F7] border-[#D1D1D1]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sim">Sim</SelectItem>
              <SelectItem value="nao">Não</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Selecione "Sim" para disparar a solicitação de assinatura para o cliente via e-mail ou
            WhatsApp após a conclusão da venda.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
