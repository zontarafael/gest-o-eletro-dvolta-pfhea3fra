import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      toast({ title: 'Erro ao entrar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Bem-vindo(a) de volta!', description: 'Login realizado com sucesso.' })
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-bold text-primary">Eletro DVolta</CardTitle>
          <CardDescription>Faça login para acessar o sistema de gestão</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-6 h-12 text-md font-medium"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar na Plataforma'}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-6">
            Dica: Use o e-mail cadastrado nas sementes (zontarafael@yahoo.com.br / Skip@Pass)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
