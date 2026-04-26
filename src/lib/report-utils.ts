export const availableFields = [
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
  { id: 'valor_site', label: 'Valor Sugerido (Site)' },
  { id: 'preco_venda', label: 'Valor de Venda' },
  { id: 'lucro_bruto', label: 'Lucro Bruto' },
  { id: 'margem_lucro', label: 'Margem de Lucro' },
  { id: 'fornecedor', label: 'Fornecedor' },
  { id: 'lote', label: 'Lote / Nota Fiscal' },
  { id: 'status', label: 'Status' },
]

export const summableFields = [
  'quantidade',
  'custo_unitario',
  'custos_totais',
  'custo_final',
  'preco_venda',
  'lucro_bruto',
  'valor_site',
]

export function formatFieldValue(fieldId: string, value: any) {
  if (value === null || value === undefined) return '-'
  if (
    [
      'custo_unitario',
      'custos_totais',
      'custo_final',
      'valor_site',
      'preco_venda',
      'lucro_bruto',
    ].includes(fieldId)
  ) {
    return `R$ ${Number(value).toFixed(2)}`
  }
  if (fieldId === 'margem_lucro') return `${Number(value).toFixed(2)}%`
  if (fieldId === 'foto') return value ? 'Sim' : 'Não'
  return String(value)
}

export function processReportData(produtos: any[]) {
  const totals: Record<string, number> = {}
  summableFields.forEach((f) => (totals[f] = 0))

  const processedData = produtos.map((p) => {
    const despesas = Number(p.despesas_adicionais || 0)
    const impostos = p.custo_unitario
      ? (p.custo_unitario * (Number(p.imposto1 || 0) + Number(p.imposto2 || 0))) / 100
      : 0
    const frete = Number(p.valor_frete_unitario || 0)
    const custosTotais = despesas + impostos + frete

    const lucroBruto = (p.preco_venda || 0) - (p.custo_final || 0)
    const margemLucro = p.preco_venda > 0 ? (lucroBruto / p.preco_venda) * 100 : 0

    totals['quantidade'] += Number(p.quantidade) || 0
    totals['custo_unitario'] += Number(p.custo_unitario) || 0
    totals['custos_totais'] += custosTotais
    totals['custo_final'] += Number(p.custo_final) || 0
    totals['preco_venda'] += Number(p.preco_venda) || 0
    totals['lucro_bruto'] += lucroBruto
    totals['valor_site'] += Number(p.valor_site) || 0

    return {
      ...p,
      custos_totais: custosTotais,
      lucro_bruto: lucroBruto,
      margem_lucro: margemLucro,
      fornecedor: p.fornecedores?.nome || '',
    }
  })

  return { processedData, totals }
}

export function generateXLS(
  processedData: any[],
  selectedFields: string[],
  totals: Record<string, number>,
) {
  const activeFields = availableFields.filter((f) => selectedFields.includes(f.id))
  const headers = activeFields.map((f) => f.label)

  const rows = processedData.map((p) => {
    return activeFields
      .map((f) => {
        if (f.id === 'foto') return p.imagem_url || ''
        const val = formatFieldValue(f.id, p[f.id])
        return `"${String(val).replace(/"/g, '""')}"`
      })
      .join(',')
  })

  let putTotalLabel = false
  const totalsRow = activeFields
    .map((f) => {
      if (summableFields.includes(f.id)) {
        return `"${formatFieldValue(f.id, totals[f.id])}"`
      } else {
        if (!putTotalLabel) {
          putTotalLabel = true
          return '"TOTAL"'
        }
        return '""'
      }
    })
    .join(',')

  const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows, totalsRow].join('\n')
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
}

export function generatePDF(
  processedData: any[],
  selectedFields: string[],
  totals: Record<string, number>,
) {
  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) return

  const activeFields = availableFields.filter((f) => selectedFields.includes(f.id))
  const headers = activeFields.map((f) => f.label)

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
          @media print { @page { margin: 1cm; size: landscape; } }
        </style>
      </head>
      <body>
        <h1>Relatório de Estoque</h1>
        <table>
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
  `

  processedData.forEach((p) => {
    html += '<tr>'
    activeFields.forEach((f) => {
      if (f.id === 'foto' && p.imagem_url) {
        html += `<td><img src="${p.imagem_url}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" /></td>`
      } else {
        html += `<td>${formatFieldValue(f.id, p[f.id])}</td>`
      }
    })
    html += '</tr>'
  })

  html += '<tfoot><tr style="background-color: #f5f5f7; font-weight: bold;">'
  let putTotalLabelPdf = false
  activeFields.forEach((f) => {
    if (summableFields.includes(f.id)) {
      html += `<td>${formatFieldValue(f.id, totals[f.id])}</td>`
    } else {
      if (!putTotalLabelPdf) {
        html += `<td>TOTAL</td>`
        putTotalLabelPdf = true
      } else {
        html += `<td></td>`
      }
    }
  })
  html += '</tr></tfoot>'

  html += `
          </tbody>
        </table>
        <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }</script>
      </body>
    </html>
  `
  printWindow.document.write(html)
  printWindow.document.close()
}
