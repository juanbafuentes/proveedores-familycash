'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

const toDecimal = (val: FormDataEntryValue | null) => {
    if (!val || val === '') return null
    try {
        return new Prisma.Decimal(val.toString())
    } catch (e) {
        return null
    }
}

const toInt = (val: FormDataEntryValue | null) => {
    if (!val || val === '') return null
    const parsed = parseInt(val.toString())
    return isNaN(parsed) ? null : parsed
}

export async function updateProduct(id: string, formData: FormData) {
    try {
        const data = {
            // General
            ARA_DS: formData.get('ARA_DS') as string,
            ARA_DS_TIC: formData.get('ARA_DS_TIC') as string,
            ARA_MARCA: formData.get('ARA_MARCA') as string,
            ARA_PRO_REF: formData.get('ARA_PRO_REF') as string,
            ARA_EAN: formData.get('ARA_EAN') as string,
            PAIS_ORIGEN: formData.get('PAIS_ORIGEN') as string,
            ARA_PART_ARANCEL: formData.get('ARA_PART_ARANCEL') as string,
            ARA_DIAS_CAD: toInt(formData.get('ARA_DIAS_CAD')),

            // Clasificación
            ARA_DPT: toInt(formData.get('ARA_DPT')),
            ARA_FAM: toInt(formData.get('ARA_FAM')),
            ARA_SBF: toInt(formData.get('ARA_SBF')),
            ARA_CENT: formData.get('ARA_CENT') as string,
            ARA_ART_MKD: formData.get('ARA_ART_MKD') as string,
            ARA_ART_SUST: formData.get('ARA_ART_SUST') as string,

            // Logística
            ARA_UC: toInt(formData.get('ARA_UC')),
            ARA_US: toInt(formData.get('ARA_US')),
            ARA_PK: toInt(formData.get('ARA_PK')),
            ARA_CAJAS_CAPA: toInt(formData.get('ARA_CAJAS_CAPA')),
            ARA_CAJAS_PALET: toInt(formData.get('ARA_CAJAS_PALET')),
            ARA_LARGO_C: toInt(formData.get('ARA_LARGO_C')),
            ARA_ANCHO_C: toInt(formData.get('ARA_ANCHO_C')),
            ARA_ALTO_C: toInt(formData.get('ARA_ALTO_C')),
            ARA_PESO_C: toDecimal(formData.get('ARA_PESO_C')),
            ARA_EAN_C: formData.get('ARA_EAN_C') as string,
            ARA_EAN_P: formData.get('ARA_EAN_P') as string,
            ARA_UDM_ID: formData.get('ARA_UDM_ID') as string,
            ARA_UDM_CTD: toDecimal(formData.get('ARA_UDM_CTD')),
            ARA_APESO: toInt(formData.get('ARA_APESO')),

            // Precios
            ARA_PVP: toDecimal(formData.get('ARA_PVP')),
            ARA_PVP_HOM: toDecimal(formData.get('ARA_PVP_HOM')),
            ARA_PVP_AND: toDecimal(formData.get('ARA_PVP_AND')),
            ARA_PVP_CAT: toDecimal(formData.get('ARA_PVP_CAT')),
            ARA_PVP_MEL: toDecimal(formData.get('ARA_PVP_MEL')),
            ARA_PRO_TAR: toDecimal(formData.get('ARA_PRO_TAR')),
            ARA_PRO_NETO: toDecimal(formData.get('ARA_PRO_NETO')),
            ARA_PRO_NETON: toDecimal(formData.get('ARA_PRO_NETON')),
            ARA_IVA: formData.get('ARA_IVA') as string,
            ARA_PRO_FAC: formData.get('ARA_PRO_FAC') as string,
            ARA_PRO_FFAC: formData.get('ARA_PRO_FFAC') as string,

            // Otros
            ARA_OBS: formData.get('ARA_OBS') as string,
            UPDATE_AT: new Date(),
            UPDATE_BY: 'Portal Next.js'
        }

        await prisma.lU_ARA.update({
            where: { ARA_ID: new Prisma.Decimal(id) },
            data: data
        })

        revalidatePath('/dashboard')
        revalidatePath(`/dashboard/product/${id}`)

        return { success: true, message: 'Producto actualizado correctamente' }

    } catch (error) {
        console.error('Error updating product:', error)
        return { success: false, message: 'Error al actualizar el producto' }
    }
}

export async function sendToValidation(id: string, formData?: FormData) {
    try {
        await prisma.lU_ARA.update({
            where: { ARA_ID: new Prisma.Decimal(id) },
            data: {
                ARA_STATUS: 1, // Validado
                UPDATE_AT: new Date()
            }
        })
        revalidatePath('/dashboard')
        revalidatePath(`/dashboard/product/${id}`)
        return { success: true, message: 'Producto enviado a validación' }
    } catch (error) {
        console.error('Error sending product:', error)
        return { success: false, message: 'Error al enviar el producto' }
    }
}
