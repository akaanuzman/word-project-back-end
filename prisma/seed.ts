import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;

  // Örnek kullanıcılar için şifreleri hash'leyelim
  const password1 = await bcrypt.hash('password123', saltRounds);
  const password2 = await bcrypt.hash('securePass456', saltRounds);
  const password3 = await bcrypt.hash('testUser789', saltRounds);

  // Kullanıcı verilerini temizle
  await prisma.users.deleteMany({});

  // Örnek kullanıcılar oluştur
  const users = await Promise.all([
    prisma.users.create({
      data: {
        username: 'johndoe',
        email: 'john@example.com',
        password: password1,
        isActive: true,
      },
    }),
    prisma.users.create({
      data: {
        username: 'janedoe',
        email: 'jane@example.com',
        password: password2,
        isActive: true,
      },
    }),
    prisma.users.create({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: password3,
        isActive: false,
      },
    }),
    prisma.users.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', saltRounds),
        isActive: true,
      },
    }),
    prisma.users.create({
      data: {
        username: 'deactivated',
        email: 'inactive@example.com',
        password: await bcrypt.hash('inactive123', saltRounds),
        isActive: false,
      },
    }),
  ]);

  console.log(`${users.length} kullanıcı oluşturuldu`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(
    () => prisma.$disconnect(),
    () => prisma.$disconnect(),
  );
