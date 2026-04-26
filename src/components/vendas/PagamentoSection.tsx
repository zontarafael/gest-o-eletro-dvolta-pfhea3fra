import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CreditCard, Plus, Trash2 } from 'lucide-react'

export interface PagamentoMisto {
  forma: string
  valor: number
  parcelas?: number
}

interface PagamentoSectionProps {
  total: number
  onChange?: (v: string) => void
  onMistoChange?: (pagamentos: PagamentoMisto[]) => void
  onParcelasChange?: (parcelas: number) => void
}

export function PagamentoSection({
  total,
  onChange,
  onMistoChange,
  onParcelasChange,
}: PagamentoSectionProps) {
  const [tipo, setTipo] = useState('vista')
  const [mistos, setMistos] = useState<PagamentoMisto[]>([{ forma: '', valor: 0 }])
  const [parcelasStr, setParcelasStr] = useState('1')

  const handleTipoChange = (val: string) => {
    setTipo(val)
    if (onChange) onChange(val)
  }

  const addMisto = () => {
    const newMistos = [...mistos, { forma: '', valor: 0 }]
    setMistos(newMistos)
    if (onMistoChange) onMistoChange(newMistos)
  }

  const removeMisto = (index: number) => {
    const newMistos = mistos.filter((_, i) => i !== index)
    setMistos(newMistos)
    if (onMistoChange) onMistoChange(newMistos)
  }

  const updateMisto = (index: number, field: keyof PagamentoMisto, value: string | number) => {
    const newMistos = [...mistos]
    newMistos[index] = { ...newMistos[index], [field]: value }
    setMistos(newMistos)
    if (onMistoChange) onMistoChange(newMistos)
  }

  return (
    <Card className="border-[#D1D1D1] shadow-subtle bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="w-5 h-5 text-primary" /> 4. Forma de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Opção de Pagamento</Label>
            <Select defaultValue="vista" onValueChange={handleTipoChange}>
              <SelectTrigger className="w-full bg-[#F5F5F7] border-[#D1D1D1]">
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vista">A vista em dinheiro, PIX ou cartão de débito</SelectItem>
                <SelectItem value="credito">Cartão de Crédito</SelectItem>
                <SelectItem value="boleto">No boleto bancário</SelectItem>
                <SelectItem value="cheque">No cheque</SelectItem>
                <SelectItem value="misto">Misto (Mais de uma opção)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {tipo === 'credito' && (
            <div className="space-y-3 pt-4 mt-2 border-t border-[#D1D1D1] animate-in fade-in slide-in-from-top-2">
              <Label>Quantidade de Parcelas</Label>
              <Input
                type="number"
                min={1}
                max={120}
                value={parcelasStr}
                onChange={(e) => {
                  setParcelasStr(e.target.value)
                  const parsed = parseInt(e.target.value, 10)
                  if (!isNaN(parsed) && parsed > 0) {
                    if (onParcelasChange) onParcelasChange(parsed)
                  }
                }}
                className="bg-white border-[#D1D1D1] w-full sm:w-48"
                placeholder="Ex: 3"
              />
              {(() => {
                const p = parseInt(parcelasStr, 10)
                if (isNaN(p) || p <= 0) return null
                const valorParcela = total / p
                const items = []
                for (let i = 1; i <= p; i++) {
                  const dataVencimento = new Date()
                  dataVencimento.setDate(dataVencimento.getDate() + i * 30)
                  items.push(
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 border-b border-[#D1D1D1] last:border-0 text-sm"
                    >
                      <span className="text-muted-foreground">
                        Parcela {i}/{p}
                      </span>
                      <span className="text-muted-foreground">
                        {dataVencimento.toLocaleDateString('pt-BR')}
                      </span>
                      <span className="font-medium text-foreground">
                        R${' '}
                        {valorParcela.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>,
                  )
                }
                return (
                  <div className="mt-4 p-4 bg-[#F5F5F7] rounded-md border border-[#D1D1D1]">
                    <h4 className="text-sm font-semibold mb-3">Detalhamento das Parcelas</h4>
                    <div className="max-h-60 overflow-y-auto pr-2">{items}</div>
                  </div>
                )
              })()}
            </div>
          )}

          {tipo === 'misto' && (
            <div className="space-y-3 pt-4 mt-2 border-t border-[#D1D1D1] animate-in fade-in slide-in-from-top-2">
              <Label>Pagamentos (Misto)</Label>
              {mistos.map((misto, index) => (
                <div
                  key={index}
                  className="p-3 bg-white border border-[#D1D1D1] rounded-md space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="w-full sm:flex-1">
                      <Select
                        value={misto.forma}
                        onValueChange={(val) => updateMisto(index, 'forma', val)}
                      >
                        <SelectTrigger className="bg-white border-[#D1D1D1]">
                          <SelectValue placeholder="Forma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dinheiro">Dinheiro</SelectItem>
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="debito">Cartão de Débito</SelectItem>
                          <SelectItem value="credito">Cartão de Crédito</SelectItem>
                          <SelectItem value="boleto">Boleto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full sm:w-40 flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Valor (R$)"
                        className="bg-white border-[#D1D1D1] flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={misto.valor || ''}
                        onChange={(e) =>
                          updateMisto(index, 'valor', parseFloat(e.target.value) || 0)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => removeMisto(index)}
                        disabled={mistos.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {misto.forma === 'credito' && misto.valor > 0 && (
                    <div className="space-y-3 pt-2 border-t border-[#D1D1D1] animate-in fade-in slide-in-from-top-2">
                      <Label>Quantidade de Parcelas</Label>
                      <Input
                        type="number"
                        min={1}
                        max={120}
                        value={misto.parcelas || ''}
                        onChange={(e) => {
                          const parsed = parseInt(e.target.value, 10)
                          updateMisto(index, 'parcelas', isNaN(parsed) ? 0 : parsed)
                        }}
                        className="bg-white border-[#D1D1D1] w-full sm:w-48"
                        placeholder="Ex: 3"
                      />
                      {(() => {
                        const p = Number(misto.parcelas)
                        if (isNaN(p) || p <= 0) return null
                        const valorParcela = misto.valor / p
                        const items = []
                        for (let i = 1; i <= p; i++) {
                          const dataVencimento = new Date()
                          dataVencimento.setDate(dataVencimento.getDate() + i * 30)
                          items.push(
                            <div
                              key={i}
                              className="flex justify-between items-center py-1.5 border-b border-[#D1D1D1] last:border-0 text-sm"
                            >
                              <span className="text-muted-foreground">
                                Parcela {i}/{p}
                              </span>
                              <span className="text-muted-foreground">
                                {dataVencimento.toLocaleDateString('pt-BR')}
                              </span>
                              <span className="font-medium text-foreground">
                                R${' '}
                                {valorParcela.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>,
                          )
                        }
                        return (
                          <div className="mt-3 p-3 bg-[#F5F5F7] rounded-md border border-[#D1D1D1]">
                            <h4 className="text-sm font-semibold mb-2">
                              Detalhamento das Parcelas
                            </h4>
                            <div className="max-h-40 overflow-y-auto pr-2">{items}</div>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-primary border-primary hover:bg-primary/10 w-full sm:w-auto"
                onClick={addMisto}
              >
                <Plus className="w-4 h-4 mr-2" /> Adicionar Pagamento
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
