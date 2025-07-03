/**
 * Database Seeder - Main orchestrator for populating database with test data
 * Supports different environments and seeding strategies
 */

import { PrismaClient } from '@prisma/client';
import { userFixtures } from '../fixtures/users';
import { useCaseFixtures } from '../fixtures/usecases';
import { evaluationFixtures } from '../fixtures/evaluations';
import { createUsers, createTestTeam } from '../factories/userFactory';
import { createUseCases, createUseCasePortfolio } from '../factories/useCaseFactory';
import { createEvaluationMatrix, createTestEvaluationScenario } from '../factories/evaluationFactory';

export interface SeedOptions {
  environment: 'test' | 'development' | 'staging';
  clearData?: boolean;
  userCount?: number;
  useCaseCount?: number;
  evaluationCoverage?: number;
  useFixtures?: boolean;
  useFactories?: boolean;
}

export interface SeedResult {
  users: number;
  useCases: number;
  evaluations: number;
  duration: number;
}

export class DatabaseSeeder {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  /**
   * Clear all data from the database
   */
  async clearDatabase(): Promise<void> {
    console.log('🧹 Clearing database...');
    
    // Delete in correct order due to foreign key constraints
    await this.prisma.evaluation.deleteMany();
    await this.prisma.useCase.deleteMany();
    await this.prisma.user.deleteMany();
    
    console.log('✅ Database cleared');
  }

  /**
   * Seed database based on environment and options
   */
  async seed(options: SeedOptions): Promise<SeedResult> {
    const startTime = Date.now();
    console.log(`🌱 Starting database seeding for ${options.environment} environment...`);

    if (options.clearData) {
      await this.clearDatabase();
    }

    const users: any[] = [];
    const useCases: any[] = [];
    const evaluations: any[] = [];

    // Seed users
    if (options.useFixtures) {
      const fixtureUsers = await this.seedFixtureUsers();
      users.push(...fixtureUsers);
    }
    
    if (options.useFactories && options.userCount) {
      const factoryUsers = await this.seedFactoryUsers(options.userCount);
      users.push(...factoryUsers);
    }

    // Seed use cases
    if (options.useFixtures) {
      const fixtureUseCases = await this.seedFixtureUseCases();
      useCases.push(...fixtureUseCases);
    }
    
    if (options.useFactories && options.useCaseCount) {
      const factoryUseCases = await this.seedFactoryUseCases(options.useCaseCount);
      useCases.push(...factoryUseCases);
    }

    // Seed evaluations
    if (options.useFixtures) {
      const fixtureEvaluations = await this.seedFixtureEvaluations();
      evaluations.push(...fixtureEvaluations);
    }
    
    if (options.useFactories && options.evaluationCoverage) {
      const factoryEvaluations = await this.seedFactoryEvaluations(
        useCases.map(uc => ({ id: uc.id, maturityLevel: uc.maturityLevel, businessArea: uc.businessArea })),
        users.map(u => u.id),
        options.evaluationCoverage
      );
      evaluations.push(...factoryEvaluations);
    }

    const duration = Date.now() - startTime;
    const result: SeedResult = {
      users: users.length,
      useCases: useCases.length,
      evaluations: evaluations.length,
      duration
    };

    console.log('🎉 Database seeding completed!');
    console.log(`📊 Seeded: ${result.users} users, ${result.useCases} use cases, ${result.evaluations} evaluations`);
    console.log(`⏱️  Duration: ${result.duration}ms`);

    return result;
  }

  /**
   * Seed users from static fixtures
   */
  private async seedFixtureUsers() {
    console.log('👥 Seeding fixture users...');
    
    const users = [];
    for (const userFixture of userFixtures) {
      const user = await this.prisma.user.upsert({
        where: { id: userFixture.id },
        update: userFixture,
        create: userFixture
      });
      users.push(user);
    }
    
    console.log(`✅ Seeded ${users.length} fixture users`);
    return users;
  }

  /**
   * Seed users from factory functions
   */
  private async seedFactoryUsers(count: number) {
    console.log(`👥 Seeding ${count} factory users...`);
    
    const userFactories = createUsers(count);
    const users = [];
    
    for (const userFactory of userFactories) {
      const user = await this.prisma.user.create({
        data: userFactory
      });
      users.push(user);
    }
    
    console.log(`✅ Seeded ${users.length} factory users`);
    return users;
  }

  /**
   * Seed use cases from static fixtures
   */
  private async seedFixtureUseCases() {
    console.log('🎯 Seeding fixture use cases...');
    
    const useCases = [];
    for (const useCaseFixture of useCaseFixtures) {
      const useCase = await this.prisma.useCase.upsert({
        where: { id: useCaseFixture.id },
        update: useCaseFixture,
        create: useCaseFixture
      });
      useCases.push(useCase);
    }
    
    console.log(`✅ Seeded ${useCases.length} fixture use cases`);
    return useCases;
  }

  /**
   * Seed use cases from factory functions
   */
  private async seedFactoryUseCases(count: number) {
    console.log(`🎯 Seeding ${count} factory use cases...`);
    
    const useCaseFactories = createUseCases(count);
    const useCases = [];
    
    for (const useCaseFactory of useCaseFactories) {
      const useCase = await this.prisma.useCase.create({
        data: useCaseFactory
      });
      useCases.push(useCase);
    }
    
    console.log(`✅ Seeded ${useCases.length} factory use cases`);
    return useCases;
  }

  /**
   * Seed evaluations from static fixtures
   */
  private async seedFixtureEvaluations() {
    console.log('⭐ Seeding fixture evaluations...');
    
    const evaluations = [];
    for (const evaluationFixture of evaluationFixtures) {
      try {
        const evaluation = await this.prisma.evaluation.upsert({
          where: { id: evaluationFixture.id },
          update: {
            value: evaluationFixture.value,
            createdAt: evaluationFixture.createdAt
          },
          create: evaluationFixture
        });
        evaluations.push(evaluation);
      } catch (error: any) {
        console.warn(`⚠️  Skipping evaluation ${evaluationFixture.id}: ${error.message}`);
      }
    }
    
    console.log(`✅ Seeded ${evaluations.length} fixture evaluations`);
    return evaluations;
  }

  /**
   * Seed evaluations from factory functions
   */
  private async seedFactoryEvaluations(
    useCases: Array<{ id: string; maturityLevel?: string; businessArea?: string }>,
    userIds: string[],
    coverage: number
  ) {
    console.log(`⭐ Seeding factory evaluations with ${Math.floor(coverage * 100)}% coverage...`);
    
    const evaluationFactories = createEvaluationMatrix(useCases, userIds, coverage);
    const evaluations = [];
    
    for (const evaluationFactory of evaluationFactories) {
      try {
        const evaluation = await this.prisma.evaluation.create({
          data: evaluationFactory
        });
        evaluations.push(evaluation);
      } catch (error: any) {
        console.warn(`⚠️  Skipping factory evaluation: ${error.message}`);
      }
    }
    
    console.log(`✅ Seeded ${evaluations.length} factory evaluations`);
    return evaluations;
  }

  /**
   * Quick seed for testing - minimal realistic data
   */
  async seedTest(): Promise<SeedResult> {
    return this.seed({
      environment: 'test',
      clearData: true,
      useFixtures: true,
      useFactories: false
    });
  }

  /**
   * Development seed - rich dataset for development
   */
  async seedDevelopment(): Promise<SeedResult> {
    return this.seed({
      environment: 'development',
      clearData: true,
      useFixtures: true,
      useFactories: true,
      userCount: 20,
      useCaseCount: 15,
      evaluationCoverage: 0.7
    });
  }

  /**
   * Staging seed - production-like data volume
   */
  async seedStaging(): Promise<SeedResult> {
    return this.seed({
      environment: 'staging',
      clearData: true,
      useFixtures: true,
      useFactories: true,
      userCount: 50,
      useCaseCount: 30,
      evaluationCoverage: 0.6
    });
  }

  /**
   * Close database connection
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
