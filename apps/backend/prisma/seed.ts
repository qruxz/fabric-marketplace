import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: 'Premium Cotton Fabric',
      fabricType: 'Cotton',
      gsm: 150,
      color: 'White',
      pricePerMeter: 250,
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400'
    },
    {
      name: 'Silk Blend Fabric',
      fabricType: 'Silk',
      gsm: 120,
      color: 'Cream',
      pricePerMeter: 850,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1519631128182-433895475ffe?w=400'
    },
    {
      name: 'Denim Blue Fabric',
      fabricType: 'Denim',
      gsm: 300,
      color: 'Blue',
      pricePerMeter: 450,
      stock: 75,
      imageUrl: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400'
    },
    {
      name: 'Linen Natural Fabric',
      fabricType: 'Linen',
      gsm: 180,
      color: 'Beige',
      pricePerMeter: 550,
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea579296?w=400'
    },
    {
      name: 'Polyester Red Fabric',
      fabricType: 'Polyester',
      gsm: 140,
      color: 'Red',
      pricePerMeter: 200,
      stock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1582735689318-b97e5d1f1b8a?w=400'
    },
    {
      name: 'Wool Blend Grey',
      fabricType: 'Wool',
      gsm: 250,
      color: 'Grey',
      pricePerMeter: 750,
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1610726138377-edf7a7cb9cb4?w=400'
    },
    {
      name: 'Cotton Black Fabric',
      fabricType: 'Cotton',
      gsm: 160,
      color: 'Black',
      pricePerMeter: 280,
      stock: 90,
      imageUrl: 'https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?w=400'
    },
    {
      name: 'Silk Purple Fabric',
      fabricType: 'Silk',
      gsm: 110,
      color: 'Purple',
      pricePerMeter: 900,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400'
    },
    {
      name: 'Denim Dark Blue',
      fabricType: 'Denim',
      gsm: 320,
      color: 'Navy',
      pricePerMeter: 480,
      stock: 65,
      imageUrl: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400'
    },
    {
      name: 'Linen White Fabric',
      fabricType: 'Linen',
      gsm: 170,
      color: 'White',
      pricePerMeter: 520,
      stock: 55,
      imageUrl: 'https://images.unsplash.com/photo-1604522733973-2e1d1a84f326?w=400'
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('Seeded 10 products successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });