/**
 * Integration Tests für Wasp Queries
 * 
 * Tests HTTP API Endpoints für alle Read-Operations:
 * - getUseCases: Alle Use Cases mit Evaluations
 * - getUseCaseById: Einzelner Use Case mit Details
 * - getTopUseCases: Top 10 Use Cases nach Score
 * - getUserEvaluations: User-spezifische Evaluations
 */
import './setup'
import { getUseCases, getUseCaseById, getTopUseCases, getUserEvaluations } from '../../src/queries'
import { createMockContext, testUsers, testUseCases, testEvaluations } from './setup'

describe('Integration Tests: Queries', () => {
  
  describe('getUseCases', () => {
    it('should return all use cases with evaluation counts', async () => {
      // Arrange
      const context = createMockContext()
      
      // Act
      const result = await getUseCases({}, context)
      
      // Assert
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      
      // Check structure of first use case
      const firstUseCase = result[0]
      expect(firstUseCase).toHaveProperty('id')
      expect(firstUseCase).toHaveProperty('title')
      expect(firstUseCase).toHaveProperty('description')
      expect(firstUseCase).toHaveProperty('businessArea')
      expect(firstUseCase).toHaveProperty('evaluations')
      expect(firstUseCase).toHaveProperty('_count')
      expect(firstUseCase._count).toHaveProperty('evaluations')
    })

    it('should include evaluation details with user information', async () => {
      // Arrange
      const context = createMockContext()
      
      // Act
      const result = await getUseCases({}, context)
      
      // Assert
      const useCaseWithEvaluations = result.find((uc: any) => uc.evaluations.length > 0)
      expect(useCaseWithEvaluations).toBeDefined()
      
      const evaluation = useCaseWithEvaluations.evaluations[0]
      expect(evaluation).toHaveProperty('value')
      expect(evaluation).toHaveProperty('user')
      expect(evaluation.user).toHaveProperty('id')
      expect(evaluation.user).toHaveProperty('email')
    })

    it('should order results by createdAt desc', async () => {
      // Arrange
      const context = createMockContext()
      
      // Act
      const result = await getUseCases({}, context)
      
      // Assert
      expect(result.length).toBeGreaterThanOrEqual(2)
      
      // Check if ordered by createdAt descending
      for (let i = 0; i < result.length - 1; i++) {
        const current = new Date(result[i].createdAt)
        const next = new Date(result[i + 1].createdAt)
        expect(current >= next).toBe(true)
      }
    })
  })

  describe('getUseCaseById', () => {
    it('should return specific use case with evaluations', async () => {
      // Arrange
      const context = createMockContext()
      const targetUseCaseId = testUseCases[0].id
      
      // Act
      const result = await getUseCaseById({ id: targetUseCaseId }, context)
      
      // Assert
      expect(result).toBeDefined()
      expect(result?.id).toBe(targetUseCaseId)
      expect(result).toHaveProperty('title')
      expect(result).toHaveProperty('evaluations')
      expect(Array.isArray(result?.evaluations)).toBe(true)
    })

    it('should include detailed user information in evaluations', async () => {
      // Arrange
      const context = createMockContext()
      const targetUseCaseId = testUseCases[0].id
      
      // Act
      const result = await getUseCaseById({ id: targetUseCaseId }, context)
      
      // Assert
      expect(result?.evaluations.length).toBeGreaterThan(0)
      
      const evaluation = result?.evaluations[0]
      expect(evaluation).toHaveProperty('user')
      expect(evaluation?.user).toHaveProperty('id')
      expect(evaluation?.user).toHaveProperty('email')
      expect(evaluation?.user).toHaveProperty('name')
    })

    it('should return null for non-existent use case', async () => {
      // Arrange
      const context = createMockContext()
      const nonExistentId = 'non-existent-id'
      
      // Act
      const result = await getUseCaseById({ id: nonExistentId }, context)
      
      // Assert
      expect(result).toBeNull()
    })
  })

  describe('getTopUseCases', () => {
    it('should return use cases sorted by evaluation scores', async () => {
      // Arrange
      const context = createMockContext()
      
      // Act
      const result = await getTopUseCases({}, context)
      
      // Assert
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeLessThanOrEqual(10)
      
      // Check each use case has a totalScore
      result.forEach((useCase: any) => {
        expect(useCase).toHaveProperty('totalScore')
        expect(typeof useCase.totalScore).toBe('number')
      })
    })

    it('should calculate scores correctly (HIGH=3, MEDIUM=2, LOW=1)', async () => {
      // Arrange
      const context = createMockContext()
      
      // Act
      const result = await getTopUseCases({}, context)
      
      // Assert
      const useCaseWithHighEval = result.find((uc: any) => 
        uc.evaluations.some((e: any) => e.value === 'HIGH')
      )
      
      if (useCaseWithHighEval) {
        const highEvaluations = useCaseWithHighEval.evaluations.filter((e: any) => e.value === 'HIGH')
        const mediumEvaluations = useCaseWithHighEval.evaluations.filter((e: any) => e.value === 'MEDIUM')
        const lowEvaluations = useCaseWithHighEval.evaluations.filter((e: any) => e.value === 'LOW')
        
        const expectedScore = (highEvaluations.length * 3) + 
                             (mediumEvaluations.length * 2) + 
                             (lowEvaluations.length * 1)
        
        expect(useCaseWithHighEval.totalScore).toBe(expectedScore)
      }
    })

    it('should sort results by totalScore descending', async () => {
      // Arrange
      const context = createMockContext()
      
      // Act
      const result = await getTopUseCases({}, context)
      
      // Assert
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].totalScore >= result[i + 1].totalScore).toBe(true)
      }
    })

    it('should limit results to maximum 10 use cases', async () => {
      // Arrange
      const context = createMockContext()
      
      // Act
      const result = await getTopUseCases({}, context)
      
      // Assert
      expect(result.length).toBeLessThanOrEqual(10)
    })
  })

  describe('getUserEvaluations', () => {
    it('should return evaluations for authenticated user', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      
      // Act
      const result = await getUserEvaluations({}, context)
      
      // Assert
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      
      // All evaluations should belong to the authenticated user
      result.forEach((evaluation: any) => {
        expect(evaluation.userId).toBe(authenticatedUser.id)
      })
    })

    it('should include use case details in evaluations', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      
      // Act
      const result = await getUserEvaluations({}, context)
      
      // Assert
      if (result.length > 0) {
        const evaluation = result[0]
        expect(evaluation).toHaveProperty('useCase')
        expect(evaluation.useCase).toHaveProperty('id')
        expect(evaluation.useCase).toHaveProperty('title')
        expect(evaluation.useCase).toHaveProperty('businessArea')
      }
    })

    it('should order results by createdAt desc', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      
      // Act
      const result = await getUserEvaluations({}, context)
      
      // Assert
      if (result.length > 1) {
        for (let i = 0; i < result.length - 1; i++) {
          const current = new Date(result[i].createdAt)
          const next = new Date(result[i + 1].createdAt)
          expect(current >= next).toBe(true)
        }
      }
    })

    it('should throw 401 error for unauthenticated user', async () => {
      // Arrange
      const context = createMockContext() // No user provided
      
      // Act & Assert
      await expect(getUserEvaluations({}, context)).rejects.toThrow('User not authenticated')
    })

    it('should return empty array for user with no evaluations', async () => {
      // Arrange
      const userWithNoEvaluations = testUsers.adminUser
      const context = createMockContext(userWithNoEvaluations)
      
      // Act
      const result = await getUserEvaluations({}, context)
      
      // Assert
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })
  })

  describe('Database Integration', () => {
    it('should handle database connection properly', async () => {
      // Arrange
      const context = createMockContext()
      
      // Act & Assert - Should not throw connection errors
      await expect(getUseCases({}, context)).resolves.toBeDefined()
    })

    it('should handle concurrent queries', async () => {
      // Arrange
      const context = createMockContext()
      
      // Act - Execute multiple queries concurrently
      const promises = [
        getUseCases({}, context),
        getTopUseCases({}, context),
        getUseCaseById({ id: testUseCases[0].id }, context)
      ]
      
      // Assert
      const results = await Promise.all(promises)
      expect(results).toHaveLength(3)
      results.forEach(result => {
        expect(result).toBeDefined()
      })
    })
  })
})
