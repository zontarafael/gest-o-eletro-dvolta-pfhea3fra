import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProdutosListProps {
  produtos: any[]
  freteTotal: number
  totalCusto: number
}

export function ProdutosList({ produtos, freteTotal, totalCusto }: ProdutosListProps) {
  if (produtos.length === 0) return null

  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Itens Registrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-[#D1D1D1] overflow-hidden">
          <Table>
            <TableHeader className="bg-[#F5F5F7]">
              <TableRow className="border-[#D1D1D1]">
                <TableHead className="font-semibold">Nome do Produto</TableHead>
                <TableHead className="font-semibold text-right">Qtd.</TableHead>
                <TableHead className="font-semibold text-right">Custo Un.</TableHead>
                <TableHead className="font-semibold text-right">Custo Total</TableHead>
                <TableHead className="font-semibold text-right text-primary">
                  Frete Un. Proporcional
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((p: any) => {
                const custoTotalItem = p.quantidade * p.custoUnitario
                const proporcao = totalCusto > 0 ? custoTotalItem / totalCusto : 0
                const freteUnitario = p.quantidade > 0 ? (freteTotal * proporcao) / p.quantidade : 0

                return (
                  <TableRow key={p.id} className="border-[#D1D1D1] hover:bg-[#F5F5F7]/50">
                    <TableCell className="font-medium text-foreground">
                      {p.nome || 'Produto sem nome'}
                    </TableCell>
                    <TableCell className="text-right">{p.quantidade}</TableCell>
                    <TableCell className="text-right">R$ {p.custoUnitario.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {custoTotalItem.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      R$ {freteUnitario.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
