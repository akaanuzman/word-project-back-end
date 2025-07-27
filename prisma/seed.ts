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
        role: 'admin',
      },
    }),
    prisma.users.create({
      data: {
        username: 'premium_user',
        email: 'premium@example.com',
        password: await bcrypt.hash('premium123', saltRounds),
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${users.length} kullanıcı oluşturuldu`);
  return users;
}

async function seedLanguages() {
  // Dil verilerini temizle
  await prisma.languages.deleteMany({});

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'tr', name: 'Turkish' },
    { code: 'ar', name: 'Arabic' },
  ];

  const createdLanguages = await Promise.all(
    languages.map((lang) =>
      prisma.languages.create({
        data: lang,
      }),
    ),
  );

  console.log(`✅ ${createdLanguages.length} dil oluşturuldu`);
  return createdLanguages;
}

async function seedWords(
  languages: Array<{ id: string; code: string; name: string }>,
) {
  // Kelime verilerini temizle
  await prisma.words.deleteMany({});

  const englishWords = [
    {
      word: 'hello',
      meaning: 'merhaba',
      level: 1,
      part_of_speech: 'interjection',
    },
    { word: 'world', meaning: 'dünya', level: 1, part_of_speech: 'noun' },
    {
      word: 'beautiful',
      meaning: 'güzel',
      level: 2,
      part_of_speech: 'adjective',
    },
    {
      word: 'computer',
      meaning: 'bilgisayar',
      level: 2,
      part_of_speech: 'noun',
    },
    { word: 'learn', meaning: 'öğrenmek', level: 1, part_of_speech: 'verb' },
    { word: 'language', meaning: 'dil', level: 2, part_of_speech: 'noun' },
    { word: 'friend', meaning: 'arkadaş', level: 1, part_of_speech: 'noun' },
    { word: 'family', meaning: 'aile', level: 1, part_of_speech: 'noun' },
    { word: 'work', meaning: 'çalışmak', level: 1, part_of_speech: 'verb' },
    { word: 'school', meaning: 'okul', level: 1, part_of_speech: 'noun' },
  ];

  const germanWords = [
    {
      word: 'hallo',
      meaning: 'merhaba',
      level: 1,
      part_of_speech: 'interjection',
    },
    { word: 'welt', meaning: 'dünya', level: 1, part_of_speech: 'noun' },
    { word: 'schön', meaning: 'güzel', level: 1, part_of_speech: 'adjective' },
    {
      word: 'computer',
      meaning: 'bilgisayar',
      level: 2,
      part_of_speech: 'noun',
    },
    { word: 'lernen', meaning: 'öğrenmek', level: 1, part_of_speech: 'verb' },
  ];

  const englishLang = languages.find((l) => l.code === 'en');
  const germanLang = languages.find((l) => l.code === 'de');

  const words: Array<{
    id: string;
    word: string;
    meaning: string;
    level: number;
    part_of_speech: string;
    language_id: string;
  }> = [];

  if (englishLang) {
    const englishWordPromises = englishWords.map((word) =>
      prisma.words.create({
        data: {
          ...word,
          language_id: englishLang.id,
        },
      }),
    );
    const createdEnglishWords = await Promise.all(englishWordPromises);
    words.push(...createdEnglishWords);
  }

  if (germanLang) {
    const germanWordPromises = germanWords.map((word) =>
      prisma.words.create({
        data: {
          ...word,
          language_id: germanLang.id,
        },
      }),
    );
    const createdGermanWords = await Promise.all(germanWordPromises);
    words.push(...createdGermanWords);
  }

  console.log(`✅ ${words.length} kelime oluşturuldu`);
  return words;
}

async function seedAchievements() {
  // Başarım verilerini temizle
  await prisma.achievements.deleteMany({});

  const achievements = [
    {
      name: 'First Steps',
      description: 'Complete your first lesson',
      level: 1,
      icon: '🎯',
    },
    {
      name: 'Streak Master',
      description: 'Maintain a 7-day streak',
      level: 2,
      icon: '🔥',
    },
    {
      name: 'Word Collector',
      description: 'Learn 100 words',
      level: 3,
      icon: '📚',
    },
    {
      name: 'Language Explorer',
      description: 'Study 5 different languages',
      level: 4,
      icon: '🌍',
    },
    {
      name: 'Premium Learner',
      description: 'Upgrade to premium',
      level: 2,
      icon: '⭐',
    },
    {
      name: 'Perfect Score',
      description: 'Get 100% on a placement test',
      level: 3,
      icon: '🏆',
    },
    {
      name: 'Social Butterfly',
      description: 'Follow 10 other users',
      level: 2,
      icon: '🦋',
    },
    {
      name: 'League Champion',
      description: 'Win a league',
      level: 4,
      icon: '👑',
    },
    {
      name: 'Early Bird',
      description: 'Complete a lesson before 8 AM',
      level: 1,
      icon: '🌅',
    },
    {
      name: 'Night Owl',
      description: 'Complete a lesson after 10 PM',
      level: 1,
      icon: '🦉',
    },
  ];

  const createdAchievements = await Promise.all(
    achievements.map((achievement) =>
      prisma.achievements.create({
        data: achievement,
      }),
    ),
  );

  console.log(`✅ ${createdAchievements.length} başarım oluşturuldu`);
  return createdAchievements;
}

async function seedMissions() {
  // Görev verilerini temizle
  await prisma.missions.deleteMany({});

  const missions = [
    {
      title: 'Daily Practice',
      description: 'Complete 3 lessons today',
      type: 'daily',
      xp_reward: 50,
      coin_reward: 10,
    },
    {
      title: 'Weekend Warrior',
      description: 'Study for 30 minutes this weekend',
      type: 'weekly',
      xp_reward: 100,
      coin_reward: 25,
    },
    {
      title: 'Word Master',
      description: 'Learn 20 new words',
      type: 'ai',
      xp_reward: 75,
      coin_reward: 15,
    },
    {
      title: 'Streak Builder',
      description: 'Maintain your streak for 3 days',
      type: 'daily',
      xp_reward: 30,
      coin_reward: 5,
    },
    {
      title: 'Social Learner',
      description: 'Follow 3 new users',
      type: 'weekly',
      xp_reward: 40,
      coin_reward: 8,
    },
    {
      title: 'Perfect Practice',
      description: 'Get 100% on 5 exercises',
      type: 'ai',
      xp_reward: 120,
      coin_reward: 30,
    },
  ];

  const createdMissions = await Promise.all(
    missions.map((mission) =>
      prisma.missions.create({
        data: mission,
      }),
    ),
  );

  console.log(`✅ ${createdMissions.length} görev oluşturuldu`);
  return createdMissions;
}

async function seedLeagues() {
  // Lig verilerini temizle
  await prisma.leagues.deleteMany({});

  const leagues = [
    { name: 'Bronze', min_level: 1, max_level: 5 },
    { name: 'Silver', min_level: 6, max_level: 10 },
    { name: 'Gold', min_level: 11, max_level: 15 },
    { name: 'Platinum', min_level: 16, max_level: 20 },
    { name: 'Diamond', min_level: 21, max_level: 25 },
    { name: 'Master', min_level: 26, max_level: 30 },
    { name: 'Grandmaster', min_level: 31, max_level: 999 },
  ];

  const createdLeagues = await Promise.all(
    leagues.map((league) =>
      prisma.leagues.create({
        data: league,
      }),
    ),
  );

  console.log(`✅ ${createdLeagues.length} lig oluşturuldu`);
  return createdLeagues;
}

async function seedStoreItems() {
  // Mağaza ürünlerini temizle
  await prisma.store_items.deleteMany({});

  const storeItems = [
    {
      name: 'XP Booster',
      description: 'Double XP for 1 hour',
      type: 'booster',
      coin_cost: 50,
    },
    {
      name: 'Streak Freeze',
      description: 'Protect your streak for 1 day',
      type: 'streak_freeze',
      coin_cost: 30,
    },
    {
      name: 'Golden Avatar',
      description: 'Exclusive golden avatar frame',
      type: 'cosmetic',
      coin_cost: 200,
    },
    {
      name: 'Rainbow Theme',
      description: 'Colorful app theme',
      type: 'cosmetic',
      coin_cost: 150,
    },
    {
      name: 'Extra Lives',
      description: 'Get 3 extra lives for games',
      type: 'booster',
      coin_cost: 40,
    },
    {
      name: 'Premium Badge',
      description: 'Show off your premium status',
      type: 'cosmetic',
      coin_cost: 100,
    },
  ];

  const createdStoreItems = await Promise.all(
    storeItems.map((item) =>
      prisma.store_items.create({
        data: item,
      }),
    ),
  );

  console.log(`✅ ${createdStoreItems.length} mağaza ürünü oluşturuldu`);
  return createdStoreItems;
}

async function seedExampleSentences(
  words: Array<{
    id: string;
    word: string;
    meaning: string;
    level: number;
    part_of_speech: string;
    language_id: string;
  }>,
) {
  // Örnek cümleleri temizle
  await prisma.example_sentences.deleteMany({});

  const sentences = [
    {
      word_id: words[0]?.id,
      sentence: 'Hello, how are you?',
      translation: 'Merhaba, nasılsın?',
    },
    {
      word_id: words[1]?.id,
      sentence: 'The world is beautiful.',
      translation: 'Dünya güzeldir.',
    },
    {
      word_id: words[2]?.id,
      sentence: 'She is a beautiful person.',
      translation: 'O güzel bir insandır.',
    },
    {
      word_id: words[3]?.id,
      sentence: 'I use my computer every day.',
      translation: 'Her gün bilgisayarımı kullanırım.',
    },
    {
      word_id: words[4]?.id,
      sentence: 'I want to learn English.',
      translation: 'İngilizce öğrenmek istiyorum.',
    },
  ];

  const createdSentences = await Promise.all(
    sentences
      .filter((s) => s.word_id) // Sadece geçerli word_id'leri olanları al
      .map((sentence) =>
        prisma.example_sentences.create({
          data: sentence,
        }),
      ),
  );

  console.log(`✅ ${createdSentences.length} örnek cümle oluşturuldu`);
  return createdSentences;
}

async function main() {
  console.log('🌱 Seed işlemi başlatılıyor...');

  try {
    // Tüm seed fonksiyonlarını sırayla çalıştır
    const users = await seedUsers();
    const languages = await seedLanguages();
    const words = await seedWords(languages);
    const achievements = await seedAchievements();
    const missions = await seedMissions();
    const leagues = await seedLeagues();
    const storeItems = await seedStoreItems();
    const sentences = await seedExampleSentences(words);

    console.log('✅ Tüm seed işlemleri tamamlandı');
    console.log(
      `📊 Özet: ${users.length} kullanıcı, ${languages.length} dil, ${words.length} kelime, ${achievements.length} başarım, ${missions.length} görev, ${leagues.length} lig, ${storeItems.length} mağaza ürünü, ${sentences.length} örnek cümle`,
    );
  } catch (error) {
    console.error('❌ Seed işlemi sırasında hata oluştu:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed işlemi sırasında hata oluştu:', e);
    process.exit(1);
  })
  .finally(() => {
    // İşlem bitince bağlantıyı kapat
    void prisma.$disconnect().then(() => {
      console.log('🔌 Veritabanı bağlantısı kapatıldı');
    });
  });
