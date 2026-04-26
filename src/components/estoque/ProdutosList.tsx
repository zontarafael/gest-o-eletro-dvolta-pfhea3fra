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
                <TableHead>Custos Totais</TableHead>
                <TableHead>Custo Total Prod.</TableHead>
                <TableHead>Total Multiplicado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((p) => {
                const custoUnitario = Number(p.custoUnitario) || 0
                const custoTotalItemBase = p.quantidade * custoUnitario
                const proporcao = totalCusto > 0 ? custoTotalItemBase / totalCusto : 0
                const freteUnitario = p.quantidade > 0 ? (freteTotal * proporcao) / p.quantidade : 0

                let despesas = 0
                if (Array.isArray(p.despesas_detalhadas)) {
                  despesas = p.despesas_detalhadas.reduce(
                    (acc: number, d: any) => acc + (Number(d.valor) || 0),
                    0,
                  )
                } else if (Array.isArray(p.despesas)) {
                  despesas = p.despesas.reduce(
                    (acc: number, d: any) => acc + (Number(d.valor) || 0),
                    0,
                  )
                } else {
                  despesas = Number(p.despesasAdicionais || p.despesas_adicionais || 0)
                }

                let impostos = 0
                if (Array.isArray(p.impostos_detalhados)) {
                  impostos = p.impostos_detalhados.reduce(
                    (acc: number, i: any) => acc + (custoUnitario * (Number(i.valor) || 0)) / 100,
                    0,
                  )
                } else if (Array.isArray(p.impostos)) {
                  impostos = p.impostos.reduce(
                    (acc: number, i: any) => acc + (custoUnitario * (Number(i.valor) || 0)) / 100,
                    0,
                  )
                } else {
                  impostos =
                    (custoUnitario * (Number(p.imposto1) || 0)) / 100 +
                    (custoUnitario * (Number(p.imposto2) || 0)) / 100
                }

                const custosTotais = freteUnitario + despesas + impostos
                const custoTotalProduto = custoUnitario + custosTotais
                const totalMultiplicado = custoTotalProduto * p.quantidade

                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.nome}
                      {p.codigo && (
                        <span className="text-xs text-muted-foreground block">Cód: {p.codigo}</span>
                      )}
                    </TableCell>
                    <TableCell>{p.quantidade}</TableCell>
                    <TableCell>R$ {custoUnitario.toFixed(2)}</TableCell>
                    <TableCell>R$ {custosTotais.toFixed(2)}</TableCell>
                    <TableCell>R$ {custoTotalProduto.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">
                      R$ {totalMultiplicado.toFixed(2)}
                    </TableCell>
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
