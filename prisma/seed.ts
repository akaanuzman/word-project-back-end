import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
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

export const seedVocableGroups = async () => {
  const groups = [
    { name: 'Daily Life' },
    { name: 'Food & Drink' },
    { name: 'Travel & Transportation' },
    { name: 'Health & Body' },
    { name: 'Education' },
    { name: 'Technology' },
    { name: 'Work & Business' },
    { name: 'Nature & Environment' },
    { name: 'Weather' },
    { name: 'Colors' },
    { name: 'Numbers & Time' },
    { name: 'Family & Relationships' },
    { name: 'Emotions & Feelings' },
    { name: 'Clothes & Fashion' },
    { name: 'Shopping & Money' },
    { name: 'Sports & Hobbies' },
    { name: 'House & Furniture' },
    { name: 'Animals' },
    { name: 'Countries & Nationalities' },
    { name: 'Jobs & Professions' },
    { name: 'Tools & Equipment' },
    { name: 'Transportation Vehicles' },
    { name: 'Buildings & Places' },
    { name: 'City Life' },
    { name: 'Rural Life' },
    { name: 'School & Classroom' },
    { name: 'Entertainment & Media' },
    { name: 'Music & Instruments' },
    { name: 'Movies & TV' },
    { name: 'Art & Culture' },
    { name: 'Science & Space' },
    { name: 'History & Events' },
    { name: 'Politics & Government' },
    { name: 'Law & Crime' },
    { name: 'Internet & Social Media' },
    { name: 'Holidays & Celebrations' },
    { name: 'Feelings & Personality' },
    { name: 'Body Parts' },
    { name: 'Medicine & Illness' },
    { name: 'Cooking & Kitchen' },
    { name: 'Cleaning & Housework' },
    { name: 'Parenting & Children' },
    { name: 'Shopping & Markets' },
    { name: 'Banking & Finance' },
    { name: 'Agriculture & Farming' },
    { name: 'Forests & Mountains' },
    { name: 'Desert & Ocean' },
    { name: 'Transport Infrastructure' },
    { name: 'Weather Disasters' },
    { name: 'Military & War' },
    { name: 'Religion & Beliefs' },
    { name: 'Animals: Wild' },
    { name: 'Animals: Domestic' },
    { name: 'Clothing: Winter & Summer' },
    { name: 'Feelings: Positive & Negative' },
    { name: 'Technology Devices' },
    { name: 'Games & Toys' },
    { name: 'Body Care & Hygiene' },
    { name: 'Directions & Location' },
    { name: 'Communication & Language' },
    { name: 'Transportation: Air, Land, Sea' },
    { name: 'Festivals Around the World' },
    { name: 'Space & Astronomy' },
    { name: 'Feelings in Relationships' },
    { name: 'Jobs: Indoor vs Outdoor' },
    { name: 'Energy & Electricity' },
    { name: 'Insects & Small Creatures' },
    { name: 'Materials & Textures' },
    { name: 'Shapes & Patterns' },
    { name: 'Measurement & Size' },
    { name: 'Feelings in Conflict' },
    { name: 'Mythology & Legends' },
    { name: 'Jobs: Creative Fields' },
    { name: 'Gardening & Plants' },
    { name: 'Camping & Outdoor Activities' },
    { name: 'Adventure & Exploration' },
    { name: 'Digital Life' },
    { name: 'Luxury & Lifestyle' },
    { name: 'Body Language & Gestures' },
    { name: 'Time Expressions' },
  ];

  for (const group of groups) {
    await prisma.vocableGroup.create({
      data: {
        name: group.name,
      },
    });
  }

  console.log('✅ vocableGroup seed completed');
};

async function main() {
  console.log('🌱 Seed işlemi başlatılıyor...');

  // Tüm seed fonksiyonlarını sırayla çalıştır
  // await seedUsers();
  await seedVocableGroups();

  console.log('✅ Tüm seed işlemleri tamamlandı');
}

main()
  .catch((e) => {
    console.error('❌ Seed işlemi sırasında hata oluştu:', e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    // İşlem bitince bağlantıyı kapat
    await prisma.$disconnect();
    console.log('🔌 Veritabanı bağlantısı kapatıldı');
  });
