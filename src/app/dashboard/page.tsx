import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Search, Plus, Filter, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

async function getDashboardData(providerId: string, query?: string) {
    const whereClause: any = {
        ARA_PRO: providerId,
        ...(query ? {
            OR: [
                { ARA_DS: { contains: query, mode: 'insensitive' } },
                { ARA_EAN: { contains: query, mode: 'insensitive' } }
            ]
        } : {})
    };

    const [products, totalCount, pendingCount, activeCount] = await Promise.all([
        prisma.lU_ARA.findMany({
            where: whereClause,
            select: {
                ARA_ID: true,
                ARA_DS: true,
                ARA_MARCA: true,
                ARA_EAN: true,
                ARA_STATUS: true,
            },
            orderBy: { UPDATE_AT: 'desc' },
            take: 50
        }),
        prisma.lU_ARA.count({ where: { ARA_PRO: providerId } }),
        prisma.lU_ARA.count({ where: { ARA_PRO: providerId, NOT: { ARA_STATUS: 1 } } }),
        prisma.lU_ARA.count({ where: { ARA_PRO: providerId, ARA_STATUS: 1 } })
    ]);

    console.log(`Dashboard Stats for ${providerId}: Total=${totalCount}, Pending=${pendingCount}, Active=${activeCount}`);

    return { products, stats: { totalCount: Number(totalCount), pendingCount: Number(pendingCount), activeCount: Number(activeCount) } }
}

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const cookieStore = await cookies();
    const providerId = cookieStore.get('session_provider_id')?.value

    const { q } = await searchParams
    const { products, stats } = await getDashboardData(providerId!, q)

    return (
        <div className="space-y-10 max-w-7xl mx-auto py-4 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                        <span className="font-black text-primary-foreground text-sm italic tracking-tighter">FC</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Gestión de Artículos</h2>
                        <p className="text-muted-foreground text-sm mt-0.5 font-medium tracking-tight">Control de catálogo técnico</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="h-11 px-8 rounded-full font-bold shadow-lg shadow-primary/10 transition-all hover:translate-y-[-2px] active:translate-y-0">
                        <Plus className="mr-2" size={18} />
                        Añadir Artículo
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="bg-card border-border rounded-2xl overflow-hidden hover:shadow-md transition-all">
                    <CardHeader className="p-6">
                        <CardTitle className="text-[10px] items-center flex gap-2 font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            Total Productos
                        </CardTitle>
                        <div className="text-4xl font-extrabold mt-1 tabular-nums">{stats.totalCount}</div>
                    </CardHeader>
                </Card>

                <Card className="bg-card border-border rounded-2xl overflow-hidden hover:shadow-md transition-all">
                    <CardHeader className="p-6">
                        <CardTitle className="text-[10px] items-center flex gap-2 font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            Pendientes
                        </CardTitle>
                        <div className="flex items-baseline gap-3 mt-1">
                            <div className="text-4xl font-extrabold tabular-nums">{stats.pendingCount}</div>
                            {stats.pendingCount > 0 && (
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black tracking-widest px-2 py-0.5 border-none animate-pulse">
                                    Atención
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                </Card>

                <Card className="bg-card border-border rounded-2xl overflow-hidden hover:shadow-md transition-all">
                    <CardHeader className="p-6">
                        <CardTitle className="text-[10px] items-center flex gap-2 font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            Validados
                        </CardTitle>
                        <div className="text-4xl font-extrabold text-muted-foreground mt-1 tabular-nums">{stats.activeCount}</div>
                    </CardHeader>
                </Card>
            </div>

            {/* List Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/30 p-2 rounded-2xl border border-border/50">
                    <form className="relative flex-1 max-w-md group" action="/dashboard" method="GET">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            name="q"
                            defaultValue={q}
                            placeholder="Buscar por descripción o EAN..."
                            className="h-11 bg-transparent border-none rounded-none pl-12 focus-visible:ring-0 text-sm placeholder:text-muted-foreground/60"
                        />
                    </form>

                    <Button variant="ghost" size="sm" className="h-10 text-muted-foreground font-bold uppercase tracking-widest text-[10px] hover:bg-background rounded-xl px-6">
                        <Filter className="mr-2" size={14} />
                        Filtros Avanzados
                    </Button>
                </div>

                <Card className="border-border bg-card shadow-sm rounded-3xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="px-8 py-5 text-muted-foreground font-bold uppercase tracking-[0.1em] text-[10px]">Artículo</TableHead>
                                <TableHead className="px-8 py-5 text-muted-foreground font-bold uppercase tracking-[0.1em] text-[10px] text-center">Referencia</TableHead>
                                <TableHead className="px-8 py-5 text-muted-foreground font-bold uppercase tracking-[0.1em] text-[10px] text-center whitespace-nowrap">Estado</TableHead>
                                <TableHead className="px-8 py-5 text-muted-foreground font-bold uppercase tracking-[0.1em] text-[10px] text-right">Acción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={String(product.ARA_ID)} className="border-border/50 hover:bg-muted/20 group transition-all">
                                    <TableCell className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm group-hover:text-primary transition-colors leading-tight">
                                                {product.ARA_DS || '---'}
                                            </span>
                                            <span className="text-[10px] font-black uppercase text-muted-foreground mt-1.5 tracking-tighter">
                                                {product.ARA_MARCA || 'Genérico'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-center">
                                        <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                                            {String(product.ARA_ID)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`h-1.5 w-1.5 rounded-full ${Number(product.ARA_STATUS) === 1
                                                    ? 'bg-primary shadow-[0_0_8px_rgba(196,214,0,0.5)]'
                                                    : 'bg-orange-500/50'
                                                }`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${Number(product.ARA_STATUS) === 1 ? 'text-primary' : 'text-muted-foreground/60'
                                                }`}>
                                                {Number(product.ARA_STATUS) === 1 ? 'Valido' : 'Pendiente'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-right">
                                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group/btn" asChild>
                                            <Link href={`/dashboard/product/${String(product.ARA_ID)}`}>
                                                <ArrowRight size={20} strokeWidth={1.5} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {products.length === 0 && (
                        <div className="py-32 text-center flex flex-col items-center gap-4">
                            <div className="p-4 bg-muted rounded-full text-muted-foreground">
                                <Search size={32} />
                            </div>
                            <p className="text-muted-foreground text-sm font-medium">No se han encontrado resultados técnicos para tu búsqueda.</p>
                            <Button variant="link" className="text-primary font-bold uppercase text-[10px] tracking-widest" asChild>
                                <Link href="/dashboard">Limpiar Filtros</Link>
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
            <p className="text-center text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em] pt-8">© 2026 Family Cash S.L.</p>
        </div>
    )
}
