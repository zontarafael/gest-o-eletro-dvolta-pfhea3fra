import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { availableFields, summableFields, formatFieldValue } from '@/lib/report-utils'

export function ReportPreviewTab({ data, selectedFields, totals }: any) {
  const activeFields = availableFields.filter((f) => selectedFields.includes(f.id))

  if (activeFields.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Selecione pelo menos um campo na aba Configuração.
      </div>
    )
  }

  return (
    <div className="rounded-md border max-h-[50vh] overflow-auto mt-4">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10 shadow-sm">
          <TableRow>
            {activeFields.map((f) => (
              <TableHead key={f.id} className="whitespace-nowrap font-semibold">
                {f.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 50).map((row: any, i: number) => (
            <TableRow key={i}>
              {activeFields.map((f) => (
                <TableCell key={f.id} className="whitespace-nowrap">
                  {f.id === 'foto' && row.imagem_url ? (
                    <img src={row.imagem_url} alt="" className="w-8 h-8 rounded object-cover" />
                  ) : (
                    formatFieldValue(f.id, row[f.id])
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="sticky bottom-0 z-10 bg-muted/90 font-bold backdrop-blur-sm">
          <TableRow>
            {activeFields.map((f, i) => (
              <TableCell key={f.id} className="whitespace-nowrap">
                {summableFields.includes(f.id)
                  ? formatFieldValue(f.id, totals[f.id])
                  : i === 0
                    ? 'TOTAL'
                    : ''}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
      {data.length > 50 && (
        <div className="p-2 text-center text-xs text-muted-foreground bg-muted/30 border-t">
          Mostrando apenas os primeiros 50 registros no preview. Baixe o relatório para ver todos.
        </div>
      )}
    </div>
  )
}
