import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, Loader2, ImagePlus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

export default function Empresa() {
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    razao_social: 'Eletro DVolta Comércio S.A.',
    cnpj: '12.345.678/0001-90',
    email: 'contato@eletrodvolta.com.br',
    telefone: '(11) 4002-8922',
    endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    logo_url: '',
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('empresa_config')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setFormData({
          razao_social: data.razao_social || '',
          cnpj: data.cnpj || '',
          email: data.email || '',
          telefone: data.telefone || '',
          endereco: data.endereco || '',
          logo_url: data.logo_url || '',
        })
      }
    } catch (error: any) {
      console.error('Erro ao carregar configurações:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados da empresa.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Arquivo inválido',
          description: 'Por favor, selecione uma imagem.',
          variant: 'destructive',
        })
        return
      }

      setUploading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('empresa_logos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('empresa_logos').getPublicUrl(filePath)

      setFormData((prev) => ({ ...prev, logo_url: data.publicUrl }))
      toast({ title: 'Upload concluído', description: 'Logotipo atualizado com sucesso.' })
    } catch (error: any) {
      console.error('Erro no upload:', error)
      toast({
        title: 'Erro no upload',
        description: error.message || 'Não foi possível enviar a imagem.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data: existing } = await supabase
        .from('empresa_config')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      const payload = {
        razao_social: formData.razao_social,
        cnpj: formData.cnpj,
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco,
        logo_url: formData.logo_url,
        updated_at: new Date().toISOString(),
      }

      if (existing) {
        const { error } = await supabase
          .from('empresa_config')
          .update(payload)
          .eq('id', existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('empresa_config')
          .insert({ ...payload, user_id: user.id })
        if (error) throw error
      }

      toast({ title: 'Sucesso', description: 'Dados da empresa salvos com sucesso.' })
    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      toast({
        title: 'Erro ao salvar',
        description: 'Ocorreu um problema ao salvar os dados.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Dados da Empresa</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie as informações corporativas e estrutura.
        </p>
      </div>

      <Card className="border-[#D1D1D1] shadow-subtle bg-white">
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Informações públicas da empresa para emissão de notas e contatos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#D1D1D1]">
            <Avatar className="w-24 h-24 border rounded-xl shadow-sm bg-[#F5F5F7]">
              {formData.logo_url ? (
                <AvatarImage
                  src={formData.logo_url}
                  alt="Logo da Empresa"
                  className="object-contain"
                />
              ) : (
                <AvatarFallback className="rounded-xl bg-transparent">
                  <ImagePlus className="w-8 h-8 text-muted-foreground" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-sm font-semibold text-foreground">Logotipo da Empresa</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Recomendado: Imagens em PNG ou JPG.
              </p>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" /> Alterar Logo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <Label className="font-semibold text-foreground">Razão Social</Label>
              <Input
                name="razao_social"
                value={formData.razao_social}
                onChange={handleInputChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-3">
              <Label className="font-semibold text-foreground">CNPJ</Label>
              <Input
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-3">
              <Label className="font-semibold text-foreground">E-mail de Contato</Label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
            <div className="space-y-3">
              <Label className="font-semibold text-foreground">Telefone Principal</Label>
              <Input
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                className="bg-[#F5F5F7] border-[#D1D1D1]"
              />
            </div>
          </div>

          <Separator className="my-6 bg-[#D1D1D1]" />

          <div className="space-y-3">
            <Label className="font-semibold text-foreground">Endereço Sede</Label>
            <Input
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              className="bg-[#F5F5F7] border-[#D1D1D1]"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="shadow-subtle hover:-translate-y-0.5 transition-transform rounded-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
