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
import { ShoppingBag, TrendingUp, Percent, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const pedidos = [
  {
    id: 'PED-001',
    cliente: 'João Silva',
    valor: 'R$ 1.500',
    status: 'Concluído',
    data: '10 Nov 2023',
  },
  {
    id: 'PED-002',
    cliente: 'Empresa X',
    valor: 'R$ 8.900',
    status: 'Em Processamento',
    data: '12 Nov 2023',
  },
  {
    id: 'PED-003',
    cliente: 'Carlos Santos',
    valor: 'R$ 350',
    status: 'Cancelado',
    data: '13 Nov 2023',
  },
  {
    id: 'PED-004',
    cliente: 'Maria Oliveira',
    valor: 'R$ 4.200',
    status: 'Concluído',
    data: '14 Nov 2023',
  },
]

export default function Vendas() {
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
        <Button
          asChild
          className="shadow-subtle hover:-translate-y-0.5 transition-transform rounded-lg gap-2"
        >
          <Link to="/vendas/nova">
            <Plus className="w-4 h-4" /> Nova Venda
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#D1D1D1] shadow-subtle bg-white hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Vendas no Mês
            </CardTitle>
            <ShoppingBag className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">245</div>
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
            <div className="text-3xl font-bold text-foreground">R$ 4.520</div>
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
                  <TableHead className="font-semibold">ID Pedido</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Valor</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((p) => (
                  <TableRow key={p.id} className="border-[#D1D1D1] hover:bg-[#F5F5F7]/50">
                    <TableCell className="font-medium">{p.id}</TableCell>
                    <TableCell>{p.cliente}</TableCell>
                    <TableCell className="font-semibold">{p.valor}</TableCell>
                    <TableCell className="text-muted-foreground">{p.data}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
