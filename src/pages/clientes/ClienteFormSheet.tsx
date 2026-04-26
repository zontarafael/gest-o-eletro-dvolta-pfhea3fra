import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function ClienteFormSheet({
  onSuccess,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  onSuccess: (cliente: any) => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? setControlledOpen : setInternalOpen
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    documento: '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    const telefones = formData.telefone ? [formData.telefone] : []

    const { data, error } = await supabase
      .from('clientes')
      .insert([
        {
          user_id: user.id,
          nome: formData.nome,
          email: formData.email,
          documento: formData.documento,
          telefones,
          cep: formData.cep,
          rua: formData.rua,
          numero: formData.numero,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
          status: 'Ativo',
        },
      ])
      .select()

    setIsSubmitting(false)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      return
    }

    toast({ title: 'Sucesso', description: 'Cliente cadastrado com sucesso!' })
    setOpen(false)
    setFormData({
      nome: '',
      email: '',
      documento: '',
      telefone: '',
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
    })

    if (data && data[0]) onSuccess(data[0])
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        !isControlled && (
          <SheetTrigger asChild>
            <Button className="shadow-subtle hover:-translate-y-0.5 transition-transform rounded-lg gap-2">
              <UserPlus className="w-4 h-4" /> Novo Cliente
            </Button>
          </SheetTrigger>
        )
      )}
      <SheetContent className="overflow-y-auto sm:max-w-md w-full">
        <SheetHeader>
          <SheetTitle>Novo Cliente</SheetTitle>
          <SheetDescription>Cadastre as informações de um novo cliente abaixo.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="documento">Documento (CPF/CNPJ)</Label>
            <Input
              id="documento"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" name="cep" value={formData.cep} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input id="estado" name="estado" value={formData.estado} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="rua">Rua</Label>
              <Input id="rua" name="rua" value={formData.rua} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" name="numero" value={formData.numero} onChange={handleChange} />
            </div>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
