import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'

import Index from './pages/Index'
import Empresa from './pages/Empresa'
import Clientes from './pages/Clientes'
import Vendas from './pages/Vendas'
import CRM from './pages/CRM'
import Estoque from './pages/Estoque'
import Financeiro from './pages/Financeiro'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/empresa" element={<Empresa />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/vendas" element={<Vendas />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/financeiro" element={<Financeiro />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
