import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const user = await prisma.lU_PRO.findFirst()
        if (!user) return new NextResponse('No user found', { status: 404 })

        // JSON.stringify might fail on BigInt if present in other models if we fetched relations, but here just user.
        // However, let's manually build the response to be safe.
        return NextResponse.json({
            NIF: user.QL_PRO_NIF,
            ID: user.ID_PRO,
            PASS: user.PRO_PASSWD,
            NAME: user.DS_PRO
        })
    } catch (error) {
        console.error('Debug User Error:', error)
        return new NextResponse('Error: ' + String(error), { status: 500 })
    }
}
