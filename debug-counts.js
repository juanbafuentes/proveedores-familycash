const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testCounts() {
    const providerId = '00587' // Test provider from logs
    console.log(`Testing counts for Provider ID: [${providerId}]`)

    const total = await prisma.lU_ARA.count({
        where: { ARA_PRO: providerId }
    })
    console.log(`Total Count: ${total}`)

    const totalWithSpace = await prisma.lU_ARA.count({
        where: { ARA_PRO: providerId + ' ' }
    })
    console.log(`Total Count (with space): ${totalWithSpace}`)

    const items = await prisma.lU_ARA.findMany({
        where: { ARA_PRO: providerId },
        select: { ARA_ID: true, ARA_STATUS: true },
        take: 5
    })
    console.log('Sample items status types:', typeof items[0]?.ARA_STATUS)
    console.log('Sample items status values:', items.map(i => i.ARA_STATUS))
}

testCounts().catch(console.error).finally(() => prisma.$disconnect())
