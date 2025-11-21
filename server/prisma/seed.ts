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
            x_percent: 0.006472222,
            y_percent: 0.003263889,
          },
          {
            name: "Wizard",
            x_percent: 0.00323611111,
            y_percent: 0.00756944444,
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
