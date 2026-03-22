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
      text: 'Olá! Sou seu Assistente Eletro DVolta. Como posso ajudar com os dados hoje?',
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
          text: 'Analisando os dados... O faturamento da última semana teve um aumento de 12% em relação à semana anterior, impulsionado pelo setor de Eletrodomésticos.',
        },
      ])
    }, 1000)
  }

  return (
    <Card
      className="border-[#D1D1D1] shadow-subtle bg-white overflow-hidden animate-fade-in-up"
      style={{ animationDelay: '200ms' }}
    >
      <CardHeader className="border-b border-black/5 bg-gradient-to-r from-[#F5F5F7] to-white pb-4 py-3">
        <CardTitle className="flex items-center gap-2 text-lg text-foreground font-bold">
          <Bot className="text-primary w-6 h-6" />
          Assistente Inteligente Eletro DVolta
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
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-[#F5F5F7] text-foreground rounded-bl-sm border border-[#D1D1D1]/50'}`}
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
        <div className="p-4 bg-white border-t border-black/5 flex gap-3 items-end">
          <Textarea
            placeholder="Pergunte sobre faturamento, estoque, conversões..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[50px] h-[50px] resize-none rounded-xl focus-visible:ring-primary/50 text-sm py-3 border-[#D1D1D1] bg-[#F5F5F7]"
            onKeyDown={(e) =>
              e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())
            }
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="h-[50px] w-[50px] rounded-xl shrink-0 shadow-subtle hover:-translate-y-0.5 transition-transform"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
