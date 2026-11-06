import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const genreNames = ['Fantasy', 'Science Fiction', 'Mystery', 'Biography'];

  const genres = await Promise.all(
    genreNames.map((name) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      return prisma.genre.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      });
    }),
  );

  const sampleBooks = [
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy' },
    { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction' },
    { title: 'The Big Sleep', author: 'Raymond Chandler', genre: 'Mystery' },
    { title: 'Educated', author: 'Tara Westover', genre: 'Biography' },
    {
      title: 'Children of Blood and Bone',
      author: 'Tomi Adeyemi',
      genre: 'Fantasy',
    },
    {
      title: 'A Wizard of Earthsea',
      author: 'Ursula K. Le Guin',
      genre: 'Fantasy',
    },
    { title: 'Binti', author: 'Nnedi Okorafor', genre: 'Science Fiction' },
    {
      title: 'Neuromancer',
      author: 'William Gibson',
      genre: 'Science Fiction',
    },
    { title: 'The Martian', author: 'Andy Weir', genre: 'Science Fiction' },
    {
      title: 'And Then There Were None',
      author: 'Agatha Christie',
      genre: 'Mystery',
    },
    { title: 'Nairobi Heat', author: 'Mukoma wa Ngugi', genre: 'Mystery' },
    {
      title: 'My Sister, the Serial Killer',
      author: 'Oyinkan Braithwaite',
      genre: 'Mystery',
    },
    {
      title: 'Long Walk to Freedom',
      author: 'Nelson Mandela',
      genre: 'Biography',
    },
    { title: 'Unbowed', author: 'Wangari Maathai', genre: 'Biography' },
    { title: 'Becoming', author: 'Michelle Obama', genre: 'Biography' },
  ];

  for (const [index, book] of sampleBooks.entries()) {
    const genre = genres.find((g) => g.name === book.genre);
    if (!genre) throw new Error(`Unknown genre: ${book.genre}`);

    // A made-up placeholder ISBN that stays the same on every run
    const isbn = `978000000${String(index + 1).padStart(4, '0')}`;

    await prisma.book.upsert({
      where: { isbn },
      update: {},
      create: {
        title: book.title,
        author: book.author,
        isbn,
        description: `${book.title} by ${book.author}.`,
        totalCopies: 3,
        availableCopies: 3,
        genreId: genre.id,
      },
    });
  }

  console.log(`Seeded ${genres.length} genres and ${sampleBooks.length} books`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
