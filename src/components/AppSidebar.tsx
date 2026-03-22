import { Building2, Users, ShoppingCart, Target, Package, DollarSign } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar'

const navItems = [
  { title: 'Empresa', path: '/empresa', icon: Building2 },
  { title: 'Clientes', path: '/clientes', icon: Users },
  { title: 'Vendas', path: '/vendas', icon: ShoppingCart },
  { title: 'CRM', path: '/crm', icon: Target },
  { title: 'Estoque', path: '/estoque', icon: Package },
  { title: 'Financeiro', path: '/financeiro', icon: DollarSign },
]

export function AppSidebar() {
  const location = useLocation()
  const { setOpen } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="bg-card border-r border-border shadow-sm transition-all duration-300"
    >
      <SidebarHeader className="h-16 flex justify-center border-b border-border px-2">
        <Link
          to="/"
          className="flex items-center gap-2 overflow-hidden w-full group-data-[collapsible=icon]:justify-center mt-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 shrink-0 bg-primary rounded-lg flex items-center justify-center shadow-subtle">
            <Target className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="font-bold text-lg whitespace-nowrap group-data-[collapsible=icon]:hidden text-primary">
            Eletro DVolta
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-6 px-2">
        <SidebarMenu className="gap-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.path}
                tooltip={item.title}
                className="transition-all duration-300 data-[active=true]:bg-primary/10 data-[active=true]:shadow-sm data-[active=true]:border data-[active=true]:border-primary/20 data-[active=true]:text-primary py-5 rounded-xl hover:bg-muted"
              >
                <Link to={item.path} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium whitespace-nowrap">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
