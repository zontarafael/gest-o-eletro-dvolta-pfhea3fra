import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { supabase } from '@/lib/supabase/client'
import { startOfDay, startOfMonth, subDays, formatISO, format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const chartConfig = {
  vendas: { label: 'Faturamento (R$)', color: 'hsl(var(--primary))' },
}

export function DashboardCharts({ module, period }: { module: string; period: string }) {
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ]
  const [areaData, setAreaData] = useState([{ name: 'Carregando', vendas: 0 }])
  const [pieData, setPieData] = useState([{ name: 'Carregando', value: 100 }])

  useEffect(() => {
    const fetchData = async () => {
      // Pie Chart: Mix de Produtos por categoria (quantidade em estoque)
      const { data: prods } = await supabase.from('produtos').select('categoria, quantidade')
      if (prods && prods.length > 0) {
        const catMap: Record<string, number> = {}
        prods.forEach((p) => {
          const c = p.categoria?.trim() || 'Outros'
          catMap[c] = (catMap[c] || 0) + (Number(p.quantidade) || 0)
        })
        const formattedPie = Object.keys(catMap)
          .map((k) => ({ name: k, value: catMap[k] }))
          .filter((item) => item.value > 0)
          .sort((a, b) => b.value - a.value)

        setPieData(formattedPie.length > 0 ? formattedPie : [{ name: 'Sem estoque', value: 1 }])
      } else {
        setPieData([{ name: 'Sem produtos', value: 1 }])
      }

      // Area Chart: Evolução Financeira
      const now = new Date()
      let fromDate: Date | null = null

      if (period === 'hoje') fromDate = startOfDay(now)
      else if (period === '7dias') fromDate = subDays(startOfDay(now), 7)
      else if (period === 'mes') fromDate = startOfMonth(now)

      let vendasQuery = supabase
        .from('vendas')
        .select('valor_total, data_venda')
        .order('data_venda', { ascending: true })

      if (fromDate) {
        vendasQuery = vendasQuery.gte('data_venda', formatISO(fromDate))
      }

      const { data: vendas } = await vendasQuery

      if (vendas && vendas.length > 0) {
        const agrouped: Record<string, number> = {}
        vendas.forEach((v) => {
          if (!v.data_venda) return
          let key = ''
          const d = parseISO(v.data_venda)
          if (period === 'hoje') {
            key = format(d, 'HH:mm')
          } else if (period === '7dias' || period === 'mes') {
            key = format(d, 'dd/MM')
          } else {
            key = format(d, 'MMM/yy', { locale: ptBR })
          }
          agrouped[key] = (agrouped[key] || 0) + Number(v.valor_total || 0)
        })

        const formattedArea = Object.keys(agrouped).map((k) => ({
          name: k,
          vendas: agrouped[k],
        }))
        setAreaData(formattedArea)
      } else {
        setAreaData([{ name: 'Sem vendas', vendas: 0 }])
      }
    }
    fetchData()
  }, [period, module])

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in-up"
      style={{ animationDelay: '100ms' }}
    >
      <Card className="lg:col-span-2 shadow-sm border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Evolução Financeira</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-vendas)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-vendas)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="vendas"
                stroke="var(--color-vendas)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorVendas)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Mix de Produtos</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  backgroundColor: 'hsl(var(--card))',
                }}
                itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
