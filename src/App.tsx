import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import { AuthProvider } from './hooks/use-auth'
import ProtectedRoute from './components/ProtectedRoute'

import Index from './pages/Index'
import Empresa from './pages/Empresa'
import Clientes from './pages/Clientes'
import Vendas from './pages/Vendas'
import NovaVenda from './pages/NovaVenda'
import EditarVenda from './pages/EditarVenda'
import CRM from './pages/CRM'
import Estoque from './pages/Estoque'
import NovoProduto from './pages/NovoProduto'
import Financeiro from './pages/Financeiro'
import NotFound from './pages/NotFound'
import Login from './pages/Login'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Index />} />
            <Route path="/empresa" element={<Empresa />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/vendas" element={<Vendas />} />
            <Route path="/vendas/nova" element={<NovaVenda />} />
            <Route path="/vendas/:id" element={<EditarVenda />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/estoque/novo" element={<NovoProduto />} />
            <Route path="/financeiro" element={<Financeiro />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
