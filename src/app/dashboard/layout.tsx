import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { LogOut, Package, LayoutDashboard, Settings, FileText, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/theme-toggle'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session_provider_id')

    if (!session) {
        redirect('/login')
    }

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '#', label: 'Mis Productos', icon: Package },
        { href: '#', label: 'Documentación', icon: FileText },
        { href: '#', label: 'Configuración', icon: Settings },
    ]

    return (
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-72 bg-card border-r border-border flex flex-col fixed h-full z-20 transition-colors duration-300">
                <div className="p-8">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(196,214,0,0.3)]">
                                <span className="font-black text-primary-foreground text-sm italic tracking-tighter">FC</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-lg font-bold tracking-tight leading-none">Family<span className="text-primary italic">Cash</span></h1>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Portal Proveedores</span>
                            </div>
                        </div>
                        <ModeToggle />
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = item.href === '/dashboard' // Simple check for demo
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all group font-bold text-xs uppercase tracking-widest",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                    {item.label}
                                </div>
                                {isActive && <ChevronRight size={14} strokeWidth={3} />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 border-t border-border mt-auto">
                    <div className="bg-muted/50 rounded-2xl p-4 mb-4 border border-border/50">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1 text-center">Sesión Activa</p>
                        <p className="text-xs font-bold text-center truncate">{session.value}</p>
                    </div>
                    <form action={async () => {
                        'use server'
                        const cookieStore = await cookies();
                        cookieStore.delete('session_provider_id')
                        redirect('/login')
                    }}>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-bold text-xs uppercase tracking-widest transition-all"
                        >
                            <LogOut size={18} />
                            Cerrar Sesión
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72">
                <div className="min-h-screen p-8 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    )
}
