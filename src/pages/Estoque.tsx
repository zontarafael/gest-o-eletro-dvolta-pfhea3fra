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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, PackageSearch, ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

export default function Estoque() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)

  const availableFields = [
    { id: 'foto', label: 'Foto do Produto' },
    { id: 'codigo', label: 'Código do Produto' },
    { id: 'cod_fabrica', label: 'Código de Fábrica' },
    { id: 'nome', label: 'Nome do Produto' },
    { id: 'categoria', label: 'Categoria' },
    { id: 'marca', label: 'Marca' },
    { id: 'capacidade', label: 'Capacidade/Tamanho' },
    { id: 'quantidade', label: 'Quantidade em Estoque' },
    { id: 'custo_unitario', label: 'Custo Unitário' },
    { id: 'custos_totais', label: 'Custos Adicionais Totais' },
    { id: 'custo_final', label: 'Custo Final do Produto' },
    { id: 'valor_site', label: 'Valor Sugerido pelo Site da Marca' },
    { id: 'preco_venda', label: 'Valor de Venda' },
    { id: 'lucro_bruto', label: 'Lucro Bruto' },
    { id: 'margem_lucro', label: 'Margem de Lucro' },
    { id: 'fornecedor', label: 'Fornecedor' },
    { id: 'lote', label: 'Lote / Nota Fiscal' },
    { id: 'status', label: 'Status' },
  ]
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'codigo',
    'nome',
    'quantidade',
    'custo_final',
    'preco_venda',
    'status',
  ])
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const toggleField = (id: string) => {
    setSelectedFields((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('is_admin, role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          setIsAdmin(data?.is_admin || data?.role === 'admin')
        })
    }
  }, [user])

  useEffect(() => {
    const fetchProdutos = async () => {
      const { data } = await supabase
        .from('produtos')
        .select('*, fornecedores(nome)')
        .order('created_at', { ascending: false })

      if (data) setProdutos(data)
      setLoading(false)
    }
    fetchProdutos()
  }, [])

  const handleStatusChange = async (id: string, novoStatus: string) => {
    const { error } = await supabase.from('produtos').update({ status: novoStatus }).eq('id', id)
    if (!error) {
      setProdutos(produtos.map((p) => (p.id === id ? { ...p, status: novoStatus } : p)))
      toast({
        title: 'Status atualizado',
        description: 'O status do produto foi atualizado com sucesso.',
      })
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      })
    }
  }

  const handleGenerateReport = (format: 'pdf' | 'xls') => {
    if (produtos.length === 0) {
      return toast({ title: 'Aviso', description: 'Nenhum produto para exportar.' })
    }
    if (selectedFields.length === 0) {
      return toast({
        title: 'Aviso',
        description: 'Selecione pelo menos um campo para o relatório.',
        variant: 'destructive',
      })
    }

    const summableFields = [
      'quantidade',
      'custo_unitario',
      'custos_totais',
      'custo_final',
      'preco_venda',
      'lucro_bruto',
      'valor_site',
    ]
    const totals: Record<string, number> = {}
    summableFields.forEach((f) => (totals[f] = 0))

    if (format === 'xls') {
      const headers = availableFields
        .filter((f) => selectedFields.includes(f.id))
        .map((f) => f.label)
      const rows = produtos.map((p) => {
        const rowData: any[] = []

        const despesas = Number(p.despesas_adicionais || 0)
        const impostos = p.custo_unitario
          ? (p.custo_unitario * (Number(p.imposto1 || 0) + Number(p.imposto2 || 0))) / 100
          : 0
        const frete = Number(p.valor_frete_unitario || 0)
        const custosTotais = despesas + impostos + frete

        const lucroBruto = (p.preco_venda || 0) - (p.custo_final || 0)
        const margemLucro = p.preco_venda > 0 ? (lucroBruto / p.preco_venda) * 100 : 0

        totals['quantidade'] += p.quantidade || 0
        totals['custo_unitario'] += p.custo_unitario || 0
        totals['custos_totais'] += custosTotais
        totals['custo_final'] += p.custo_final || 0
        totals['preco_venda'] += p.preco_venda || 0
        totals['lucro_bruto'] += lucroBruto
        totals['valor_site'] += p.valor_site || 0

        availableFields.forEach((f) => {
          if (selectedFields.includes(f.id)) {
            switch (f.id) {
              case 'foto':
                rowData.push(p.imagem_url || '')
                break
              case 'codigo':
                rowData.push(p.codigo || '')
                break
              case 'cod_fabrica':
                rowData.push(p.cod_fabrica || '')
                break
              case 'nome':
                rowData.push(p.nome || '')
                break
              case 'categoria':
                rowData.push(p.categoria || '')
                break
              case 'marca':
                rowData.push(p.marca || '')
                break
              case 'capacidade':
                rowData.push(p.capacidade || '')
                break
              case 'quantidade':
                rowData.push(p.quantidade || 0)
                break
              case 'custo_unitario':
                rowData.push(p.custo_unitario || 0)
                break
              case 'custos_totais':
                rowData.push(custosTotais.toFixed(2))
                break
              case 'custo_final':
                rowData.push(p.custo_final || 0)
                break
              case 'valor_site':
                rowData.push(p.valor_site || 0)
                break
              case 'preco_venda':
                rowData.push(p.preco_venda || 0)
                break
              case 'lucro_bruto':
                rowData.push(lucroBruto.toFixed(2))
                break
              case 'margem_lucro':
                rowData.push(margemLucro.toFixed(2) + '%')
                break
              case 'fornecedor':
                rowData.push(p.fornecedores?.nome || '')
                break
              case 'lote':
                rowData.push(p.lote || '')
                break
              case 'status':
                rowData.push(p.status || '')
                break
            }
          }
        })

        return rowData.map((d) => `"${String(d).replace(/"/g, '""')}"`).join(',')
      })

      let totalsRowData: any[] = []
      let putTotalLabel = false
      availableFields.forEach((f) => {
        if (selectedFields.includes(f.id)) {
          if (summableFields.includes(f.id)) {
            totalsRowData.push(totals[f.id].toFixed(f.id === 'quantidade' ? 0 : 2))
          } else {
            if (!putTotalLabel) {
              totalsRowData.push('TOTAL')
              putTotalLabel = true
            } else {
              totalsRowData.push('')
            }
          }
        }
      })
      const csvTotals = totalsRowData.map((d) => `"${String(d).replace(/"/g, '""')}"`).join(',')

      const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows, csvTotals].join('\n')
      const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
        type: 'text/csv;charset=utf-8;',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', 'relatorio_estoque.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({ title: 'Sucesso', description: 'Relatório XLS gerado com sucesso!' })
      setIsReportModalOpen(false)
    } else if (format === 'pdf') {
      toast({ title: 'Gerando PDF', description: 'Preparando impressão do relatório...' })

      const printWindow = window.open('', '', 'width=800,height=600')
      if (printWindow) {
        const headers = availableFields
          .filter((f) => selectedFields.includes(f.id))
          .map((f) => f.label)

        let html = `
          <html>
            <head>
              <title>Relatório de Estoque</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f7; }
                @media print {
                  @page { margin: 1cm; size: landscape; }
                }
              </style>
            </head>
            <body>
              <h1>Relatório de Estoque</h1>
              <table>
                <thead>
                  <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
        `

        produtos.forEach((p) => {
          html += '<tr>'
          const despesas = Number(p.despesas_adicionais || 0)
          const impostos = p.custo_unitario
            ? (p.custo_unitario * (Number(p.imposto1 || 0) + Number(p.imposto2 || 0))) / 100
            : 0
          const frete = Number(p.valor_frete_unitario || 0)
          const custosTotais = despesas + impostos + frete

          const lucroBruto = (p.preco_venda || 0) - (p.custo_final || 0)
          const margemLucro = p.preco_venda > 0 ? (lucroBruto / p.preco_venda) * 100 : 0

          availableFields.forEach((f) => {
            if (selectedFields.includes(f.id)) {
              switch (f.id) {
                case 'foto':
                  html += `<td>${p.imagem_url ? `<img src="${p.imagem_url}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />` : ''}</td>`
                  break
                case 'codigo':
                  html += `<td>${p.codigo || ''}</td>`
                  break
                case 'cod_fabrica':
                  html += `<td>${p.cod_fabrica || ''}</td>`
                  break
                case 'nome':
                  html += `<td>${p.nome || ''}</td>`
                  break
                case 'categoria':
                  html += `<td>${p.categoria || ''}</td>`
                  break
                case 'marca':
                  html += `<td>${p.marca || ''}</td>`
                  break
                case 'capacidade':
                  html += `<td>${p.capacidade || ''}</td>`
                  break
                case 'quantidade':
                  html += `<td>${p.quantidade || 0}</td>`
                  break
                case 'custo_unitario':
                  html += `<td>R$ ${(p.custo_unitario || 0).toFixed(2)}</td>`
                  break
                case 'custos_totais':
                  html += `<td>R$ ${custosTotais.toFixed(2)}</td>`
                  break
                case 'custo_final':
                  html += `<td>R$ ${(p.custo_final || 0).toFixed(2)}</td>`
                  break
                case 'valor_site':
                  html += `<td>R$ ${(p.valor_site || 0).toFixed(2)}</td>`
                  break
                case 'preco_venda':
                  html += `<td>R$ ${(p.preco_venda || 0).toFixed(2)}</td>`
                  break
                case 'lucro_bruto':
                  html += `<td>R$ ${lucroBruto.toFixed(2)}</td>`
                  break
                case 'margem_lucro':
                  html += `<td>${margemLucro.toFixed(2)}%</td>`
                  break
                case 'fornecedor':
                  html += `<td>${p.fornecedores?.nome || ''}</td>`
                  break
                case 'lote':
                  html += `<td>${p.lote || ''}</td>`
                  break
                case 'status':
                  html += `<td>${p.status || ''}</td>`
                  break
              }
            }
          })
          html += '</tr>'
        })

        let putTotalLabelPdf = false
        html += '<tfoot><tr style="background-color: #f5f5f7; font-weight: bold;">'
        availableFields.forEach((f) => {
          if (selectedFields.includes(f.id)) {
            if (summableFields.includes(f.id)) {
              const val = totals[f.id]
              if (f.id === 'quantidade') {
                html += `<td>${val}</td>`
              } else {
                html += `<td>R$ ${val.toFixed(2)}</td>`
              }
            } else {
              if (!putTotalLabelPdf) {
                html += `<td>TOTAL</td>`
                putTotalLabelPdf = true
              } else {
                html += `<td></td>`
              }
            }
          }
        })
        html += '</tr></tfoot>'

        html += `
                </tbody>
              </table>
              <script>
                window.onload = () => {
                  window.print();
                  setTimeout(() => window.close(), 500);
                }
              </script>
            </body>
          </html>
        `
        printWindow.document.write(html)
        printWindow.document.close()
      }
      setIsReportModalOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em preparação':
        return 'border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10'
      case 'Estoque':
        return 'border-[#10B981] text-[#10B981] bg-[#10B981]/10'
      case 'Reservado':
        return 'border-[#3B82F6] text-[#3B82F6] bg-[#3B82F6]/10'
      case 'Garantia':
        return 'border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/10'
      case 'Devolução':
        return 'border-[#EF4444] text-[#EF4444] bg-[#EF4444]/10'
      case 'Vendido':
        return 'border-[#6B7280] text-[#6B7280] bg-[#6B7280]/10'
      default:
        return 'border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Controle de Estoque
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os produtos, categorias e alertas.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="shadow-sm bg-white border-[#D1D1D1] gap-2">
                <PackageSearch className="w-4 h-4" /> Relatório
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] bg-white">
              <DialogHeader>
                <DialogTitle>Gerador de Relatórios</DialogTitle>
                <DialogDescription>
                  Selecione as informações que deseja incluir no seu relatório de estoque.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto">
                {availableFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`field-${field.id}`}
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={() => toggleField(field.id)}
                    />
                    <label
                      htmlFor={`field-${field.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {field.label}
                    </label>
                  </div>
                ))}
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <div className="flex flex-1 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-[#D1D1D1]"
                    onClick={() => setSelectedFields(availableFields.map((f) => f.id))}
                  >
                    Marcar Todos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-[#D1D1D1]"
                    onClick={() => setSelectedFields([])}
                  >
                    Limpar
                  </Button>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    onClick={() => handleGenerateReport('pdf')}
                    className="flex-1 sm:flex-none bg-[#3B82F6] hover:bg-[#2563EB] text-white border-0 shadow-sm"
                  >
                    Gerar PDF
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleGenerateReport('xls')}
                    className="flex-1 sm:flex-none bg-[#10B981] hover:bg-[#059669] text-white border-0 shadow-sm"
                  >
                    Gerar XLS
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button asChild className="shadow-subtle gap-2">
            <Link to="/estoque/novo">
              <Plus className="w-4 h-4" /> Novo Produto
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-[#D1D1D1] shadow-subtle bg-white">
        <CardHeader>
          <CardTitle>Catálogo Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#D1D1D1] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F5F5F7]">
                <TableRow className="border-[#D1D1D1]">
                  <TableHead className="font-semibold w-[80px]">Foto</TableHead>
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Produto</TableHead>
                  <TableHead className="font-semibold">Categoria</TableHead>
                  <TableHead className="font-semibold">Qtd. Estoque</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Carregando catálogo...
                    </TableCell>
                  </TableRow>
                ) : produtos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum produto cadastrado no estoque.
                    </TableCell>
                  </TableRow>
                ) : (
                  produtos.map((p) => (
                    <TableRow key={p.id} className="border-[#D1D1D1] hover:bg-[#F5F5F7]/50">
                      <TableCell>
                        {p.imagem_url ? (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <div className="w-10 h-10 rounded-md border border-gray-200 overflow-hidden cursor-pointer flex items-center justify-center bg-gray-50">
                                <img
                                  src={p.imagem_url}
                                  alt={p.nome}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent
                              className="w-64 p-2 bg-white"
                              side="right"
                              align="center"
                            >
                              <div className="flex flex-col space-y-2">
                                <div className="rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                                  <img
                                    src={p.imagem_url}
                                    alt={p.nome}
                                    className="w-full h-auto object-contain max-h-[250px]"
                                  />
                                </div>
                                <span className="text-sm font-medium text-center text-foreground">
                                  {p.nome}
                                </span>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ) : (
                          <div
                            className="w-10 h-10 rounded-md border border-gray-100 flex items-center justify-center bg-gray-50 text-gray-400"
                            title="Sem foto"
                          >
                            <ImageOff className="w-4 h-4" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-muted-foreground">
                        {p.codigo || '-'}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">{p.nome}</TableCell>
                      <TableCell>{p.categoria || '-'}</TableCell>
                      <TableCell className="font-bold">{p.quantidade || 0}</TableCell>
                      <TableCell>
                        {isAdmin ? (
                          <Select
                            value={p.status || 'Em preparação'}
                            onValueChange={(value) => handleStatusChange(p.id, value)}
                          >
                            <SelectTrigger
                              className={`h-8 text-xs font-semibold w-[140px] ${getStatusColor(p.status || 'Em preparação')}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Em preparação">Em preparação</SelectItem>
                              <SelectItem value="Estoque">Estoque</SelectItem>
                              <SelectItem value="Reservado">Reservado</SelectItem>
                              <SelectItem value="Garantia">Garantia</SelectItem>
                              <SelectItem value="Devolução">Devolução</SelectItem>
                              <SelectItem value="Vendido">Vendido</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            variant="outline"
                            className={`font-semibold ${getStatusColor(p.status || 'Em preparação')}`}
                          >
                            {p.status || 'Em preparação'}
                          </Badge>
                        )}
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
