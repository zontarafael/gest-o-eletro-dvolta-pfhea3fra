import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line } from 'recharts'
import { supabase } from '@/lib/supabase/client'
import { startOfDay, startOfMonth, subDays, formatISO } from 'date-fns'

export function DashboardKPIs({ module, period }: { module: string; period: string }) {
  const [data, setData] = useState([
    {
      title: 'Faturamento Total',
      value: 'Carregando...',
      change: '...',
      color: 'hsl(var(--primary))',
      chartData: [],
    },
    {
      title: 'Total de Clientes',
      value: '...',
      change: '...',
      color: 'hsl(var(--chart-2))',
      chartData: [],
    },
    {
      title: 'Volume de Pedidos',
      value: '...',
      change: '...',
      color: 'hsl(var(--chart-3))',
      chartData: [],
    },
    {
      title: 'Capital em Estoque',
      value: '...',
      change: '...',
      color: 'hsl(var(--chart-4))',
      chartData: [],
    },
  ])

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date()
      let fromDate: Date | null = null

      if (period === 'hoje') fromDate = startOfDay(now)
      else if (period === '7dias') fromDate = subDays(startOfDay(now), 7)
      else if (period === 'mes') fromDate = startOfMonth(now)

      let vendasQuery = supabase.from('vendas').select('valor_total, data_venda')
      if (fromDate) {
        vendasQuery = vendasQuery.gte('data_venda', formatISO(fromDate))
      }

      const { data: vendasData } = await vendasQuery
      const faturamento =
        vendasData?.reduce((acc, curr) => acc + Number(curr.valor_total || 0), 0) || 0
      const vendasCount = vendasData?.length || 0

      const { count: clientesCount } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true })

      const { data: produtosData } = await supabase
        .from('produtos')
        .select('quantidade, custo_unitario')

      const capitalEstoque =
        produtosData?.reduce(
          (acc, curr) => acc + Number(curr.quantidade || 0) * Number(curr.custo_unitario || 0),
          0,
        ) || 0

      setData([
        {
          title: 'Faturamento Total',
          value: `R$ ${faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: 'Filtrado por período',
          color: 'hsl(var(--primary))',
          chartData: [
            { v: 10 },
            { v: 12 },
            { v: 11 },
            { v: 15 },
            { v: 14 },
            { v: faturamento > 0 ? 18 : 10 },
          ],
        },
        {
          title: 'Total de Clientes',
          value: String(clientesCount || 0),
          change: 'Base total cadastrada',
          color: 'hsl(var(--chart-2))',
          chartData: [{ v: 5 }, { v: 6 }, { v: 8 }, { v: 7 }, { v: 10 }, { v: 9 }],
        },
        {
          title: 'Volume de Pedidos',
          value: String(vendasCount || 0),
          change: 'Filtrado por período',
          color: 'hsl(var(--chart-3))',
          chartData: [
            { v: 20 },
            { v: 18 },
            { v: 19 },
            { v: 16 },
            { v: 15 },
            { v: vendasCount > 0 ? 25 : 12 },
          ],
        },
        {
          title: 'Capital em Estoque',
          value: `R$ ${capitalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: 'Estoque atual',
          color: 'hsl(var(--chart-4))',
          chartData: [
            { v: 90 },
            { v: 91 },
            { v: 92 },
            { v: 92 },
            { v: 92 },
            { v: capitalEstoque > 0 ? 95 : 92 },
          ],
        },
      ])
    }
    fetchData()
  }, [module, period])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
      {data.map((item, i) => (
        <Card
          key={i}
          className="hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md border-border bg-card group"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors duration-300">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{item.value}</div>
            <p className="text-xs text-muted-foreground mb-4 mt-1 font-medium">{item.change}</p>
            <div className="h-10 w-full opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={item.chartData}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={item.color}
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
