/**
 * Test Seed Script
 * Populates database with controlled, consistent data for testing
 */

import { PrismaClient } from '@prisma/client';
import { DatabaseSeeder } from './DatabaseSeeder';

const prisma = new PrismaClient();

async function seedTest() {
  console.log('🧪 Starting test database seeding...');
  
  const seeder = new DatabaseSeeder(prisma);
  
  try {
    const result = await seeder.seedTest();
    
    console.log('\n📊 Test Seeding Summary:');
    console.log(`👥 Users: ${result.users}`);
    console.log(`🎯 Use Cases: ${result.useCases}`);
    console.log(`⭐ Evaluations: ${result.evaluations}`);
    console.log(`⏱️  Duration: ${result.duration}ms`);
    console.log('\n✅ Test database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Test seeding failed:', error);
    process.exit(1);
  } finally {
    await seeder.disconnect();
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  seedTest()
    .then(() => {
      console.log('\n🧪 Ready for testing!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Fatal error during test seeding:', error);
      process.exit(1);
    });
}

export { seedTest };
