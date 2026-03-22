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
import { Plus, PackageSearch } from 'lucide-react'

const produtos = [
  {
    id: 'PRD-001',
    nome: 'Smart TV 55" OLED',
    categoria: 'Eletrodomésticos',
    qtd: 45,
    status: 'Normal',
  },
  { id: 'PRD-002', nome: 'Notebook Pro 15', categoria: 'Eletrônicos', qtd: 8, status: 'Baixo' },
  { id: 'PRD-003', nome: 'Cabo HDMI 2m', categoria: 'Acessórios', qtd: 150, status: 'Normal' },
  {
    id: 'PRD-004',
    nome: 'Ar Condicionado 12000 BTUs',
    categoria: 'Eletrodomésticos',
    qtd: 2,
    status: 'Crítico',
  },
  { id: 'PRD-005', nome: 'Monitor Curvo 27"', categoria: 'Eletrônicos', qtd: 24, status: 'Normal' },
]

export default function Estoque() {
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
          <Button variant="outline" className="shadow-sm bg-white border-[#D1D1D1] gap-2">
            <PackageSearch className="w-4 h-4" /> Relatório
          </Button>
          <Button className="shadow-subtle gap-2">
            <Plus className="w-4 h-4" /> Novo Produto
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
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Produto</TableHead>
                  <TableHead className="font-semibold">Categoria</TableHead>
                  <TableHead className="font-semibold">Qtd. Estoque</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((p) => (
                  <TableRow key={p.id} className="border-[#D1D1D1] hover:bg-[#F5F5F7]/50">
                    <TableCell className="font-medium text-muted-foreground">{p.id}</TableCell>
                    <TableCell className="font-semibold text-foreground">{p.nome}</TableCell>
                    <TableCell>{p.categoria}</TableCell>
                    <TableCell className="font-bold">{p.qtd}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`font-semibold ${
                          p.status === 'Normal'
                            ? 'border-[#10B981] text-[#10B981] bg-[#10B981]/10'
                            : p.status === 'Baixo'
                              ? 'border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10'
                              : 'border-destructive text-destructive bg-destructive/10'
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
