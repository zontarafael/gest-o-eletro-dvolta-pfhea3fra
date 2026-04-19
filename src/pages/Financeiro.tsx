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
import { ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function Financeiro() {
  const [transacoes, setTransacoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({ saldo: 0, receitas: 0, despesas: 0 })

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('movimentacoes_financeiras')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setTransacoes(data)

        let r = 0,
          d = 0
        data.forEach((t) => {
          if (t.tipo === 'Receita') r += Number(t.valor)
          if (t.tipo === 'Despesa') d += Number(t.valor)
        })
        // Mock a base balance
        setMetrics({ saldo: 142050 + r - d, receitas: r, despesas: d })
      }
      setLoading(false)
    }
    fetchData()
  }, [])

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
              Saldo Estimado
            </CardTitle>
            <Wallet className="w-4 h-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#D1D1D1] shadow-subtle bg-white hover:-translate-y-1 transition-transform">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Receitas Realizadas
            </CardTitle>
            <ArrowUpRight className="w-4 h-4 text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#10B981]">
              R$ {metrics.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#D1D1D1] shadow-subtle bg-white hover:-translate-y-1 transition-transform">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Despesas Realizadas
            </CardTitle>
            <ArrowDownRight className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {metrics.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Carregando movimentações...
                    </TableCell>
                  </TableRow>
                ) : transacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhuma movimentação registrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  transacoes.map((t) => (
                    <TableRow key={t.id} className="border-[#D1D1D1] hover:bg-[#F5F5F7]/50">
                      <TableCell className="font-medium text-foreground">{t.descricao}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(t.data_movimentacao).toLocaleDateString('pt-BR')}
                      </TableCell>
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
                        R$ {Number(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
