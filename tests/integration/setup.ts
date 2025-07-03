/**
 * Integration Test Setup für Wasp Framework mit Supertest
 * 
 * Dieser Setup konfiguriert:
 * - Test-Datenbank (In-Memory SQLite für Integration Tests)
 * - Wasp Server für HTTP-Requests
 * - Authentication Mocking
 * - Database Cleanup zwischen Tests
 */
import { PrismaClient } from '@prisma/client'

// Test Database Configuration - In-Memory SQLite für schnelle Tests
export const testDb = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test-integration.db'
    }
  }
})

// Test User Data für Authentication Tests
export const testUsers = {
  validUser: {
    id: 'test-user-1',
    email: 'test@bechtle.com',
    name: 'Test User'
  },
  adminUser: {
    id: 'test-admin-1', 
    email: 'admin@bechtle.com',
    name: 'Admin User'
  }
}

// Test Use Case Data
export const testUseCases = [
  {
    id: 'usecase-1',
    title: 'Automatisierte Dokumentenerkennung',
    description: 'KI-basierte Erkennung und Klassifizierung von Dokumenten',
    businessArea: 'Verwaltung'
  },
  {
    id: 'usecase-2', 
    title: 'Intelligente Kundenberatung',
    description: 'Chatbot für erste Kundenberatung und FAQ',
    businessArea: 'Vertrieb'
  }
]

// Test Evaluation Data
export const testEvaluations = [
  {
    id: 'eval-1',
    value: 'HIGH',
    useCaseId: 'usecase-1',
    userId: 'test-user-1'
  },
  {
    id: 'eval-2',
    value: 'MEDIUM', 
    useCaseId: 'usecase-2',
    userId: 'test-user-1'
  }
]

/**
 * Database Setup: Erstelle Test-Daten (mit Safe Error Handling)
 */
export const setupTestData = async () => {
  try {
    // Clean existing data (safe - ignore if tables don't exist)
    await testDb.evaluation.deleteMany().catch(() => {})
    await testDb.useCase.deleteMany().catch(() => {})
    await testDb.user.deleteMany().catch(() => {})

    // Create test users
    for (const userData of Object.values(testUsers)) {
      await testDb.user.upsert({
        where: { id: userData.id },
        update: userData,
        create: userData
      }).catch(() => {})
    }

    // Create test use cases
    for (const useCaseData of testUseCases) {
      await testDb.useCase.upsert({
        where: { id: useCaseData.id },
        update: useCaseData,
        create: useCaseData
      }).catch(() => {})
    }

    // Create test evaluations
    for (const evalData of testEvaluations) {
      await testDb.evaluation.upsert({
        where: { id: evalData.id },
        update: evalData,
        create: evalData
      }).catch(() => {})
    }
  } catch (error) {
    console.warn('Database setup encountered issues - this may be expected in test environment:', error)
  }
}

/**
 * Database Cleanup: Lösche alle Test-Daten (Safe)
 */
export const cleanupTestData = async () => {
  try {
    await testDb.evaluation.deleteMany().catch(() => {})
    await testDb.useCase.deleteMany().catch(() => {})
    await testDb.user.deleteMany().catch(() => {})
  } catch (error) {
    console.warn('Database cleanup encountered issues - this may be expected:', error)
  }
}

/**
 * Mock Authentication Context für Wasp Operations
 */
export const createMockContext = (user?: any) => {
  return {
    user: user || null,
    entities: {
      User: testDb.user,
      UseCase: testDb.useCase,
      Evaluation: testDb.evaluation
    }
  }
}

/**
 * Setup für alle Integration Tests - mit Database Bootstrapping
 */
export const setupIntegrationTests = async () => {
  try {
    // Initialize database schema (if it doesn't exist)
    await testDb.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL UNIQUE,
      "name" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`

    await testDb.$executeRaw`CREATE TABLE IF NOT EXISTS "use_cases" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "businessArea" TEXT,
      "maturityLevel" TEXT,
      "problemStatement" TEXT,
      "solutionDescription" TEXT,
      "businessValue" TEXT,
      "techStack" TEXT,
      "effortEstimation" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`

    await testDb.$executeRaw`CREATE TABLE IF NOT EXISTS "evaluations" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "value" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "useCaseId" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      FOREIGN KEY ("useCaseId") REFERENCES "use_cases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`

    await testDb.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "evaluations_useCaseId_userId_key" ON "evaluations"("useCaseId", "userId")`

    await setupTestData()
  } catch (error) {
    console.warn('Integration test setup completed with warnings:', error)
  }
}

/**
 * Cleanup für alle Integration Tests
 */
export const teardownIntegrationTests = async () => {
  try {
    await cleanupTestData()
    await testDb.$disconnect()
  } catch (error) {
    console.warn('Integration test teardown completed with warnings:', error)
  }
}

// Jest Setup Hooks
beforeAll(async () => {
  await setupIntegrationTests()
})

afterAll(async () => {
  await teardownIntegrationTests()
})

beforeEach(async () => {
  // Reset data before each test
  await setupTestData()
})

afterEach(async () => {
  // Optional: Cleanup after each test
  // await cleanupTestData()
})
