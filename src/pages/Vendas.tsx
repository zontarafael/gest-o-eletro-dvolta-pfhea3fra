import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, TrendingUp, Percent, Plus, FileText, Download, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Vendas() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({ totalVendas: 0, ticketMedio: 0 })

  useEffect(() => {
    const fetchPedidos = async () => {
      const { data } = await supabase
        .from('vendas')
        .select(`
          *,
          clientes ( nome )
        `)
        .order('created_at', { ascending: false })

      if (data) {
        setPedidos(data)
        const total = data.reduce((acc, p) => acc + Number(p.valor_total || 0), 0)
        setMetrics({
          totalVendas: data.length,
          ticketMedio: data.length > 0 ? total / data.length : 0,
        })
      }
      setLoading(false)
    }
    fetchPedidos()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Vendas e Pedidos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhamento do funil e histórico transacional.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 shadow-subtle bg-white">
                <FileText className="w-4 h-4" />
                Relatórios
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => window.print()}>
                <Download className="w-4 h-4" /> Imprimir Resumo
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <FileText className="w-4 h-4" /> Relatório Mensal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            asChild
            className="shadow-subtle hover:-translate-y-0.5 transition-transform rounded-lg gap-2 w-full sm:w-auto"
          >
            <Link to="/vendas/nova">
              <Plus className="w-4 h-4" /> Nova Venda
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#D1D1D1] shadow-subtle bg-white hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Vendas Registradas
            </CardTitle>
            <ShoppingBag className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{metrics.totalVendas}</div>
          </CardContent>
        </Card>
        <Card className="border-[#D1D1D1] shadow-subtle bg-white hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Ticket Médio
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              R$ {metrics.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#D1D1D1] shadow-subtle bg-white hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Taxa de Conversão
            </CardTitle>
            <Percent className="w-4 h-4 text-[#F59E0B]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">18.5%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D1D1D1] shadow-subtle bg-white">
        <CardHeader>
          <CardTitle>Histórico Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#D1D1D1] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F5F5F7]">
                <TableRow className="border-[#D1D1D1]">
                  <TableHead className="font-semibold">Cód. Pedido</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Valor</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Impressões</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Carregando pedidos...
                    </TableCell>
                  </TableRow>
                ) : pedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum pedido registrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  pedidos.map((p) => (
                    <TableRow key={p.id} className="border-[#D1D1D1] hover:bg-[#F5F5F7]/50">
                      <TableCell className="font-medium">
                        <Link
                          to={`/vendas/${p.id}`}
                          className="text-primary hover:underline font-bold"
                        >
                          {p.codigo}
                        </Link>
                      </TableCell>
                      <TableCell>{p.clientes?.nome || 'Cliente Desconhecido'}</TableCell>
                      <TableCell className="font-semibold">
                        R${' '}
                        {Number(p.valor_total).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(p.data_venda).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium ${
                            p.status === 'Concluído'
                              ? 'border-[#10B981] text-[#10B981] bg-[#10B981]/10'
                              : p.status === 'Em Processamento'
                                ? 'border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10'
                                : 'border-destructive text-destructive bg-destructive/10'
                          }`}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Imprimir Pedido de Venda"
                            onClick={() => window.print()}
                          >
                            <Printer className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Imprimir Nota Fiscal"
                            onClick={() => window.print()}
                          >
                            <FileText className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
