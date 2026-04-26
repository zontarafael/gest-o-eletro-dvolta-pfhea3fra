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
import {
  ShoppingBag,
  TrendingUp,
  Percent,
  Plus,
  FileText,
  Download,
  Printer,
  CalendarIcon,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type DateFilterOption = 'todos' | 'hoje' | 'ultimos-7-dias' | 'mes-atual' | 'personalizado'

export default function Vendas() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('todos')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true)
      let query = supabase
        .from('vendas')
        .select(`
          *,
          clientes ( nome )
        `)
        .order('data_venda', { ascending: false })

      if (dateFilter !== 'todos') {
        const today = new Date()
        let fromDate: Date | undefined
        let toDate: Date | undefined

        if (dateFilter === 'hoje') {
          fromDate = startOfDay(today)
          toDate = endOfDay(today)
        } else if (dateFilter === 'ultimos-7-dias') {
          fromDate = startOfDay(subDays(today, 7))
          toDate = endOfDay(today)
        } else if (dateFilter === 'mes-atual') {
          fromDate = startOfMonth(today)
          toDate = endOfMonth(today)
        } else if (dateFilter === 'personalizado') {
          if (dateRange.from) fromDate = startOfDay(dateRange.from)
          if (dateRange.to) toDate = endOfDay(dateRange.to)
        }

        if (fromDate) {
          query = query.gte('data_venda', fromDate.toISOString())
        }
        if (toDate) {
          query = query.lte('data_venda', toDate.toISOString())
        }
      }

      const { data } = await query

      if (data) {
        setPedidos(data)
      }
      setLoading(false)
    }
    fetchPedidos()
  }, [dateFilter, dateRange])

  const filteredPedidos = pedidos.filter((p) => {
    const term = searchTerm.toLowerCase()
    const codigoMatch = p.codigo?.toLowerCase().includes(term)
    const clienteMatch = p.clientes?.nome?.toLowerCase().includes(term)
    const valorMatch = String(p.valor_total).includes(term)
    return codigoMatch || clienteMatch || valorMatch
  })

  const totalFilteredValue = filteredPedidos.reduce((acc, p) => acc + Number(p.valor_total || 0), 0)
  const metrics = {
    totalVendas: filteredPedidos.length,
    ticketMedio: filteredPedidos.length > 0 ? totalFilteredValue / filteredPedidos.length : 0,
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Vendas e Pedidos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhamento do funil e histórico transacional.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto flex-wrap">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar código, cliente..."
              className="w-full sm:w-[250px] pl-8 bg-white shadow-subtle"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
            <SelectTrigger className="w-full sm:w-[160px] bg-white shadow-subtle">
              <SelectValue placeholder="Filtrar por data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo o período</SelectItem>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="ultimos-7-dias">Últimos 7 dias</SelectItem>
              <SelectItem value="mes-atual">Mês atual</SelectItem>
              <SelectItem value="personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>

          {dateFilter === 'personalizado' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left font-normal bg-white shadow-subtle w-full sm:w-[240px]',
                    !dateRange.from && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'dd/MM/yyyy')} -{' '}
                        {format(dateRange.to, 'dd/MM/yyyy')}
                      </>
                    ) : (
                      format(dateRange.from, 'dd/MM/yyyy')
                    )
                  ) : (
                    <span>Selecione o período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range: any) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={1}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          )}

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
                ) : filteredPedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum pedido encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPedidos.map((p) => (
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
