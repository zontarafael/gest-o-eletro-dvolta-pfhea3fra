import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search, Plus, Trash2, User } from 'lucide-react'

const MOCK_CUSTOMERS = [
  {
    nome: 'João Silva',
    doc: '111.111.111-11',
    rua: 'Rua das Flores',
    num: '123',
    bairro: 'Centro',
    ref: 'Próximo ao banco',
    cid: 'São Paulo',
    est: 'SP',
    cep: '01000-000',
    email: 'joao@email.com',
    telefones: ['(11) 99999-9999'],
  },
  {
    nome: 'Empresa X',
    doc: '22.222.222/0001-22',
    rua: 'Av. Paulista',
    num: '1000',
    bairro: 'Bela Vista',
    ref: 'Edifício Central',
    cid: 'São Paulo',
    est: 'SP',
    cep: '01310-100',
    email: 'contato@empresax.com',
    telefones: ['(11) 4002-8922'],
  },
]

export function ClienteSection() {
  const [search, setSearch] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [customer, setCustomer] = useState<any>(null)
  const [phones, setPhones] = useState<string[]>([''])

  const handleSearch = () => {
    setHasSearched(true)
    const found = MOCK_CUSTOMERS.find(
      (c) => c.nome.toLowerCase().includes(search.toLowerCase()) || c.doc.includes(search),
    )
    if (found) {
      setCustomer(found)
      setPhones(found.telefones)
    } else {
      setCustomer({
        nome: '',
        doc: '',
        rua: '',
        num: '',
        bairro: '',
        ref: '',
        cid: '',
        est: '',
        cep: '',
        email: '',
      })
      setPhones([''])
    }
  }

  const handleAddPhone = () => setPhones([...phones, ''])
  const handleRemovePhone = (i: number) => setPhones(phones.filter((_, idx) => idx !== i))
  const handlePhoneChange = (val: string, i: number) => {
    const newP = [...phones]
    newP[i] = val
    setPhones(newP)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (customer) setCustomer({ ...customer, [e.target.name]: e.target.value })
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
          <Button onClick={handleSearch} className="gap-2 w-full sm:w-auto shadow-sm">
            <Search className="w-4 h-4" /> Buscar
          </Button>
        </div>

        {hasSearched && customer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#D1D1D1] animate-fade-in">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                name="nome"
                value={customer.nome}
                onChange={handleChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>CPF ou CNPJ</Label>
              <Input
                name="doc"
                value={customer.doc}
                onChange={handleChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>CEP</Label>
              <Input
                name="cep"
                value={customer.cep}
                onChange={handleChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>Nome da Rua</Label>
              <Input
                name="rua"
                value={customer.rua}
                onChange={handleChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                name="num"
                value={customer.num}
                onChange={handleChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input
                name="bairro"
                value={customer.bairro}
                onChange={handleChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>Referência</Label>
              <Input
                name="ref"
                value={customer.ref}
                onChange={handleChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                name="cid"
                value={customer.cid}
                onChange={handleChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Input
                name="est"
                value={customer.est}
                onChange={handleChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                name="email"
                value={customer.email}
                onChange={handleChange}
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
