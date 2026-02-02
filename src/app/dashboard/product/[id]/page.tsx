import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import Link from 'next/link'
import { ArrowLeft, Send, Sparkles, Hash } from 'lucide-react'
import { updateProduct, sendToValidation } from '@/actions/product'
import { ProductEditForm } from './edit-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

async function getProduct(id: string) {
    try {
        const product = await prisma.lU_ARA.findUnique({
            where: { ARA_ID: new Prisma.Decimal(id) }
        })
        return product
    } catch (e) {
        return null
    }
}

function serializeProduct(product: any) {
    const serialized = { ...product }
    for (const key in serialized) {
        const val = serialized[key]
        if (val instanceof Prisma.Decimal) {
            serialized[key] = val.toString()
        } else if (val instanceof Date) {
            serialized[key] = val.toISOString()
        } else if (typeof val === 'bigint') {
            serialized[key] = val.toString()
        }
    }
    return serialized
}

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const rawProduct = await getProduct(id)

    if (!rawProduct) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground font-sans">
                <p className="text-xl font-light">Producto no encontrado</p>
                <Button variant="link" className="text-primary mt-4" asChild>
                    <Link href="/dashboard">Volver al listado</Link>
                </Button>
            </div>
        )
    }

    const product = serializeProduct(rawProduct)

    const updateProductAction = async (formData: FormData) => {
        'use server'
        await updateProduct(id, formData)
    }

    const sendToValidationAction = async () => {
        'use server'
        await sendToValidation(id)
    }

    return (
        <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 pt-6">
                <div className="flex items-center gap-6">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-border bg-card shadow-lg" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft size={20} className="text-muted-foreground" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold tracking-tight">Ficha Técnica</h1>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black tracking-widest px-3 py-1 uppercase border-none">
                                Edición Activa
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                            <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md border border-border">
                                <Hash size={12} strokeWidth={3} className="text-primary" />
                                <span className="text-[11px] font-mono font-bold tracking-tight">{product.ARA_ID}</span>
                            </div>
                            <span className="text-muted-foreground/30">/</span>
                            <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-primary/50" />
                                <span className="text-sm font-medium text-muted-foreground capitalize">{product.ARA_DS?.toLowerCase() || 'Sin descripción'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <form action={sendToValidationAction}>
                        <Button
                            type="submit"
                            className="h-12 px-8 rounded-full font-bold flex items-center gap-3 shadow-[0_0_25px_rgba(196,214,0,0.15)] hover:shadow-[0_0_30px_rgba(196,214,0,0.3)] transition-all transform active:scale-95"
                        >
                            <Send size={18} />
                            Validar Artículo
                        </Button>
                    </form>
                </div>
            </div>

            {/* Main Form */}
            <ProductEditForm product={product} action={updateProductAction} />
            <p className="text-center text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em] pt-12">© 2026 Family Cash S.L.</p>
        </div>
    )
}
