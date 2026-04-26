import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ImageOff } from 'lucide-react'

export function EstoqueTable({ produtos, loading, isAdmin, handleStatusChange }: any) {
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
            produtos.map((p: any) => (
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
                      <HoverCardContent className="w-64 p-2 bg-white" side="right" align="center">
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
                      onValueChange={(v) => handleStatusChange(p.id, v)}
                    >
                      <SelectTrigger
                        className={`h-8 text-xs font-semibold w-[140px] ${getStatusColor(p.status || 'Em preparação')}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          'Em preparação',
                          'Estoque',
                          'Reservado',
                          'Garantia',
                          'Devolução',
                          'Vendido',
                        ].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
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
  )
}
