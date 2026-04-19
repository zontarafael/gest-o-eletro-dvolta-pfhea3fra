import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search, Plus, Trash2, User } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function ClienteSection({ onChange }: { onChange?: (c: any) => void }) {
  const [search, setSearch] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [customer, setCustomer] = useState<any>(null)
  const [phones, setPhones] = useState<string[]>([''])

  const handleSearch = async () => {
    if (!search.trim()) return
    setHasSearched(true)

    const { data } = await supabase
      .from('clientes')
      .select('*')
      .or(`nome.ilike.%${search}%,documento.ilike.%${search}%`)
      .limit(1)
      .single()

    if (data) {
      setCustomer(data)
      setPhones(data.telefones && data.telefones.length > 0 ? data.telefones : [''])
      if (onChange) onChange({ ...data, telefones: data.telefones })
    } else {
      const empty = {
        nome: '',
        documento: '',
        rua: '',
        numero: '',
        bairro: '',
        referencia: '',
        cidade: '',
        estado: '',
        cep: '',
        email: '',
      }
      setCustomer(empty)
      setPhones([''])
      if (onChange) onChange({ ...empty, telefones: [''] })
    }
  }

  const updateCustomer = (field: string, val: string) => {
    const updated = { ...customer, [field]: val }
    setCustomer(updated)
    if (onChange) onChange({ ...updated, telefones: phones })
  }

  const handleAddPhone = () => setPhones([...phones, ''])
  const handleRemovePhone = (i: number) => {
    const newP = phones.filter((_, idx) => idx !== i)
    setPhones(newP)
    if (onChange) onChange({ ...customer, telefones: newP })
  }
  const handlePhoneChange = (val: string, i: number) => {
    const newP = [...phones]
    newP[i] = val
    setPhones(newP)
    if (onChange) onChange({ ...customer, telefones: newP })
  }

  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5 text-primary" /> 1. Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-2 items-end">
          <div className="space-y-2 flex-1 w-full">
            <Label>Buscar Cliente (Nome ou CPF/CNPJ)</Label>
            <Input
              placeholder="Digite para buscar e tecle Enter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-[#F5F5F7] border-[#D1D1D1]"
            />
          </div>
          <Button onClick={handleSearch} type="button" className="gap-2 w-full sm:w-auto shadow-sm">
            <Search className="w-4 h-4" /> Buscar
          </Button>
        </div>

        {hasSearched && customer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#D1D1D1] animate-fade-in">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={customer.nome}
                onChange={(e) => updateCustomer('nome', e.target.value)}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>CPF ou CNPJ</Label>
              <Input
                value={customer.documento}
                onChange={(e) => updateCustomer('documento', e.target.value)}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>CEP</Label>
              <Input
                value={customer.cep}
                onChange={(e) => updateCustomer('cep', e.target.value)}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>Nome da Rua</Label>
              <Input
                value={customer.rua}
                onChange={(e) => updateCustomer('rua', e.target.value)}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                value={customer.numero}
                onChange={(e) => updateCustomer('numero', e.target.value)}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input
                value={customer.bairro}
                onChange={(e) => updateCustomer('bairro', e.target.value)}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>Referência</Label>
              <Input
                value={customer.referencia}
                onChange={(e) => updateCustomer('referencia', e.target.value)}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                value={customer.cidade}
                onChange={(e) => updateCustomer('cidade', e.target.value)}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Input
                value={customer.estado}
                onChange={(e) => updateCustomer('estado', e.target.value)}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                value={customer.email}
                onChange={(e) => updateCustomer('email', e.target.value)}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>

            <div className="space-y-2 md:col-span-2 mt-2">
              <div className="flex items-center justify-between">
                <Label>Telefones</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddPhone}
                  className="h-8 gap-1 border-[#D1D1D1] bg-white"
                >
                  <Plus className="w-3 h-3" /> Adicionar Número
                </Button>
              </div>
              <div className="space-y-3">
                {phones.map((p, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      value={p}
                      onChange={(e) => handlePhoneChange(e.target.value, i)}
                      placeholder="(00) 00000-0000"
                      className="bg-[#F5F5F7] border-[#D1D1D1] max-w-sm"
                    />
                    {phones.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePhone(i)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
