import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-4 bg-white/70 backdrop-blur-md border-b border-[#D1D1D1] sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors" />
        <h1 className="text-xl font-bold text-foreground tracking-tight hidden sm:block">
          Plataforma de Gestão
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative hover:bg-muted rounded-full">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-white" />
        </Button>
        <Avatar className="w-9 h-9 border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors duration-300">
          <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female" />
          <AvatarFallback>ED</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
