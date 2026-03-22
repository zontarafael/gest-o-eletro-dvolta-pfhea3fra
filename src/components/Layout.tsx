import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#F5F5F7] bg-[radial-gradient(#d1d1d1_1px,transparent_1px)] [background-size:24px_24px] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto animate-fade-in w-full">
          <div className="max-w-[1600px] mx-auto w-full h-full">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
