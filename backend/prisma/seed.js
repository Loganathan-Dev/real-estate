const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      phone: '9999999999',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
      role: 'USER',
      phone: '8888888888',
    },
  });

  console.log('✅ Regular user created:', user.email);

  // Create sample properties
  const properties = [
    {
      title: 'Luxury Apartment in Downtown',
      description: 'Beautiful 3BHK apartment with modern amenities, swimming pool, gym, and 24/7 security. Located in the heart of the city with easy access to metro, schools, and hospitals.',
      price: 25000000,
      location: 'Andheri West',
      city: 'Mumbai',
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      propertyType: 'APARTMENT',
      listingType: 'SALE',
      userId: admin.id,
    },
    {
      title: 'Spacious Family House',
      description: 'Perfect for families with garden, parking, and 24/7 security. Close to international schools and shopping malls.',
      price: 50000,
      location: 'Whitefield',
      city: 'Bangalore',
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      propertyType: 'HOUSE',
      listingType: 'RENT',
      userId: admin.id,
    },
    {
      title: 'Modern Condo with Sea View',
      description: 'Luxury living with ocean views, premium finishes, smart home features, and direct beach access.',
      price: 35000000,
      location: 'ECR',
      city: 'Chennai',
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      propertyType: 'CONDO',
      listingType: 'SALE',
      userId: admin.id,
    },
    {
      title: 'Cozy Studio Apartment',
      description: 'Perfect for bachelors/couples, close to metro station, fully furnished with modern appliances.',
      price: 25000,
      location: 'Koramangala',
      city: 'Bangalore',
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      propertyType: 'APARTMENT',
      listingType: 'RENT',
      userId: user.id,
    },
    {
      title: 'Luxury Villa with Pool',
      description: 'Exclusive villa with private pool, garden, servant quarters, and 5-car parking. Located in prime area.',
      price: 75000000,
      location: 'Juhu',
      city: 'Mumbai',
      bedrooms: 5,
      bathrooms: 4,
      area: 4500,
      propertyType: 'HOUSE',
      listingType: 'SALE',
      userId: admin.id,
    },
    {
      title: 'Commercial Office Space',
      description: 'Prime location office space suitable for startups and corporate offices. Ready to move.',
      price: 80000,
      location: 'MG Road',
      city: 'Pune',
      bedrooms: 0,
      bathrooms: 2,
      area: 1200,
      propertyType: 'COMMERCIAL',
      listingType: 'RENT',
      userId: admin.id,
    },
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: property,
    });
  }

  console.log(` Created ${properties.length} sample properties`);
  console.log('\n📝 Test Credentials:');
  console.log('   Admin Email: admin@example.com');
  console.log('   Admin Password: admin123');
  console.log('   User Email: user@example.com');
  console.log('   User Password: user123');
  console.log('\n🏠 Sample Properties Added:');
  properties.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.title} - ${p.listingType === 'SALE' ? '₹' + p.price.toLocaleString() : '₹' + p.price.toLocaleString() + '/month'} (${p.city})`);
  });
}

main()
  .catch((e) => {
    console.error(' Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });