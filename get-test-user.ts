import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const user = await prisma.lU_PRO.findFirst({
            take: 1
        })
        console.log("SUCCESS: Found user", user?.ID_PRO)
    } catch (e) {
        console.error("FAILURE:", e)
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })
