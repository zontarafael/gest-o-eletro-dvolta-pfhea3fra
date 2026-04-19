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
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

export default function Clientes() {
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClientes = async () => {
      const { data } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setClientes(data)
      setLoading(false)
    }
    fetchClientes()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Gestão de Clientes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Base de dados e histórico de relacionamento.
          </p>
        </div>
        <Button className="shadow-subtle hover:-translate-y-0.5 transition-transform rounded-lg gap-2">
          <UserPlus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      <Card className="border-[#D1D1D1] shadow-subtle bg-white">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
          <CardTitle className="text-lg">Todos os Clientes</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              className="pl-9 bg-[#F5F5F7] border-[#D1D1D1]"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#D1D1D1] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F5F5F7]">
                <TableRow className="border-[#D1D1D1]">
                  <TableHead className="font-semibold text-foreground">Nome</TableHead>
                  <TableHead className="font-semibold text-foreground">E-mail</TableHead>
                  <TableHead className="font-semibold text-foreground">Data Cadastro</TableHead>
                  <TableHead className="font-semibold text-foreground">Total Gasto</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Carregando clientes...
                    </TableCell>
                  </TableRow>
                ) : clientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((c) => (
                    <TableRow
                      key={c.id}
                      className="border-[#D1D1D1] hover:bg-[#F5F5F7]/50 transition-colors"
                    >
                      <TableCell className="font-medium text-foreground">{c.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{c.email || 'N/A'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-medium">
                        R${' '}
                        {Number(c.total_gasto || 0).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={c.status === 'Ativo' ? 'default' : 'secondary'}
                          className={
                            c.status === 'Ativo'
                              ? 'bg-[#10B981] hover:bg-[#10B981]/90'
                              : 'bg-[#848482] text-white hover:bg-[#848482]/90'
                          }
                        >
                          {c.status}
                        </Badge>
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
