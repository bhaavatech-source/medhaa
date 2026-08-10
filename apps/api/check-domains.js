const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const games = await prisma.game.findMany({
    select: { domain: true, title: true },
    orderBy: { domain: 'asc' },
  });
  const unique = [...new Set(games.map((g) => g.domain))];
  console.log('--- Distinct Domains ---');
  console.log(unique);
  console.log('--- Full List ---');
  games.forEach((g) => console.log(`${g.domain} | ${g.title}`));
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());