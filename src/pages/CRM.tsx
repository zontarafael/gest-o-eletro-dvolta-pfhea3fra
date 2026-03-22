import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const leads = {
  novos: [
    { id: 1, name: 'Tech Solutions SA', value: 'R$ 5.000', temp: 'Quente' },
    { id: 2, name: 'Ana Costa', value: 'R$ 1.200', temp: 'Frio' },
  ],
  contato: [
    { id: 3, name: 'Global Corp', value: 'R$ 15.000', temp: 'Morno' },
    { id: 5, name: 'Construtora Alfa', value: 'R$ 22.000', temp: 'Quente' },
  ],
  negociacao: [{ id: 4, name: 'Loja do Centro', value: 'R$ 8.000', temp: 'Quente' }],
}

function KanbanColumn({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="bg-[#E5E4E2]/40 border border-[#D1D1D1]/50 p-4 rounded-xl flex flex-col gap-3 min-h-[400px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">{title}</h3>
        <span className="bg-white text-foreground shadow-sm px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#D1D1D1]">
          {items.length}
        </span>
      </div>
      {items.map((item) => (
        <Card
          key={item.id}
          className="cursor-grab hover:shadow-elevation transition-all border-[#D1D1D1] bg-white group hover:-translate-y-0.5"
        >
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <p className="font-semibold text-sm text-foreground">{item.name}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="font-bold text-sm text-primary">{item.value}</p>
              <Badge
                variant="outline"
                className={`text-[10px] uppercase ${
                  item.temp === 'Quente'
                    ? 'text-destructive border-destructive/50 bg-destructive/10'
                    : item.temp === 'Morno'
                      ? 'text-[#F59E0B] border-[#F59E0B]/50 bg-[#F59E0B]/10'
                      : 'text-primary border-primary/50 bg-primary/10'
                }`}
              >
                {item.temp}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function CRM() {
  return (
    <div className="space-y-6 animate-fade-in-up h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">CRM - Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe as oportunidades e negociações em andamento.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <KanbanColumn title="Novos Leads" items={leads.novos} />
        <KanbanColumn title="Em Contato" items={leads.contato} />
        <KanbanColumn title="Em Negociação" items={leads.negociacao} />
      </div>
    </div>
  )
}
