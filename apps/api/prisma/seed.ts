import { PrismaClient, Role, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  let school = await prisma.school.findFirst({ where: { name: 'Medhaa Demo School' } });
if (!school) {
  school = await prisma.school.create({
    data: { name: 'Medhaa Demo School', address: '123 Learning Lane, Bengaluru' },
  });
}

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@medhaa.net' },
    update: {},
    create: {
      email: 'admin@medhaa.net',
      passwordHash,
      role: Role.ADMIN,
      admin: { create: { fullName: 'Ada Min', schoolId: school.id } },
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@medhaa.test' },
    update: {},
    create: {
      email: 'teacher@medhaa.test',
      passwordHash,
      role: Role.TEACHER,
      teacher: { create: { fullName: 'Terry Teacher', schoolId: school.id } },
    },
  });

  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@medhaa.test' },
    update: {},
    create: {
      email: 'parent@medhaa.test',
      passwordHash,
      role: Role.PARENT,
      parent: { create: { fullName: 'Pat Parent' } },
    },
  });

  const parentRecord = await prisma.parent.findUnique({ where: { userId: parentUser.id } });

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@medhaa.test' },
    update: {},
    create: {
      email: 'student@medhaa.test',
      passwordHash,
      role: Role.STUDENT,
      subscription: { create: { plan: SubscriptionPlan.FREE, status: SubscriptionStatus.TRIALING } },
      student: {
        create: {
          fullName: 'Sam Student',
          gradeLevel: 6,
          coins: 100,
          xp: 0,
          level: 1,
          schoolId: school.id,
          parentId: parentRecord?.id,
        },
      },
    },
  });

  const studentRecord = await prisma.student.findUnique({ where: { userId: studentUser.id } });

  const gamesData = [
    // Permanent Free
    { slug: 'bhava-build-device-engineer', title: 'Bhava Build Device Engineer', domain: 'stem-engineering', isFreeTier: true, entryPath: 'bhava-build-device-engineer/index.html' },
    { slug: 'bhava-smriti', title: 'Bhava Smriti', domain: 'cognitive-memory', isFreeTier: true, entryPath: 'bhava-smriti/index.html' },
    { slug: 'build-your-car', title: 'Build Your Car', domain: 'stem-engineering', isFreeTier: true, entryPath: 'build-your-car/build-your-car.html' },
    { slug: 'focus-flash', title: 'Focus Flash', domain: 'cognitive-focus', isFreeTier: true, entryPath: 'focus-flash/index.html' },
    { slug: 'life-strategist-starter', title: 'Life Strategist Starter', domain: 'life-skills', isFreeTier: true, entryPath: 'life-strategist-starter/index.html' },
    { slug: 'dharana-arena', title: 'Dharana Arena', domain: 'cognitive-focus', isFreeTier: true, entryPath: 'dharana-arena.html' },
    { slug: 'nagarikx-enhanced', title: 'NagarikX Enhanced', domain: 'civics', isFreeTier: true, entryPath: 'nagarikx-enhanced.html' },
    { slug: 'planet-guardians', title: 'Planet Guardians', domain: 'environment', isFreeTier: true, entryPath: 'planet-guardians.html' },
    { slug: 'soccomm-enhanced', title: 'SocComm Enhanced', domain: 'emotional-intel', isFreeTier: true, entryPath: 'soccomm-enhanced.html' },
    { slug: 'neuroflash-memory', title: 'Neuroflash Memory', domain: 'cognitive-memory', isFreeTier: true, entryPath: 'neuroflash-memory.html' },
    { slug: 'calm-zone', title: 'Calm Zone', domain: 'emotional-intel', isFreeTier: true, entryPath: 'calm-zone.html' },

    // Rotating Free
    { slug: 'bhava-tech-likhwell', title: 'Bhava Tech Likhwell', domain: 'language-hindi', isFreeTier: false, entryPath: 'Bhava_Tech_Likhwell.html' },
    { slug: 'brain-garden', title: 'Brain Garden', domain: 'cognitive-memory', isFreeTier: false, entryPath: 'brain-garden.html' },
    { slug: 'brain-quest', title: 'Brain Quest', domain: 'cognitive-logic', isFreeTier: false, entryPath: 'brain-quest.html' },
    { slug: 'day-hero-game', title: 'Day Hero Game', domain: 'life-skills', isFreeTier: false, entryPath: 'day-hero-game.html' },
    { slug: 'day-super-hero', title: 'Day Super Hero', domain: 'life-skills', isFreeTier: false, entryPath: 'day-super-hero.html' },
    { slug: 'iq-test-level-3', title: 'IQ Test Level 3', domain: 'cognitive-assessment', isFreeTier: false, entryPath: 'iq-test-level-3.html' },
    { slug: 'logic-game', title: 'Logic Game', domain: 'cognitive-logic', isFreeTier: false, entryPath: 'logic-game.html' },
    { slug: 'math-blitz-example', title: 'Math Blitz Example', domain: 'cognitive-math', isFreeTier: false, entryPath: 'math-blitz-example.html' },
    { slug: 'math-blitz', title: 'Math Blitz', domain: 'cognitive-math', isFreeTier: false, entryPath: 'math-blitz.html' },
    { slug: 'memory-match-puzzle', title: 'Memory Match Puzzle', domain: 'cognitive-memory', isFreeTier: false, entryPath: 'memory-match-puzzle.html' },
    { slug: 'memory-match-ultimate', title: 'Memory Match Ultimate', domain: 'cognitive-memory', isFreeTier: false, entryPath: 'memory-match-ultimate.html' },
    { slug: 'memory-zoo-puzzle', title: 'Memory Zoo Puzzle', domain: 'cognitive-memory', isFreeTier: false, entryPath: 'memory-zoo-puzzle.html' },
    { slug: 'mindscape-pro', title: 'Mindscape Pro', domain: 'cognitive-logic', isFreeTier: false, entryPath: 'mindscape-pro.html' },
    { slug: 'mindspark-iq', title: 'Mindspark IQ', domain: 'cognitive-assessment', isFreeTier: false, entryPath: 'mindspark-iq.html' },
    { slug: 'neurospark', title: 'Neurospark', domain: 'cognitive-logic', isFreeTier: false, entryPath: 'neurospark.html' },
    { slug: 'percentile-game', title: 'Percentile Game', domain: 'cognitive-math', isFreeTier: false, entryPath: 'percentile-game.html' },

    // Premium Only
    { slug: 'nadopaasana', title: 'Naadopaasanam', domain: 'music', isFreeTier: false, entryPath: 'nadopaasana/index.html' },
    { slug: 'career-adventure', title: 'Career Adventure', domain: 'career', isFreeTier: false, entryPath: 'career-adventure.html' },
    { slug: 'finlife-india-quest-enhanced', title: 'Finlife India Quest Enhanced', domain: 'finance', isFreeTier: false, entryPath: 'finlife-india-quest-enhanced.html' },
    { slug: 'focus-under-distraction', title: 'Focus Under Distraction', domain: 'cognitive-focus', isFreeTier: false, entryPath: 'focus-under-distraction.html' },
    { slug: 'motorcycle-one-workshop', title: 'Motorcycle One Workshop', domain: 'stem-engineering', isFreeTier: false, entryPath: 'motorcycle-one-workshop.html' },
    { slug: 'neuro-ascend-iq', title: 'Neuro Ascend IQ', domain: 'cognitive-assessment', isFreeTier: false, entryPath: 'neuro-ascend-iq.html' },
    { slug: 'number-garden-quest', title: 'Number Garden Quest', domain: 'cognitive-math', isFreeTier: false, entryPath: 'number-garden-quest.html' },
    { slug: 'take-test', title: 'Take Test', domain: 'cognitive-assessment', isFreeTier: false, entryPath: 'take-test.html' },
    { slug: 'telugu-script-game', title: 'Telugu Script Game', domain: 'language-telugu', isFreeTier: false, entryPath: 'telugu-script-game.html' },
    { slug: 'bhava-math-grid', title: 'Bhava Math Grid', domain: 'cognitive-math', isFreeTier: false, entryPath: 'bhava-math-grid.html' },
    { slug: 'bhava-space-academy', title: 'Bhava Space Academy', domain: 'stem-engineering', isFreeTier: false, entryPath: 'bhava-space-academy/iss-anatomy-explorer-jsondriven.html' },
    { slug: 'drone-build-engineer', title: 'Drone Build Engineer', domain: 'stem-engineering', isFreeTier: false, entryPath: 'drone-build-engineer/index.html' },
    { slug: 'hidden-maths', title: 'Hidden Maths', domain: 'cognitive-math', isFreeTier: false, entryPath: 'hidden-maths/index.html' },
    { slug: 'intelligent-machines', title: 'Intelligent Machines', domain: 'stem-engineering', isFreeTier: false, entryPath: 'intelligent-machines/index.html' },
    { slug: 'rocket-build-engineer', title: 'Rocket Build Engineer', domain: 'stem-engineering', isFreeTier: false, entryPath: 'rocket-build-engineer/index.html' },
    { slug: 'plane-builder', title: 'Plane Builder', domain: 'stem-engineering', isFreeTier: false, entryPath: 'plane-builder/index.html' },
    { slug: 'secret-of-silicon-game', title: 'Secret of Silicon', domain: 'stem-engineering', isFreeTier: false, entryPath: 'secret-of-silicon-game/index.html' },
    { slug: 'devanagari-game', title: 'Devanagari Game', domain: 'language-hindi', isFreeTier: false, entryPath: 'devanagari-game/index.html' },
    { slug: 'ready-for-the-world', title: 'Ready For The World', domain: 'life-skills', isFreeTier: false, entryPath: 'ready-for-the-world.html' },
    { slug: 'google-search-lab-deep-v2', title: 'Google Search Lab Deep v2', domain: 'digital-literacy', isFreeTier: false, entryPath: 'google-search-lab-deep-v2.html' },
    { slug: 'grammar-galaxy', title: 'Grammar Galaxy', domain: 'language-english', isFreeTier: false, entryPath: 'grammar-galaxy.html' },
    { slug: 'grammar-pro', title: 'Grammar Pro', domain: 'language-english', isFreeTier: false, entryPath: 'grammar-pro.html' },
    { slug: 'heart-heroes', title: 'Heart Heroes', domain: 'emotional-intel', isFreeTier: false, entryPath: 'heart-heroes.html' },
    { slug: 'imaginia-quest', title: 'Imaginia Quest', domain: 'creativity', isFreeTier: false, entryPath: 'imaginia-quest.html' },
    { slug: 'mental-rotation-game', title: 'Mental Rotation Game', domain: 'cognitive-logic', isFreeTier: false, entryPath: 'mental-rotation-game.html' },
{ slug: 'visual-difference-detector', title: 'Visual Difference Detector', domain: 'cognitive-focus', isFreeTier: false, entryPath: 'visual-difference-detector.html' },
{ slug: 'good-habits', title: 'Good Habits', domain: 'life-skills', isFreeTier: true, entryPath: 'good-habits.html' },
{ slug: 'empathy-quest', title: 'Empathy Quest', domain: 'emotional-intel', isFreeTier: false, entryPath: 'empathy-quest.html' },
{ slug: 'empathy-conversation', title: 'Empathy Conversation', domain: 'emotional-intel', isFreeTier: false, entryPath: 'empathy-conversation.html' },
{ slug: 'know-maths', title: 'Know Maths', domain: 'cognitive-math', isFreeTier: false, entryPath: 'know-maths/index.html' },
{ slug: 'hidden-science', title: 'Hidden Science', domain: 'environment', isFreeTier: false, entryPath: 'hidden-science.html' },
{ slug: 'logic-grid-puzzle', title: 'Logic Grid Puzzle', domain: 'cognitive-logic', isFreeTier: false, entryPath: 'logic-grid-puzzle.html' },
{ slug: 'bcs-lite-v3', title: 'My Medhā', domain: 'cognitive-assessment', isFreeTier: true, entryPath: 'bcs-lite-v3.html' },
{ slug: 'bhava-tech-build-your-bike', title: 'Bhava Tech Build Your Bike', domain: 'stem-engineering', isFreeTier: false, entryPath: 'bhava-tech-build-your-bike/index.html' },
{ slug: 'medha-read-anybook-in-3hrs', title: 'Read Any Book in 3 Hours', domain: 'reading', isFreeTier: true, entryPath: 'medha_read_anybook_in-3hrs.html' },
{ slug: 'medhaa-cognitive-assessment', title: 'Medhā Cognitive Assessment', domain: 'cognitive-assessment-onetime', isFreeTier: true, entryPath: 'medhaa-cognitive-assessment.html' },
  ];

  const ACTIVITY_SLUGS = new Set([
  'bcs-lite-v3',
  'career-adventure',
  'finlife-india-quest-enhanced',
  'medha-read-anybook-in-3hrs',
  'good-habits',
  'calm-zone',
  'iq-test-level-3',
  'mindspark-iq',
  'neuro-ascend-iq',
  'take-test',
  'nadopaasana',
  'soccomm-enhanced',
  'heart-heroes',
  'empathy-quest',
  'day-hero-game',
  'day-super-hero',
  'ready-for-the-world',
  'medhaa-cognitive-assessment',
]);

  const createdGames: Record<string, { id: string; slug: string }> = {};
for (const game of gamesData) {
  const kind = ACTIVITY_SLUGS.has(game.slug) ? 'activity' : 'game';
  const gameWithKind = { ...game, kind };
  const created = await prisma.game.upsert({
    where: { slug: game.slug },
    update: gameWithKind,
    create: gameWithKind,
  });
  createdGames[game.slug] = created;
}

  const achievement = await prisma.achievement.upsert({
    where: { code: 'FIRST_GAME_COMPLETE' },
    update: {},
    create: {
      code: 'FIRST_GAME_COMPLETE',
      title: 'First Steps',
      description: 'Complete your first game.',
      iconUrl: 'https://example.com/icons/first-steps.png',
    },
  });

  if (studentRecord) {
    const demoGame = createdGames['memory-match-puzzle'];
    if (demoGame) {
      await prisma.gameAttempt.create({
        data: {
          studentId: studentRecord.id,
          gameId: demoGame.id,
          startTime: new Date(),
          endTime: new Date(),
          durationMs: 45000,
          score: 87.5,
          accuracy: 0.92,
          hintsUsed: 1,
          completionStatus: 'completed',
        },
      });
    }

    const existingAchievement = await prisma.studentAchievement.findFirst({
  where: { studentId: studentRecord.id, achievementId: achievement.id },
});
if (!existingAchievement) {
  await prisma.studentAchievement.create({
    data: { studentId: studentRecord.id, achievementId: achievement.id },
  });
}

    await prisma.coinTransaction.create({
      data: { studentId: studentRecord.id, amount: 50, reason: 'game_completion' },
    });
  }

  await prisma.coupon.upsert({
    where: { code: 'WELCOME50' },
    update: {},
    create: { code: 'WELCOME50', type: 'referral', rewardType: 'coins', rewardValue: '50', maxRedemptions: 100 },
  });

  console.log('Seed data created successfully.');
  console.log('Login with any of these emails using password: Password123!');
  console.log({
    school: school.name,
    users: [adminUser.email, teacherUser.email, parentUser.email, studentUser.email],
    totalGames: gamesData.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



