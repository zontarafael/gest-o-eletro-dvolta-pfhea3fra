import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, PackageSearch, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { ReportDialog } from '@/components/estoque/ReportDialog'
import { EstoqueTable } from '@/components/estoque/EstoqueTable'

export default function Estoque() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('is_admin, role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setIsAdmin(data?.is_admin || data?.role === 'admin'))
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
          <Button
            variant="outline"
            className="shadow-sm bg-white border-[#D1D1D1] gap-2"
            onClick={() => setIsReportModalOpen(true)}
          >
            <PackageSearch className="w-4 h-4" /> Relatório
          </Button>
          <Button asChild className="shadow-subtle gap-2">
            <Link to="/estoque/novo">
              <Plus className="w-4 h-4" /> Novo Produto
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-[#D1D1D1] shadow-subtle bg-white">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Catálogo Atual</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar