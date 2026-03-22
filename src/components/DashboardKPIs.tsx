import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line } from 'recharts'

export function DashboardKPIs({ module, period }: { module: string; period: string }) {
  const getMockData = () => {
    // Modify based on mock module to simulate dynamics
    const mult = module === 'financeiro' ? 2 : module === 'vendas' ? 1.5 : 1

    return [
      {
        title: 'Faturamento Total',
        value: `R$ ${(1240500 * mult).toLocaleString('pt-BR')}`,
        change: '+12.5%',
        color: '#007AFF',
        chartData: [{ v: 10 }, { v: 12 }, { v: 11 }, { v: 15 }, { v: 14 }, { v: 18 }],
      },
      {
        title: 'Leads Ativos',
        value: Math.floor(842 * mult).toString(),
        change: '+5.2%',
        color: '#10B981',
        chartData: [{ v: 5 }, { v: 6 }, { v: 8 }, { v: 7 }, { v: 10 }, { v: 9 }],
      },
      {
        title: 'Pedidos Pendentes',
        value: Math.floor(156 / mult).toString(),
        change: '-2.4%',
        color: '#F59E0B',
        chartData: [{ v: 20 }, { v: 18 }, { v: 19 }, { v: 16 }, { v: 15 }, { v: 12 }],
      },
      {
        title: 'Nível de Estoque',
        value: '92%',
        change: 'Estável',
        color: '#6366F1',
        chartData: [{ v: 90 }, { v: 91 }, { v: 92 }, { v: 92 }, { v: 92 }, { v: 92 }],
      },
    ]
  }

  const data = getMockData()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
      {data.map((item, i) => (
        <Card
          key={i}
          className="hover:-translate-y-1 transition-transform duration-300 shadow-subtle hover:shadow-elevation border-[#D1D1D1] bg-white group"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{item.value}</div>
            <p className="text-xs text-muted-foreground mb-4 mt-1 font-medium">
              {item.change} do último período
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
