'use client'

import { useState } from 'react'
import { SubmitButton } from './submit-button'
import { Package, Truck, CircleDollarSign, Hash, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ProductEditForm({ product, action }: { product: any, action: (formData: FormData) => Promise<void> }) {
    const tabs = [
        { id: 'general', label: 'General', icon: Package },
        { id: 'logistica', label: 'Logística', icon: Truck },
        { id: 'precios', label: 'Precios', icon: CircleDollarSign },
        { id: 'tecnico', label: 'Técnico', icon: Hash },
        { id: 'obs', label: 'Otros', icon: FileText },
    ]

    const InputField = ({ label, name, type = 'text', defaultValue, step, suffix }: { label: string, name: string, type?: string, defaultValue?: any, step?: string, suffix?: string }) => (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{label}</Label>
            <div className="relative group">
                <Input
                    id={name}
                    type={type}
                    name={name}
                    step={step}
                    defaultValue={defaultValue?.toString() ?? ''}
                    className={cn(
                        "h-11 bg-background border-border rounded-xl focus-visible:ring-primary focus-visible:border-primary transition-all font-medium text-sm",
                        suffix ? "pr-12" : "px-4"
                    )}
                />
                {suffix && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground/50 font-black text-[10px] uppercase tracking-tighter">
                        {suffix}
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <Tabs defaultValue="general" className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <TabsList className="w-full h-auto bg-muted/50 p-1.5 rounded-2xl grid grid-cols-2 md:grid-cols-5 gap-1.5 border border-border/50">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="flex items-center justify-center gap-2.5 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all font-bold text-xs uppercase tracking-widest"
                        >
                            <Icon size={16} strokeWidth={2.5} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </TabsTrigger>
                    )
                })}
            </TabsList>

            <form action={action} className="space-y-8">
                <Card className="border-border bg-card/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden lg:p-4 shadow-sm">
                    <CardContent className="p-8 lg:p-10">

                        <TabsContent value="general" className="mt-0 space-y-8 animate-in fade-in duration-500">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(196,214,0,0.5)]"></div>
                                <h3 className="text-xl font-bold tracking-tight">Información General</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="md:col-span-2">
                                    <InputField label="Descripción Completa" name="ARA_DS" defaultValue={product.ARA_DS} />
                                </div>
                                <InputField label="Descripción Ticket" name="ARA_DS_TIC" defaultValue={product.ARA_DS_TIC} />
                                <InputField label="Marca" name="ARA_MARCA" defaultValue={product.ARA_MARCA} />
                                <InputField label="EAN Unidad" name="ARA_EAN" defaultValue={product.ARA_EAN} />
                                <InputField label="Referencia Proveedor" name="ARA_PRO_REF" defaultValue={product.ARA_PRO_REF} />
                                <InputField label="País de Origen" name="PAIS_ORIGEN" defaultValue={product.PAIS_ORIGEN} />
                                <InputField label="Partida Arancelaria" name="ARA_PART_ARANCEL" defaultValue={product.ARA_PART_ARANCEL} />
                                <InputField label="Días de Caducidad" name="ARA_DIAS_CAD" type="number" defaultValue={product.ARA_DIAS_CAD} suffix="días" />
                            </div>
                        </TabsContent>

                        <TabsContent value="logistica" className="mt-0 space-y-8 animate-in fade-in duration-500">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(196,214,0,0.5)]"></div>
                                <h3 className="text-xl font-bold tracking-tight">Detalles Logísticos</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                                <InputField label="Unidades de Caja (UC)" name="ARA_UC" type="number" defaultValue={product.ARA_UC} suffix="uds" />
                                <InputField label="Unidades de Saca (US)" name="ARA_US" type="number" defaultValue={product.ARA_US} suffix="uds" />
                                <InputField label="Unidades de Pack (PK)" name="ARA_PK" type="number" defaultValue={product.ARA_PK} suffix="uds" />
                                <InputField label="Cajas por Capa" name="ARA_CAJAS_CAPA" type="number" defaultValue={product.ARA_CAJAS_CAPA} suffix="cajas" />
                                <InputField label="Cajas por Palet" name="ARA_CAJAS_PALET" type="number" defaultValue={product.ARA_CAJAS_PALET} suffix="cajas" />
                                <InputField label="EAN de Caja" name="ARA_EAN_C" defaultValue={product.ARA_EAN_C} />
                                <InputField label="EAN de Pack" name="ARA_EAN_P" defaultValue={product.ARA_EAN_P} />
                                <InputField label="Dimesiones: Largo" name="ARA_LARGO_C" type="number" defaultValue={product.ARA_LARGO_C} suffix="mm" />
                                <InputField label="Dimesiones: Ancho" name="ARA_ANCHO_C" type="number" defaultValue={product.ARA_ANCHO_C} suffix="mm" />
                                <InputField label="Dimesiones: Alto" name="ARA_ALTO_C" type="number" defaultValue={product.ARA_ALTO_C} suffix="mm" />
                                <InputField label="Peso de Caja" name="ARA_PESO_C" step="0.01" defaultValue={product.ARA_PESO_C} suffix="kg" />
                                <InputField label="U.M. (ID)" name="ARA_UDM_ID" defaultValue={product.ARA_UDM_ID} />
                                <InputField label="Cantidad UDM" name="ARA_UDM_CTD" step="0.01" defaultValue={product.ARA_UDM_CTD} />
                                <InputField label="A PESO (0/1)" name="ARA_APESO" type="number" defaultValue={product.ARA_APESO} />
                            </div>
                        </TabsContent>

                        <TabsContent value="precios" className="mt-0 space-y-8 animate-in fade-in duration-500">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(196,214,0,0.5)]"></div>
                                <h3 className="text-xl font-bold tracking-tight">Precios y Compras</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                                <InputField label="PVP General" name="ARA_PVP" step="0.0001" defaultValue={product.ARA_PVP} suffix="€" />
                                <InputField label="PVP Homog." name="ARA_PVP_HOM" step="0.0001" defaultValue={product.ARA_PVP_HOM} suffix="€" />
                                <InputField label="PVP Andalucía" name="ARA_PVP_AND" step="0.0001" defaultValue={product.ARA_PVP_AND} suffix="€" />
                                <InputField label="PVP Cataluña" name="ARA_PVP_CAT" step="0.0001" defaultValue={product.ARA_PVP_CAT} suffix="€" />
                                <InputField label="PVP Melilla" name="ARA_PVP_MEL" step="0.0001" defaultValue={product.ARA_PVP_MEL} suffix="€" />
                                <InputField label="Tarifa Proveedor" name="ARA_PRO_TAR" step="0.0001" defaultValue={product.ARA_PRO_TAR} suffix="€" />
                                <InputField label="Neto Proveedor" name="ARA_PRO_NETO" step="0.0001" defaultValue={product.ARA_PRO_NETO} suffix="€" />
                                <InputField label="Neto Promocional" name="ARA_PRO_NETON" step="0.0001" defaultValue={product.ARA_PRO_NETON} suffix="€" />
                                <InputField label="Tipo de IVA" name="ARA_IVA" defaultValue={product.ARA_IVA} />
                                <InputField label="PRO FAC" name="ARA_PRO_FAC" defaultValue={product.ARA_PRO_FAC} />
                                <InputField label="PRO FFAC" name="ARA_PRO_FFAC" defaultValue={product.ARA_PRO_FFAC} />
                            </div>
                        </TabsContent>

                        <TabsContent value="tecnico" className="mt-0 space-y-8 animate-in fade-in duration-500">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(196,214,0,0.5)]"></div>
                                <h3 className="text-xl font-bold tracking-tight">Clasificación Técnica</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                                <InputField label="Departamento" name="ARA_DPT" type="number" defaultValue={product.ARA_DPT} />
                                <InputField label="Familia" name="ARA_FAM" type="number" defaultValue={product.ARA_FAM} />
                                <InputField label="Subfamilia" name="ARA_SBF" type="number" defaultValue={product.ARA_SBF} />
                                <InputField label="Centro Logístico" name="ARA_CENT" defaultValue={product.ARA_CENT} />
                                <InputField label="MKD" name="ARA_ART_MKD" defaultValue={product.ARA_ART_MKD} />
                                <InputField label="Sustituto" name="ARA_ART_SUST" defaultValue={product.ARA_ART_SUST} />
                            </div>
                        </TabsContent>

                        <TabsContent value="obs" className="mt-0 space-y-8 animate-in fade-in duration-500">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(196,214,0,0.5)]"></div>
                                <h3 className="text-xl font-bold tracking-tight">Observaciones Técnicas</h3>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="ARA_OBS" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notas y Comentarios Internos</Label>
                                <Textarea
                                    id="ARA_OBS"
                                    name="ARA_OBS"
                                    defaultValue={product.ARA_OBS || ''}
                                    rows={8}
                                    className="bg-background border-border rounded-2xl p-6 transition-all resize-none leading-relaxed"
                                />
                            </div>
                        </TabsContent>

                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <SubmitButton />
                </div>
            </form>
        </Tabs>
    )
}
