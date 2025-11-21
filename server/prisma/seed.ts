import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await prisma.character.deleteMany();
  await prisma.score.deleteMany();
  await prisma.photo.deleteMany();

  console.log("Deleted old data...");

  const waldoMap = await prisma.photo.create({
    data: {
      name: "Brain Map",
      URL: "../img/brian.jpeg",
      characters: {
        create: [
          {
            name: "Waldo",
            x_percent: 8.8888889,
            y_percent: 11.3888889,
          },
          {
            name: "Wizard",
            x_percent: 64.4444444,
            y_percent: 32.222222,
          },
        ],
      },
    },
  });

  console.log("Seeded:", waldoMap);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
