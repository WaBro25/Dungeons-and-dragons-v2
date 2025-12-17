import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const noteData: Array<{ text?: string | null; monsterName?: string | null }> = [
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
    await (prisma as any).note.create({ data: note });
  }
}

main();