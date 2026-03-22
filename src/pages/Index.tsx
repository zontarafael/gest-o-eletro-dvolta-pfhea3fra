import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DashboardKPIs } from '@/components/DashboardKPIs'
import { DashboardCharts } from '@/components/DashboardCharts'
import { AIAssistant } from '@/components/AIAssistant'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'

export default function Index() {
  const [period, setPeriod] = useState('hoje')
  const [module, setModule] = useState('geral')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [period, module])

  const handlePeriodChange = (val: string) => {
    setPeriod(val)
    if (val === 'personalizado') {
      toast({
        title: 'Filtro Personalizado',
        description: 'A funcionalidade de seleção de datas será aberta.',
      })
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Dashboard de Inteligência
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Visão estratégica e operacional - Eletro DVolta
          </p>
        </div>
        <div className="flex flex-col xs:flex-row items-center gap-3 w-full sm:w-auto">
          <Select value={module} onValueChange={setModule}>
            <SelectTrigger className="w-full sm:w-[160px] bg-white border-[#D1D1D1] shadow-sm font-medium">
              <SelectValue placeholder="Módulo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geral">Visão Geral</SelectItem>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="crm">CRM</SelectItem>
              <SelectItem value="estoque">Estoque</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-full sm:w-[160px] bg-white border-[#D1D1D1] shadow-sm font-medium">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="mes">Mês atual</SelectItem>
              <SelectItem value="personalizado">Personalizado...</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[140px] w-full rounded-xl bg-[#E5E4E2]/50" />
              ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="lg:col-span-2 h-[400px] rounded-xl bg-[#E5E4E2]/50" />
            <Skeleton className="h-[400px] rounded-xl bg-[#E5E4E2]/50" />
          </div>
        </div>
      ) : (
        <>
          <DashboardKPIs module={module} period={period} />
          <DashboardCharts module={module} period={period} />
        </>
      )}

      <AIAssistant />
    </div>
  )
}
