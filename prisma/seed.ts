import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

const noteData: Prisma.NoteCreateInput[] = [
  {
    text: "test",
  },
  {
    text: "another test",
  }
];

// const monsterIdData: Prisma.monsteIdCreateInput[] = [
//     {
//       text: "test",
//     },
//     {
//       text: "another test",
//     }
//   ];

export async function main() {
  for (const note of noteData) {
    await prisma.note.create({ data: note });
  }
}

main();