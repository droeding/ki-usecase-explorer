/**
 * Integration Tests für Authentication Flows
 * 
 * Tests Wasp Authentication System:
 * - Authentication Context Validation
 * - Protected Operations
 * - User Session Handling
 * - Permission-based Access Control
 */
import './setup'
import { submitEvaluation, deleteEvaluation } from '../../src/actions'
import { getUserEvaluations } from '../../src/queries'
import { createMockContext, testUsers, testUseCases } from './setup'

describe('Integration Tests: Authentication', () => {
  
  describe('Authentication Context', () => {
    it('should properly validate authenticated user context', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      
      // Act
      const result = await getUserEvaluations({}, context)
      
      // Assert
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should reject unauthenticated requests for protected operations', async () => {
      // Arrange
      const unauthenticatedContext = createMockContext() // No user
      
      // Act & Assert - Protected query
      await expect(getUserEvaluations({}, unauthenticatedContext))
        .rejects.toThrow('User not authenticated')
      
      // Act & Assert - Protected action
      await expect(submitEvaluation({
        useCaseId: testUseCases[0].id,
        value: 'HIGH'
      }, unauthenticatedContext))
        .rejects.toThrow('User must be authenticated')
    })

    it('should handle null user context gracefully', async () => {
      // Arrange
      const contextWithNullUser = createMockContext(null)
      
      // Act & Assert
      await expect(getUserEvaluations({}, contextWithNullUser))
        .rejects.toThrow('User not authenticated')
    })

    it('should handle undefined user context gracefully', async () => {
      // Arrange
      const contextWithUndefinedUser = createMockContext(undefined)
      
      // Act & Assert
      await expect(getUserEvaluations({}, contextWithUndefinedUser))
        .rejects.toThrow('User not authenticated')
    })
  })

  describe('User Isolation', () => {
    it('should isolate user data between different users', async () => {
      // Arrange
      const user1 = testUsers.validUser
      const user2 = testUsers.adminUser
      const context1 = createMockContext(user1)
      const context2 = createMockContext(user2)
      const useCaseId = testUseCases[0].id
      
      // Act - User 1 submits evaluation
      await submitEvaluation({
        useCaseId,
        value: 'HIGH'
      }, context1)
      
      // User 2 submits different evaluation
      await submitEvaluation({
        useCaseId,
        value: 'LOW'
      }, context2)
      
      // Get evaluations for each user
      const user1Evaluations = await getUserEvaluations({}, context1)
      const user2Evaluations = await getUserEvaluations({}, context2)
      
      // Assert - Each user should only see their own evaluations
      user1Evaluations.forEach((evaluation: any) => {
        expect(evaluation.userId).toBe(user1.id)
      })
      
      user2Evaluations.forEach((evaluation: any) => {
        expect(evaluation.userId).toBe(user2.id)
      })
      
      // User 1 should have evaluation with HIGH value
      const user1UseCaseEval = user1Evaluations.find((e: any) => e.useCase.id === useCaseId)
      expect(user1UseCaseEval?.value).toBe('HIGH')
      
      // User 2 should have evaluation with LOW value
      const user2UseCaseEval = user2Evaluations.find((e: any) => e.useCase.id === useCaseId)
      expect(user2UseCaseEval?.value).toBe('LOW')
    })

    it('should prevent users from accessing other users evaluations', async () => {
      // Arrange
      const user1 = testUsers.validUser
      const user2 = testUsers.adminUser
      const context1 = createMockContext(user1)
      const context2 = createMockContext(user2)
      const useCaseId = testUseCases[0].id
      
      // User 1 creates evaluation
      const user1Evaluation = await submitEvaluation({
        useCaseId,
        value: 'HIGH'
      }, context1)
      
      // Act & Assert - User 2 tries to delete User 1's evaluation
      await expect(deleteEvaluation({
        evaluationId: user1Evaluation.id
      }, context2)).rejects.toThrow('Cannot delete another user\'s evaluation')
    })
  })

  describe('User Identity Validation', () => {
    it('should validate user ID consistency', async () => {
      // Arrange
      const user = testUsers.validUser
      const context = createMockContext(user)
      const useCaseId = testUseCases[0].id
      
      // Act
      const evaluation = await submitEvaluation({
        useCaseId,
        value: 'MEDIUM'
      }, context)
      
      // Assert
      expect(evaluation.userId).toBe(user.id)
    })

    it('should handle user with different properties', async () => {
      // Arrange
      const customUser = {
        id: 'custom-user-id',
        email: 'custom@bechtle.com',
        name: 'Custom User',
        role: 'evaluator'
      }
      const context = createMockContext(customUser)
      
      // Act
      const result = await getUserEvaluations({}, context)
      
      // Assert
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should handle user without optional properties', async () => {
      // Arrange
      const minimalUser = {
        id: 'minimal-user-id',
        email: 'minimal@bechtle.com'
      }
      const context = createMockContext(minimalUser)
      
      // Act
      const result = await getUserEvaluations({}, context)
      
      // Assert
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('Session Management', () => {
    it('should handle multiple concurrent sessions for same user', async () => {
      // Arrange
      const user = testUsers.validUser
      const context1 = createMockContext(user)
      const context2 = createMockContext(user)
      const useCaseId = testUseCases[0].id
      
      // Act - Simulate concurrent requests from same user
      const promises = [
        submitEvaluation({ useCaseId, value: 'HIGH' }, context1),
        getUserEvaluations({}, context2)
      ]
      
      // Assert
      const results = await Promise.all(promises)
      expect(results).toHaveLength(2)
      expect(results[0]).toBeDefined() // submitEvaluation result
      expect(Array.isArray(results[1])).toBe(true) // getUserEvaluations result
    })

    it('should handle user context switching', async () => {
      // Arrange
      const user1 = testUsers.validUser
      const user2 = testUsers.adminUser
      const useCaseId = testUseCases[0].id
      
      // Act - Switch between user contexts
      const context1 = createMockContext(user1)
      const eval1 = await submitEvaluation({ useCaseId, value: 'HIGH' }, context1)
      
      const context2 = createMockContext(user2)
      const eval2 = await submitEvaluation({ useCaseId, value: 'LOW' }, context2)
      
      // Switch back to user1
      const contextBack1 = createMockContext(user1)
      const evaluations1 = await getUserEvaluations({}, contextBack1)
      
      // Assert
      expect(eval1.userId).toBe(user1.id)
      expect(eval2.userId).toBe(user2.id)
      
      // User 1 should only see their own evaluation
      const user1Eval = evaluations1.find((e: any) => e.useCase.id === useCaseId)
      expect(user1Eval?.value).toBe('HIGH')
      expect(user1Eval?.userId).toBe(user1.id)
    })
  })

  describe('Permission Validation', () => {
    it('should check user authentication for all protected operations', async () => {
      // Arrange
      const protectedOperations = [
        () => getUserEvaluations({}, createMockContext()),
        () => submitEvaluation({ useCaseId: testUseCases[0].id, value: 'HIGH' }, createMockContext()),
        () => deleteEvaluation({ evaluationId: 'some-id' }, createMockContext())
      ]
      
      // Act & Assert
      for (const operation of protectedOperations) {
        await expect(operation()).rejects.toThrow(/authenticated|Authentication required/)
      }
    })

    it('should allow authenticated users to access their data', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      
      // Act & Assert - Should not throw
      await expect(getUserEvaluations({}, context)).resolves.toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should provide clear authentication error messages', async () => {
      // Arrange
      const unauthenticatedContext = createMockContext()
      
      // Act & Assert
      await expect(getUserEvaluations({}, unauthenticatedContext))
        .rejects.toThrow('User not authenticated')
      
      await expect(submitEvaluation({
        useCaseId: testUseCases[0].id,
        value: 'HIGH'
      }, unauthenticatedContext))
        .rejects.toThrow('User must be authenticated to submit evaluation')
    })

    it('should handle malformed user context gracefully', async () => {
      // Arrange
      const malformedContext = {
        user: { /* missing required properties */ },
        entities: createMockContext().entities
      }
      
      // Act & Assert - Should handle gracefully
      await expect(getUserEvaluations({}, malformedContext))
        .resolves.toBeDefined()
    })
  })
})
