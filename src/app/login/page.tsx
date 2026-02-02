'use client'

import { useState } from 'react'
import { getProvidersByNif, login } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ModeToggle } from '@/components/theme-toggle'

export default function LoginPage() {
    const router = useRouter()
    const [step, setStep] = useState<1 | 2>(1)
    const [nif, setNif] = useState('')
    const [providers, setProviders] = useState<{ ID_PRO: string; DS_PRO: string }[]>([])
    const [selectedProvider, setSelectedProvider] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleNifSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (nif.length < 8) {
            setError('El NIF debe tener al menos 8 caracteres')
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await getProvidersByNif(nif)
            if (result.length === 0) {
                setError('No se encontraron proveedores con ese NIF')
                setProviders([])
            } else {
                setProviders(result)
                if (result.length === 1) {
                    setSelectedProvider(result[0].ID_PRO)
                }
                setStep(2)
            }
        } catch (err) {
            setError('Error al buscar proveedores')
        } finally {
            setLoading(false)
        }
    }

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedProvider || !password) {
            setError('Selecciona un proveedor e introduce la contraseña')
            return
        }

        setLoading(true)
        setError('')

        const formData = new FormData()
        formData.append('nif', nif)
        formData.append('providerId', selectedProvider)
        formData.append('password', password)

        try {
            const result = await login(null, formData)
            if (result?.message) {
                setError(result.message)
            }
        } catch (err) {
            setError('Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans relative">
            <div className="absolute top-8 right-8">
                <ModeToggle />
            </div>

            <div className="w-full max-w-[400px] space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(196,214,0,0.3)]">
                        <span className="font-black text-primary-foreground text-xl italic tracking-tighter">FC</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mt-4">Portal de Proveedores</h1>
                    <p className="text-muted-foreground text-sm">Gestiona tus artículos Family Cash</p>
                </div>

                <Card className="border-border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-[2rem]">
                    <CardHeader className="space-y-1 pb-8">
                        <CardTitle className="text-xl">
                            {step === 1 ? 'Identificación' : 'Acceso'}
                        </CardTitle>
                        <CardDescription>
                            {step === 1
                                ? 'Introduce el C.I.F. / N.I.F. de tu empresa'
                                : `Introduce tus credenciales para ${nif}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 1 ? (
                            <form onSubmit={handleNifSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nif" className="text-xs uppercase font-bold tracking-widest text-muted-foreground ml-1">Documento Fiscal</Label>
                                    <Input
                                        id="nif"
                                        placeholder="B12345678"
                                        value={nif}
                                        onChange={(e) => setNif(e.target.value.toUpperCase())}
                                        className="h-12 border-border rounded-xl focus-visible:ring-primary focus-visible:ring-offset-0 transition-all font-mono"
                                        autoComplete="off"
                                    />
                                </div>

                                {error && (
                                    <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-xl py-3">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-xs">{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <>Continuar <ArrowRight size={16} /></>}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleLoginSubmit} className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => { setStep(1); setError(''); }}
                                        className="h-8 w-8 text-muted-foreground hover:bg-accent rounded-lg"
                                        type="button"
                                    >
                                        <ArrowLeft size={16} />
                                    </Button>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cambiar NIF</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="providerId" className="text-xs uppercase font-bold tracking-widest text-muted-foreground ml-1">Centro / Proveedor</Label>
                                        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                                            <SelectTrigger id="providerId" className="h-12 border-border rounded-xl focus:ring-primary">
                                                <SelectValue placeholder="Selecciona un centro" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {providers.map(p => (
                                                    <SelectItem key={p.ID_PRO} value={p.ID_PRO} className="focus:bg-primary focus:text-primary-foreground rounded-lg m-1">
                                                        {p.ID_PRO} - {p.DS_PRO}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-xs uppercase font-bold tracking-widest text-muted-foreground ml-1">Contraseña</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 border-border rounded-xl focus-visible:ring-primary focus-visible:ring-offset-0 transition-all"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-xl py-3">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-xs">{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Entrar al Portal'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <p className="text-center text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em] pt-4">© 2026 Family Cash S.L.</p>
            </div>
        </div>
    )
}
