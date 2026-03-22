import { Home, Building2, Users, ShoppingCart, Target, Package, DollarSign } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

const navItems = [
  { title: 'Dashboard', path: '/', icon: Home },
  { title: 'Empresa', path: '/empresa', icon: Building2 },
  { title: 'Clientes', path: '/clientes', icon: Users },
  { title: 'Vendas', path: '/vendas', icon: ShoppingCart },
  { title: 'CRM', path: '/crm', icon: Target },
  { title: 'Estoque', path: '/estoque', icon: Package },
  { title: 'Financeiro', path: '/financeiro', icon: DollarSign },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar
      collapsible="icon"
      className="bg-gradient-to-b from-[#F5F5F7]/90 to-[#E5E4E2]/90 backdrop-blur-md border-r border-[#D1D1D1]"
    >
      <SidebarHeader className="h-16 flex justify-center border-b border-black/5">
        <div className="flex items-center gap-2 overflow-hidden px-2 w-full group-data-[collapsible=icon]:justify-center mt-2">
          <div className="w-8 h-8 shrink-0 bg-primary rounded-lg flex items-center justify-center shadow-subtle">
            <Target className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg whitespace-nowrap group-data-[collapsible=icon]:hidden text-foreground">
            Eletro DVolta
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-6 px-2">
        <SidebarMenu className="gap-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.path}
                tooltip={item.title}
                className="transition-all duration-300 data-[active=true]:bg-white data-[active=true]:shadow-subtle data-[active=true]:border data-[active=true]:border-[#D1D1D1] data-[active=true]:text-primary py-5 rounded-xl hover:translate-x-1"
              >
                <Link to={item.path} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="font-semibold whitespace-nowrap">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
