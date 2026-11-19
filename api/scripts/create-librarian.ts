import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const email = process.env.LIBRARIAN_EMAIL?.trim().toLowerCase();
const password = process.env.LIBRARIAN_PASSWORD;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing from .env');
}

if (!email || !password) {
  throw new Error('Librarian email and password are required');
}

if (password.length < 12 || Buffer.byteLength(password) > 72) {
  throw new Error('Password must be at least 12 characters and at most 72 bytes');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error(
      'This email is already in use. No existing account was changed.',
    );
  }

  await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 12),
      role: 'LIBRARIAN',
    },
  });

  console.log('Practice librarian created successfully.');
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
