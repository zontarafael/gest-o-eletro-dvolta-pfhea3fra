import { useState, useMemo, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { availableFields, processReportData, generatePDF, generateXLS } from '@/lib/report-utils'
import { toast } from '@/hooks/use-toast'
import { Save, Trash2, FileText, FileSpreadsheet } from 'lucide-react'
import { ReportPreviewTab } from './ReportPreviewTab'
import { ReportChartTab } from './ReportChartTab'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ReportDialog({
  isOpen,
  onOpenChange,
  produtos,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  produtos: any[]
}) {
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'codigo',
    'nome',
    'quantidade',
    'custo_final',
    'preco_venda',
    'status',
  ])
  const [templateName, setTemplateName] = useState('')
  const [templates, setTemplates] = useState<{ name: string; fields: string[] }[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('report-templates')
    if (saved) setTemplates(JSON.parse(saved))
  }, [])

  const { processedData, totals } = useMemo(() => processReportData(produtos), [produtos])

  const toggleField = (id: string) =>
    setSelectedFields((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))

  const saveTemplate = () => {
    if (!templateName.trim())
      return toast({
        title: 'Aviso',
        description: 'Digite um nome para o modelo',
        variant: 'destructive',
      })
    const newTemplates = [...templates, { name: templateName, fields: selectedFields }]
    setTemplates(newTemplates)
    localStorage.setItem('report-templates', JSON.stringify(newTemplates))
    setTemplateName('')
    toast({ title: 'Sucesso', description: 'Modelo salvo com sucesso!' })
  }

  const deleteTemplate = (name: string) => {
    const newTemplates = templates.filter((t) => t.name !== name)
    setTemplates(newTemplates)
    localStorage.setItem('report-templates', JSON.stringify(newTemplates))
  }

  const handleExport = (format: 'pdf' | 'xls') => {
    if (selectedFields.length === 0)
      return toast({
        title: 'Aviso',
        description: 'Selecione pelo menos um campo.',
        variant: 'destructive',
      })
    if (format === 'pdf') generatePDF(processedData, selectedFields, totals)
    else generateXLS(processedData, selectedFields, totals)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] bg-background max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Gerador de Relatórios Personalizados</DialogTitle>
          <DialogDescription>
            Configure os campos, use modelos salvos, visualize os totais e gere gráficos
            comparativos.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="config" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Configuração & Modelos</TabsTrigger>
            <TabsTrigger value="preview">Visualização (Preview)</TabsTrigger>
            <TabsTrigger value="chart">Gráfico Comparativo</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="flex-1 overflow-auto flex flex-col gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Campos Disponíveis</Label>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFields(availableFields.map((f) => f.id))}
                    >
                      Marcar Todos
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedFields([])}>
                      Limpar
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[350px] border rounded-md p-4 bg-muted/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availableFields.map((field) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`field-${field.id}`}
                          checked={selectedFields.includes(field.id)}
                          onCheckedChange={() => toggleField(field.id)}
                        />
                        <label
                          htmlFor={`field-${field.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {field.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="space-y-4 md:border-l md:pl-6">
                <Label className="text-base font-semibold">Modelos Salvos</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do modelo"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                  <Button size="icon" onClick={saveTemplate} variant="secondary">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
                <ScrollArea className="h-[300px]">
                  {templates.length === 0 ? (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Nenhum modelo salvo.
                    </p>
                  ) : (
                    <div className="space-y-2 mt-4">
                      {templates.map((t) => (
                        <div
                          key={t.name}
                          className="flex items-center justify-between p-2 border rounded bg-card hover:bg-muted/50 transition-colors"
                        >
                          <button
                            className="text-sm font-medium flex-1 text-left truncate"
                            onClick={() => setSelectedFields(t.fields)}
                            title="Carregar modelo"
                          >
                            {t.name}
                          </button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive ml-2"
                            onClick={() => deleteTemplate(t.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 min-h-0">
            <ReportPreviewTab
              data={processedData}
              selectedFields={selectedFields}
              totals={totals}
            />
          </TabsContent>

          <TabsContent value="chart" className="flex-1 min-h-0">
            <ReportChartTab data={processedData} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4 border-t mt-4">
          <div className="flex w-full sm:justify-end gap-2 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="gap-2 border-[#D1D1D1]"
            >
              <FileText className="w-4 h-4 text-blue-600" /> Exportar PDF
            </Button>
            <Button
              onClick={() => handleExport('xls')}
              className="gap-2 bg-[#10B981] hover:bg-[#059669] text-white"
            >
              <FileSpreadsheet className="w-4 h-4" /> Exportar XLS
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
