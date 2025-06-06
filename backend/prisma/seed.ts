import { PrismaClient } from '@prisma/client';
import { hashing } from '../src/utils/bcrypt';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: {
            email: "adminkmipn@gmail.com",
            name: "Admin KMIPN",
            password: (await hashing("Password!23"))!,
            role: "admin",
            verified: true
        },
        skipDuplicates: true
    })

    console.log('User seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });