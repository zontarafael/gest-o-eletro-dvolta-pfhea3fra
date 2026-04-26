import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Printer } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { printPedidoVenda } from '@/lib/print-venda'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function EditarVenda() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [venda, setVenda] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchVenda = async () => {
      if (!id) return
      const { data } = await supabase
        .from('vendas')
        .select(`*, clientes(nome)`)
        .eq('id', id)
        .single()

      if (data) {
        setVenda(data)
        setStatus(data.status || '')
      }
      setLoading(false)
    }
    fetchVenda()
  }, [id])

  const handleSave = async () => {
    if (status === 'Editar') {
      navigate(`/vendas/nova?edit=${id}`)
      return
    }

    setSaving(true)
    const { error } = await supabase.from('vendas').update({ status }).eq('id', id)
    setSaving(false)
    if (error) {
      toast({ title: 'Erro', description: 'Erro ao salvar pedido.', variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Pedido atualizado com sucesso.' })
      navigate('/vendas')
    }
  }

  if (loading)
    return <div className="p-8 text-center text-muted-foreground">Carregando pedido...</div>
  if (!venda)
    return <div className="p-8 text-center text-muted-foreground">Pedido não encontrado.</div>

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
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Editar Pedido {venda.codigo}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Atualize as informações do pedido.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => printPedidoVenda(venda.id)}
          className="shadow-subtle gap-2 bg-white"
        >
          <Printer className="w-4 h-4" /> Imprimir Pedido
        </Button>
      </div>

      <Card className="border-[#D1D1D1] shadow-subtle bg-white">
        <CardHeader>
          <CardTitle>Detalhes do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Cliente</label>
              <Input
                value={venda.clientes?.nome || 'Cliente Desconhecido'}
                disabled
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Valor Total</label>
              <Input
                value={`R$ ${Number(venda.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                disabled
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Data da Venda</label>
              <Input
                value={new Date(venda.data_venda).toLocaleDateString('pt-BR')}
                disabled
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em Processamento">Em Processamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                  <SelectItem value="Editar">Editar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t mt-6 border-[#D1D1D1]">
            <Button variant="outline" asChild className="shadow-subtle">
              <Link to="/vendas">Cancelar</Link>
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2 shadow-subtle">
              <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
