import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function Empresa() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Dados da Empresa</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie as informações corporativas e estrutura.
        </p>
      </div>

      <Card className="border-[#D1D1D1] shadow-subtle bg-white">
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Informações públicas da empresa para emissão de notas e contatos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="font-semibold text-foreground">Razão Social</Label>
              <Input
                defaultValue="Eletro DVolta Comércio S.A."
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-3">
              <Label className="font-semibold text-foreground">CNPJ</Label>
              <Input defaultValue="12.345.678/0001-90" className="bg-[#F5F5F7] border-[#D1D1D1]" />
            </div>
            <div className="space-y-3">
              <Label className="font-semibold text-foreground">E-mail de Contato</Label>
              <Input
                defaultValue="contato@eletrodvolta.com.br"
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-3">
              <Label className="font-semibold text-foreground">Telefone Principal</Label>
              <Input defaultValue="(11) 4002-8922" className="bg-[#F5F5F7] border-[#D1D1D1]" />
            </div>
          </div>

          <Separator className="my-6 bg-[#D1D1D1]" />

          <div className="space-y-3">
            <Label className="font-semibold text-foreground">Endereço Sede</Label>
            <Input
              defaultValue="Av. Paulista, 1000 - Bela Vista, São Paulo - SP"
              className="bg-[#F5F5F7] border-[#D1D1D1]"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button className="shadow-subtle hover:-translate-y-0.5 transition-transform rounded-lg">
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
