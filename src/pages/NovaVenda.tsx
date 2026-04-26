import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ClienteSection } from '@/components/vendas/ClienteSection'
import { ProdutosSection } from '@/components/vendas/ProdutosSection'
import { TransporteSection } from '@/components/vendas/TransporteSection'
import { PagamentoSection, PagamentoMisto } from '@/components/vendas/PagamentoSection'
import { AssinaturaSection } from '@/components/vendas/AssinaturaSection'
import { ImpressoesSection } from '@/components/vendas/ImpressoesSection'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export default function NovaVenda() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const [cliente, setCliente] = useState<any>(null)
  const [produtos, setProdutos] = useState<any[]>([])
  const [pagamento, setPagamento] = useState('vista')
  const [pagamentosMistos, setPagamentosMistos] = useState<PagamentoMisto[]>([
    { forma: '', valor: 0 },
  ])
  const [assinatura, setAssinatura] = useState(false)
  const [loading, setLoading] = useState(false)
  const [parcelas, setParcelas] = useState(1)

  const total = produtos.reduce((acc, p) => acc + p.preco * p.qtd, 0)

  useEffect(() => {
    if (!editId) return

    const fetchVenda = async () => {
      setLoading(true)
      const { data: venda } = await supabase
        .from('vendas')
        .select('*, clientes(*)')
        .eq('id', editId)
        .single()

      if (venda) {
        if (venda.clientes) setCliente(venda.clientes)
        setPagamento(venda.forma_pagamento || 'vista')
        setAssinatura(venda.assinatura_digital || false)

        const { data: itens } = await supabase
          .from('venda_itens')
          .select('*, produtos(*)')
          .eq('venda_id', editId)

        if (itens) {
          const mappedProdutos = itens.map((i) => ({
            id: i.produto_id || 'N/A',
            nome: i.produtos?.nome || 'Produto Desconhecido',
            preco: i.preco_unitario,
            qtd: i.quantidade,
            tipo: i.produtos?.categoria || 'Produto Novo',
            key: i.id || Date.now() + Math.random(),
            estoque: (i.produtos?.quantidade || 0) + i.quantidade,
          }))
          setProdutos(mappedProdutos)
        }

        const { data: movs } = await supabase
          .from('movimentacoes_financeiras')
          .select('*')
          .like('descricao', `Venda ${venda.codigo}%`)

        if (movs && movs.length > 0) {
          if (venda.forma_pagamento === 'credito') {
            setParcelas(movs.length)
          }
        }
      }
      setLoading(false)
    }
    fetchVenda()
  }, [editId])

  const handleSave = async () => {
    if (!user) return
    if (!cliente?.nome) {
      toast({
        title: 'Atenção',
        description: 'Selecione ou cadastre um cliente.',
        variant: 'destructive',
      })
      return
    }
    if (produtos.length === 0) {
      toast({
        title: 'Atenção',
        description: 'Adicione pelo menos um produto.',
        variant: 'destructive',
      })
      return
    }

    if (pagamento === 'credito' && (parcelas < 1 || isNaN(parcelas))) {
      toast({
        title: 'Atenção',
        description: 'Informe uma quantidade válida de parcelas.',
        variant: 'destructive',
      })
      return
    }

    if (pagamento === 'misto') {
      const mistoTotal = pagamentosMistos.reduce((acc, pm) => acc + (pm.valor || 0), 0)
      if (Math.abs(mistoTotal - total) > 0.01) {
        toast({
          title: 'Atenção',
          description: `A soma dos pagamentos (R$ ${mistoTotal.toFixed(2)}) deve ser igual ao total da venda (R$ ${total.toFixed(2)}).`,
          variant: 'destructive',
        })
        return
      }

      const hasEmptyForma = pagamentosMistos.some((pm) => !pm.forma)
      if (hasEmptyForma) {
        toast({
          title: 'Atenção',
          description: 'Selecione a forma de pagamento para todos os itens mistos.',
          variant: 'destructive',
        })
        return
      }

      const hasInvalidCredito = pagamentosMistos.some(
        (pm) => pm.forma === 'credito' && (!pm.parcelas || pm.parcelas < 1),
      )
      if (hasInvalidCredito) {
        toast({
          title: 'Atenção',
          description:
            'Informe uma quantidade válida de parcelas para os pagamentos em cartão de crédito (Misto).',
          variant: 'destructive',
        })
        return
      }
    }

    const outOfStock = produtos.find(
      (p) => p.id !== 'N/A' && p.estoque !== undefined && p.qtd > p.estoque,
    )
    if (outOfStock) {
      toast({
        title: 'Estoque Insuficiente',
        description: `O produto "${outOfStock.nome}" possui apenas ${outOfStock.estoque} unidade(s) em estoque.`,
        variant: 'destructive',
      })
      return
    }

    const invalidQtd = produtos.find((p) => p.qtd <= 0)
    if (invalidQtd) {
      toast({
        title: 'Quantidade Inválida',
        description: `A quantidade do produto "${invalidQtd.nome}" deve ser maior que zero.`,
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    let clienteId = cliente.id
    if (!clienteId) {
      const { data: newC } = await supabase
        .from('clientes')
        .insert({
          user_id: user.id,
          nome: cliente.nome,
          documento: cliente.documento,
          rua: cliente.rua,
          numero: cliente.numero,
          bairro: cliente.bairro,
          referencia: cliente.referencia,
          cidade: cliente.cidade,
          estado: cliente.estado,
          cep: cliente.cep,
          email: cliente.email,
          telefones: cliente.telefones,
        })
        .select()
        .single()
      if (newC) clienteId = newC.id
    }

    let vendaId = editId
    let codigo = ''

    if (editId) {
      const { data: currentVenda } = await supabase
        .from('vendas')
        .select('codigo')
        .eq('id', editId)
        .single()
      codigo = currentVenda?.codigo || ''

      await supabase
        .from('vendas')
        .update({
          cliente_id: clienteId,
          valor_total: total,
          forma_pagamento: pagamento,
          assinatura_digital: assinatura,
        })
        .eq('id', editId)
    } else {
      const { data: lastVenda } = await supabase
        .from('vendas')
        .select('codigo')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      let nextNum = 1
      if (lastVenda?.codigo) {
        const match = lastVenda.codigo.match(/PED-(\d+)/)
        if (match) {
          nextNum = parseInt(match[1], 10) + 1
        }
      }
      codigo = `PED-${nextNum.toString().padStart(4, '0')}`

      const { data: venda } = await supabase
        .from('vendas')
        .insert({
          user_id: user.id,
          cliente_id: clienteId,
          valor_total: total,
          status: 'Concluído',
          forma_pagamento: pagamento,
          assinatura_digital: assinatura,
          codigo,
        })
        .select()
        .single()

      if (venda) vendaId = venda.id
    }

    if (vendaId) {
      if (editId) {
        await supabase.from('venda_itens').delete().eq('venda_id', editId)
        if (codigo) {
          await supabase
            .from('movimentacoes_financeiras')
            .delete()
            .like('descricao', `Venda ${codigo}%`)
        }
      }

      const itens = produtos
        .map((p) => ({
          venda_id: vendaId,
          produto_id: p.id !== 'N/A' ? p.id : null,
          quantidade: p.qtd,
          preco_unitario: p.preco,
          subtotal: p.preco * p.qtd,
        }))
        .filter((i) => i.produto_id)

      if (itens.length > 0) {
        await supabase.from('venda_itens').insert(itens)
      }

      if (pagamento === 'misto' && pagamentosMistos.length > 0) {
        const movimentacoes: any[] = []
        pagamentosMistos.forEach((pm) => {
          if (pm.forma === 'credito' && pm.parcelas && pm.parcelas > 0) {
            const valorParcela = pm.valor / pm.parcelas
            for (let i = 1; i <= pm.parcelas; i++) {
              const dataVencimento = new Date()
              dataVencimento.setDate(dataVencimento.getDate() + i * 30)
              movimentacoes.push({
                user_id: user.id,
                descricao: `Venda ${codigo} - ${cliente.nome} (${pm.forma} - Parcela ${i}/${pm.parcelas})`,
                tipo: 'Receita',
                valor: valorParcela,
                status: 'Pendente',
                data_movimentacao: dataVencimento.toISOString(),
              })
            }
          } else {
            movimentacoes.push({
              user_id: user.id,
              descricao: `Venda ${codigo} - ${cliente.nome} (${pm.forma})`,
              tipo: 'Receita',
              valor: pm.valor,
              status: 'Liquidado',
            })
          }
        })
        await supabase.from('movimentacoes_financeiras').insert(movimentacoes)
      } else if (pagamento === 'credito') {
        const movimentacoes = []
        const valorParcela = total / parcelas
        for (let i = 1; i <= parcelas; i++) {
          const dataVencimento = new Date()
          dataVencimento.setDate(dataVencimento.getDate() + i * 30)

          movimentacoes.push({
            user_id: user.id,
            descricao: `Venda ${codigo} - ${cliente.nome} (Parcela ${i}/${parcelas})`,
            tipo: 'Receita',
            valor: valorParcela,
            status: 'Pendente',
            data_movimentacao: dataVencimento.toISOString(),
          })
        }
        await supabase.from('movimentacoes_financeiras').insert(movimentacoes)
      } else {
        await supabase.from('movimentacoes_financeiras').insert({
          user_id: user.id,
          descricao: `Venda ${codigo} - ${cliente.nome}`,
          tipo: 'Receita',
          valor: total,
          status: 'Liquidado',
        })
      }
    }

    setLoading(false)
    toast({
      title: editId ? 'Venda Atualizada' : 'Venda Registrada',
      description: 'Venda salva no banco de dados com sucesso.',
    })
    navigate('/vendas')
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-12 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="rounded-full shadow-subtle border-[#D1D1D1] bg-white hover:bg-[#F5F5F7] transition-colors shrink-0"
        >
          <Link to="/vendas">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            {editId ? 'Editar Venda' : 'Nova Venda'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {editId
              ? 'Atualize as informações do pedido de venda.'
              : 'Registre um novo pedido de venda.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ClienteSection cliente={cliente} onChange={setCliente} />
        <ProdutosSection produtos={produtos} onChange={setProdutos} />
        {TransporteSection && <TransporteSection />}
        <PagamentoSection
          pagamento={pagamento}
          parcelas={parcelas}
          total={total}
          onChange={setPagamento}
          onMistoChange={setPagamentosMistos}
          onParcelasChange={setParcelas}
        />
        <AssinaturaSection {...({ assinatura } as any)} onChange={setAssinatura} />
        <ImpressoesSection />

        <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-[#D1D1D1]">
          <Button variant="outline" asChild className="shadow-subtle bg-white border-[#D1D1D1]">
            <Link to="/vendas">Cancelar</Link>
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="gap-2 shadow-subtle px-8 transition-transform hover:-translate-y-0.5"
          >
            <CheckCircle2 className="w-5 h-5" />{' '}
            {loading ? 'Salvando...' : editId ? 'Salvar Alterações' : 'Finalizar Venda'}
          </Button>
        </div>
      </div>
    </div>
  )
}
