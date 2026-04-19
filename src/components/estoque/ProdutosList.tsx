import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

export function ProdutosList({
  produtos,
  freteTotal,
  totalCusto,
  onEdit,
  onDelete,
}: {
  produtos: any[]
  freteTotal: number
  totalCusto: number
  onEdit?: (produto: any) => void
  onDelete?: (id: string) => void
}) {
  if (produtos.length === 0) return null

  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Itens Registrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Qtd.</TableHead>
                <TableHead>Custo Unit.</TableHead>
                <TableHead>Frete Unit.</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((p) => {
                const custoTotalItem = p.quantidade * p.custoUnitario
                const proporcao = totalCusto > 0 ? custoTotalItem / totalCusto : 0
                const freteUnitario = p.quantidade > 0 ? (freteTotal * proporcao) / p.quantidade : 0
                const subtotal = custoTotalItem + freteUnitario * p.quantidade

                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.nome}
                      {p.codigo && (
                        <span className="text-xs text-muted-foreground block">Cód: {p.codigo}</span>
                      )}
                    </TableCell>
                    <TableCell>{p.quantidade}</TableCell>
                    <TableCell>R$ {p.custoUnitario.toFixed(2)}</TableCell>
                    <TableCell>R$ {freteUnitario.toFixed(2)}</TableCell>
                    <TableCell>R$ {subtotal.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(p)}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(p.id)}
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                      </div>
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
