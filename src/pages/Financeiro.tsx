import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react'

const transacoes = [
  {
    id: 1,
    desc: 'Pagamento Fornecedor Alpha',
    tipo: 'Despesa',
    valor: 'R$ 4.500,00',
    data: '15 Nov 2023',
    status: 'Liquidado',
  },
  {
    id: 2,
    desc: 'Recebimento NF 1024 (Empresa X)',
    tipo: 'Receita',
    valor: 'R$ 12.300,00',
    data: '14 Nov 2023',
    status: 'Liquidado',
  },
  {
    id: 3,
    desc: 'Conta de Energia Elétrica',
    tipo: 'Despesa',
    valor: 'R$ 850,00',
    data: '10 Nov 2023',
    status: 'Liquidado',
  },
  {
    id: 4,
    desc: 'Recebimento NF 1025',
    tipo: 'Receita',
    valor: 'R$ 2.400,00',
    data: '08 Nov 2023',
    status: 'Pendente',
  },
]

export default function Financeiro() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Fluxo Financeiro</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Controle de caixa, receitas e despesas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#D1D1D1] shadow-subtle bg-white hover:-translate-y-1 transition-transform">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Saldo em Conta
            </CardTitle>
            <Wallet className="w-4 h-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 142.050,00</div>
          </CardContent>
        </Card>
        <Card className="border-[#D1D1D1] shadow-subtle bg-white hover:-translate-y-1 transition-transform">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Receitas (Mês)
            </CardTitle>
            <ArrowUpRight className="w-4 h-4 text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#10B981]">R$ 45.200,00</div>
          </CardContent>
        </Card>
        <Card className="border-[#D1D1D1] shadow-subtle bg-white hover:-translate-y-1 transition-transform">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Despesas (Mês)
            </CardTitle>
            <ArrowDownRight className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">R$ 18.400,00</div>
          </CardContent>
        </Card>
        <Card className="border-[#D1D1D1] shadow-subtle bg-white hover:-translate-y-1 transition-transform">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Previsão</CardTitle>
            <Activity className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Positiva</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D1D1D1] shadow-subtle bg-white">
        <CardHeader>
          <CardTitle>Últimas Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#D1D1D1] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F5F5F7]">
                <TableRow className="border-[#D1D1D1]">
                  <TableHead className="font-semibold">Descrição</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoes.map((t) => (
                  <TableRow key={t.id} className="border-[#D1D1D1] hover:bg-[#F5F5F7]/50">
                    <TableCell className="font-medium text-foreground">{t.desc}</TableCell>
                    <TableCell className="text-muted-foreground">{t.data}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${t.status === 'Liquidado' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}
                      >
                        {t.status}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold tracking-tight ${t.tipo === 'Receita' ? 'text-[#10B981]' : 'text-foreground'}`}
                    >
                      {t.tipo === 'Receita' ? '+ ' : '- '}
                      {t.valor}
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
