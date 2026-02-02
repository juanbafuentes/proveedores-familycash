'use server'

import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function getProvidersByNif(nif: string) {
    const cleanNif = nif.trim().toUpperCase()
    if (!cleanNif || cleanNif.length < 8) return []

    try {
        const providers = await prisma.lU_PRO.findMany({
            where: {
                QL_PRO_NIF: cleanNif
            },
            select: {
                ID_PRO: true,
                DS_PRO: true
            }
        })
        console.log(`Searching for NIF [${cleanNif}] found ${providers.length} providers`)
        return providers
    } catch (error) {
        console.error('Error fetching providers:', error)
        return []
    }
}

export async function login(prevState: any, formData: FormData) {
    const nif = (formData.get('nif') as string)?.trim().toUpperCase()
    const providerId = (formData.get('providerId') as string)?.trim()
    const password = (formData.get('password') as string)

    if (!nif || !providerId || !password) {
        return { message: 'Todos los campos son obligatorios' }
    }

    try {
        console.log('--- LOGIN ATTEMPT ---')
        console.log(`Input NIF: [${nif}] (Length: ${nif.length})`)
        console.log(`Input ProviderID: [${providerId}] (Length: ${providerId.length})`)

        const provider = await prisma.lU_PRO.findUnique({
            where: {
                ID_PRO: providerId
            }
        })

        if (!provider) {
            console.log(`Result: Provider [${providerId}] not found in DB`)
            return { message: 'Proveedor no encontrado' }
        }

        const dbNif = provider.QL_PRO_NIF.trim().toUpperCase()
        const dbPass = provider.PRO_PASSWD.trim()

        console.log(`DB Provider NIF: [${dbNif}] (Length: ${dbNif.length})`)
        console.log(`DB Provider ID: [${provider.ID_PRO}]`)
        console.log(`Comparison result: [${dbNif}] === [${nif}] index: ${dbNif === nif}`)

        // Verify NIF matches
        if (dbNif !== nif) {
            console.log('Error: NIF Mismatch')
            return { message: 'El NIF no coincide con el proveedor seleccionado' }
        }

        // Verify Password
        if (dbPass !== password.trim()) {
            console.log('Error: Password Mismatch')
            return { message: 'Contraseña incorrecta' }
        }

        console.log('Login successful!')

        // Success - Set session
        const cookieStore = await cookies();
        cookieStore.set('session_provider_id', provider.ID_PRO, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        redirect('/dashboard')

    } catch (error) {
        if ((error as Error).message === 'NEXT_REDIRECT') {
            throw error
        }
        console.error('Login error:', error)
        return { message: 'Error en el servidor' }
    }
}
