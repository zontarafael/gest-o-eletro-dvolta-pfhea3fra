import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

export function ReportChartTab({ data }: { data: any[] }) {
  const chartData = data
    .filter((p) => Number(p.preco_venda) > 0 || Number(p.valor_site) > 0)
    .map((p) => ({
      name: p.nome.length > 20 ? p.nome.substring(0, 20) + '...' : p.nome,
      precoVenda: Number(p.preco_venda) || 0,
      valorSite: Number(p.valor_site) || 0,
    }))

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground mt-4 border border-dashed rounded-md">
        Não há produtos com preços cadastrados para gerar o gráfico comparativo.
      </div>
    )
  }

  const chartConfig = {
    precoVenda: { label: 'Preço de Venda', color: 'hsl(var(--primary))' },
    valorSite: { label: 'Valor Sugerido (Site)', color: 'hsl(var(--muted-foreground))' },
  }

  return (
    <div className="h-[50vh] w-full pt-4 mt-2">
      <ChartContainer config={chartConfig} className="h-full w-full min-h-[300px]">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(val) => `R$ ${val}`}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} verticalAlign="top" />
          <Bar
            dataKey="precoVenda"
            name="Preço de Venda"
            fill="var(--color-precoVenda)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="valorSite"
            name="Valor Sugerido"
            fill="var(--color-valorSite)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
