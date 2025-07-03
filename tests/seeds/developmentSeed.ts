/**
 * Development Seed Script
 * Populates database with rich, realistic data for development environment
 */

import { PrismaClient } from '@prisma/client';
import { DatabaseSeeder } from './DatabaseSeeder';

const prisma = new PrismaClient();

async function seedDevelopment() {
  console.log('🚀 Starting development database seeding...');
  
  const seeder = new DatabaseSeeder(prisma);
  
  try {
    const result = await seeder.seedDevelopment();
    
    console.log('\n📈 Development Seeding Summary:');
    console.log(`👥 Users: ${result.users}`);
    console.log(`🎯 Use Cases: ${result.useCases}`);
    console.log(`⭐ Evaluations: ${result.evaluations}`);
    console.log(`⏱️  Total Duration: ${result.duration}ms`);
    console.log('\n✅ Development database seeding completed successfully!');
    
    // Display some sample data for verification
    const sampleUseCases = await prisma.useCase.findMany({
      take: 3,
      include: {
        evaluations: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    console.log('\n📋 Sample Use Cases with Evaluations:');
    sampleUseCases.forEach((useCase, index) => {
      console.log(`\n${index + 1}. ${useCase.title}`);
      console.log(`   Business Area: ${useCase.businessArea}`);
      console.log(`   Maturity: ${useCase.maturityLevel}`);
      console.log(`   Evaluations: ${useCase.evaluations.length}`);
      
      if (useCase.evaluations.length > 0) {
        const ratings = useCase.evaluations.reduce((acc, evaluation) => {
          acc[evaluation.value] = (acc[evaluation.value] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        console.log(`   Ratings: HIGH(${ratings.HIGH || 0}) MEDIUM(${ratings.MEDIUM || 0}) LOW(${ratings.LOW || 0})`);
      }
    });
    
  } catch (error) {
    console.error('❌ Development seeding failed:', error);
    process.exit(1);
  } finally {
    await seeder.disconnect();
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  seedDevelopment()
    .then(() => {
      console.log('\n🎉 Ready for development!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Fatal error during seeding:', error);
      process.exit(1);
    });
}

export { seedDevelopment };
