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

const areaData = [
  { name: 'Jan', vendas: 4000, metas: 2400 },
  { name: 'Fev', vendas: 3000, metas: 1398 },
  { name: 'Mar', vendas: 2000, metas: 9800 },
  { name: 'Abr', vendas: 2780, metas: 3908 },
  { name: 'Mai', vendas: 1890, metas: 4800 },
  { name: 'Jun', vendas: 2390, metas: 3800 },
]

const pieData = [
  { name: 'Eletrônicos', value: 400 },
  { name: 'Eletrodomésticos', value: 300 },
  { name: 'Acessórios', value: 300 },
  { name: 'Serviços', value: 200 },
]

const chartConfig = {
  vendas: { label: 'Vendas Realizadas', color: 'hsl(var(--primary))' },
  metas: { label: 'Metas Estipuladas', color: 'hsl(var(--chart-2))' },
}

export function DashboardCharts({ module, period }: { module: string; period: string }) {
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ]

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in-up"
      style={{ animationDelay: '100ms' }}
    >
      <Card className="lg:col-span-2 shadow-sm border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Desempenho de Crescimento</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <CardTitle className="text-lg text-foreground">Distribuição por Categoria</CardTitle>
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
