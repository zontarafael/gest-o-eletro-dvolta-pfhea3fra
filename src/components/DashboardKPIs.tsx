import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line } from 'recharts'
import { supabase } from '@/lib/supabase/client'

export function DashboardKPIs({ module, period }: { module: string; period: string }) {
  const [data, setData] = useState([
    {
      title: 'Faturamento Total',
      value: 'Carregando...',
      change: '0%',
      color: 'hsl(var(--primary))',
      chartData: [],
    },
    {
      title: 'Clientes Ativos',
      value: '...',
      change: '0%',
      color: 'hsl(var(--chart-2))',
      chartData: [],
    },
    { title: 'Pedidos', value: '...', change: '0%', color: 'hsl(var(--chart-3))', chartData: [] },
    {
      title: 'Itens em Estoque',
      value: '...',
      change: '0%',
      color: 'hsl(var(--chart-4))',
      chartData: [],
    },
  ])

  useEffect(() => {
    const fetchData = async () => {
      const { data: vendasData } = await supabase.from('vendas').select('valor_total')
      const faturamento =
        vendasData?.reduce((acc, curr) => acc + Number(curr.valor_total || 0), 0) || 0

      const { count: clientesCount } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true })
      const { count: vendasCount } = await supabase
        .from('vendas')
        .select('*', { count: 'exact', head: true })
      const { count: prodCount } = await supabase
        .from('produtos')
        .select('*', { count: 'exact', head: true })

      setData([
        {
          title: 'Faturamento Total',
          value: `R$ ${faturamento.toLocaleString('pt-BR')}`,
          change: '+12.5%',
          color: 'hsl(var(--primary))',
          chartData: [{ v: 10 }, { v: 12 }, { v: 11 }, { v: 15 }, { v: 14 }, { v: 18 }],
        },
        {
          title: 'Clientes',
          value: String(clientesCount || 0),
          change: '+5.2%',
          color: 'hsl(var(--chart-2))',
          chartData: [{ v: 5 }, { v: 6 }, { v: 8 }, { v: 7 }, { v: 10 }, { v: 9 }],
        },
        {
          title: 'Pedidos',
          value: String(vendasCount || 0),
          change: '+1.4%',
          color: 'hsl(var(--chart-3))',
          chartData: [{ v: 20 }, { v: 18 }, { v: 19 }, { v: 16 }, { v: 15 }, { v: 12 }],
        },
        {
          title: 'Itens em Estoque',
          value: String(prodCount || 0),
          change: 'Estável',
          color: 'hsl(var(--chart-4))',
          chartData: [{ v: 90 }, { v: 91 }, { v: 92 }, { v: 92 }, { v: 92 }, { v: 92 }],
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
            <p className="text-xs text-muted-foreground mb-4 mt-1 font-medium">
              <span
                className={
                  item.change.startsWith('+')
                    ? 'text-emerald-600'
                    : item.change.startsWith('-')
                      ? 'text-destructive'
                      : ''
                }
              >
                {item.change}
              </span>{' '}
              do último período
            </p>
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
