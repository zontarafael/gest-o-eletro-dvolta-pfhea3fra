import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Bot, Send, Sparkles } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function AIAssistant() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Olá! Sou seu Assistente de IA Eletro DVolta. Como posso extrair ou analisar os dados da plataforma para você hoje?',
    },
  ])

  const handleSend = () => {
    if (!query.trim()) return
    setMessages([...messages, { role: 'user', text: query }])
    setQuery('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Analisando os dados... Com base nas métricas recentes da empresa, o faturamento apresentou um aumento sólido, com o setor de Vendas se destacando. Precisa de mais detalhes sobre CRM ou Estoque?',
        },
      ])
    }, 1000)
  }

  return (
    <Card
      className="border-border shadow-sm bg-card overflow-hidden animate-fade-in-up"
      style={{ animationDelay: '200ms' }}
    >
      <CardHeader className="border-b border-border bg-muted/50 pb-4 py-3">
        <CardTitle className="flex items-center gap-2 text-lg text-primary font-bold">
          <Bot className="w-6 h-6" />
          Consulta de Inteligência
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col">
        <ScrollArea className="h-64 p-4 flex-1">
          <div className="flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm border border-border'}`}
                >
                  {msg.role === 'ai' && (
                    <Sparkles className="inline-block w-3.5 h-3.5 mr-2 mb-0.5 text-primary" />
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 bg-card border-t border-border flex gap-3 items-end">
          <Textarea
            placeholder="Interaja com a IA para solicitar informações sobre faturamento, vendas, CRM..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[50px] h-[50px] resize-none rounded-xl focus-visible:ring-primary/50 text-sm py-3 border-input bg-muted/30"
            onKeyDown={(e) =>
              e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())
            }
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="h-[50px] w-[50px] rounded-xl shrink-0 shadow-sm hover:-translate-y-0.5 transition-transform"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
