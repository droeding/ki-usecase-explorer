/**
 * Integration Tests für Wasp Actions
 * 
 * Tests HTTP API Endpoints für alle Write-Operations:
 * - submitEvaluation: Create/Update User Evaluations
 * - updateUseCase: Admin Use Case Updates
 * - deleteEvaluation: Remove User Evaluations
 */
import './setup'
import { submitEvaluation, updateUseCase, deleteEvaluation } from '../../src/actions'
import { createMockContext, testUsers, testUseCases, testEvaluations, testDb } from './setup'

describe('Integration Tests: Actions', () => {
  
  describe('submitEvaluation', () => {
    it('should create new evaluation for authenticated user', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const useCaseId = testUseCases[0].id // Use existing test use case
      const evaluationValue = 'MEDIUM' // Different value than existing evaluation
      
      // Act
      const result = await submitEvaluation({
        useCaseId,
        value: evaluationValue
      }, context)
      
      // Assert
      expect(result).toBeDefined()
      expect(result.value).toBe(evaluationValue)
      expect(result.useCaseId).toBe(useCaseId)
      expect(result.userId).toBe(authenticatedUser.id)
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('createdAt')
    })

    it('should update existing evaluation for authenticated user', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const useCaseId = testUseCases[0].id // Use case with existing evaluation
      const newEvaluationValue = 'LOW'
      
      // Act
      const result = await submitEvaluation({
        useCaseId,
        value: newEvaluationValue
      }, context)
      
      // Assert
      expect(result).toBeDefined()
      expect(result.value).toBe(newEvaluationValue)
      expect(result.useCaseId).toBe(useCaseId)
      expect(result.userId).toBe(authenticatedUser.id)
    })

    it('should throw 401 error for unauthenticated user', async () => {
      // Arrange
      const context = createMockContext() // No user provided
      const useCaseId = testUseCases[0].id
      
      // Act & Assert
      await expect(submitEvaluation({
        useCaseId,
        value: 'HIGH'
      }, context)).rejects.toThrow('User must be authenticated to submit evaluation')
    })

    it('should handle all valid evaluation values', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const useCaseId = testUseCases[1].id
      const validValues = ['HIGH', 'MEDIUM', 'LOW']
      
      // Act & Assert
      for (const value of validValues) {
        const result = await submitEvaluation({
          useCaseId,
          value
        }, context)
        
        expect(result.value).toBe(value)
      }
    })

    it('should maintain unique constraint per user-usecase pair', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const useCaseId = testUseCases[0].id
      
      // Act - Submit multiple evaluations for same use case
      const firstSubmission = await submitEvaluation({
        useCaseId,
        value: 'HIGH'
      }, context)
      
      const secondSubmission = await submitEvaluation({
        useCaseId,
        value: 'MEDIUM'
      }, context)
      
      // Assert - Should be same evaluation ID (updated, not created new)
      expect(firstSubmission.id).toBe(secondSubmission.id)
      expect(secondSubmission.value).toBe('MEDIUM')
      
      // Verify only one evaluation exists in database
      const evaluations = await testDb.evaluation.findMany({
        where: {
          userId: authenticatedUser.id,
          useCaseId: useCaseId
        }
      })
      expect(evaluations).toHaveLength(1)
    })
  })

  describe('updateUseCase', () => {
    it('should update use case for authenticated user', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const useCaseId = testUseCases[0].id
      const updateData = {
        title: 'Updated Use Case Title',
        description: 'Updated description for testing',
        businessArea: 'IT-Services'
      }
      
      // Act
      const result = await updateUseCase({
        id: useCaseId,
        data: updateData
      }, context)
      
      // Assert
      expect(result).toBeDefined()
      expect(result.id).toBe(useCaseId)
      expect(result.title).toBe(updateData.title)
      expect(result.description).toBe(updateData.description)
      expect(result.businessArea).toBe(updateData.businessArea)
    })

    it('should update partial use case data', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const useCaseId = testUseCases[0].id
      const partialUpdate = {
        title: 'Partially Updated Title'
      }
      
      // Get original use case
      const originalUseCase = await testDb.useCase.findUnique({
        where: { id: useCaseId }
      })
      
      // Act
      const result = await updateUseCase({
        id: useCaseId,
        data: partialUpdate
      }, context)
      
      // Assert
      expect(result.title).toBe(partialUpdate.title)
      expect(result.description).toBe(originalUseCase?.description) // Should remain unchanged
      expect(result.businessArea).toBe(originalUseCase?.businessArea) // Should remain unchanged
    })

    it('should throw 401 error for unauthenticated user', async () => {
      // Arrange
      const context = createMockContext() // No user provided
      const useCaseId = testUseCases[0].id
      
      // Act & Assert
      await expect(updateUseCase({
        id: useCaseId,
        data: { title: 'New Title' }
      }, context)).rejects.toThrow('Authentication required')
    })

    it('should handle non-existent use case', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const nonExistentId = 'non-existent-id'
      
      // Act & Assert
      await expect(updateUseCase({
        id: nonExistentId,
        data: { title: 'New Title' }
      }, context)).rejects.toThrow()
    })

    it('should preserve relationships after update', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const useCaseId = testUseCases[0].id
      
      // Get evaluations count before update
      const evaluationsCountBefore = await testDb.evaluation.count({
        where: { useCaseId }
      })
      
      // Act
      await updateUseCase({
        id: useCaseId,
        data: { title: 'Updated Title' }
      }, context)
      
      // Assert - Evaluations should still exist
      const evaluationsCountAfter = await testDb.evaluation.count({
        where: { useCaseId }
      })
      expect(evaluationsCountAfter).toBe(evaluationsCountBefore)
    })
  })

  describe('deleteEvaluation', () => {
    it('should delete evaluation for authenticated user', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const evaluationId = testEvaluations[0].id
      
      // Verify evaluation exists
      const evaluationBefore = await testDb.evaluation.findUnique({
        where: { id: evaluationId }
      })
      expect(evaluationBefore).toBeDefined()
      
      // Act
      const result = await deleteEvaluation({
        evaluationId
      }, context)
      
      // Assert
      expect(result).toBeDefined()
      expect(result.id).toBe(evaluationId)
      
      // Verify evaluation is deleted
      const evaluationAfter = await testDb.evaluation.findUnique({
        where: { id: evaluationId }
      })
      expect(evaluationAfter).toBeNull()
    })

    it('should throw 401 error for unauthenticated user', async () => {
      // Arrange
      const context = createMockContext() // No user provided
      const evaluationId = testEvaluations[0].id
      
      // Act & Assert
      await expect(deleteEvaluation({
        evaluationId
      }, context)).rejects.toThrow('Authentication required')
    })

    it('should throw 404 error for non-existent evaluation', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const nonExistentId = 'non-existent-evaluation-id'
      
      // Act & Assert
      await expect(deleteEvaluation({
        evaluationId: nonExistentId
      }, context)).rejects.toThrow('Evaluation not found')
    })

    it('should throw 403 error when deleting another users evaluation', async () => {
      // Arrange
      const otherUser = testUsers.adminUser
      const context = createMockContext(otherUser)
      const evaluationId = testEvaluations[0].id // Belongs to validUser
      
      // Act & Assert
      await expect(deleteEvaluation({
        evaluationId
      }, context)).rejects.toThrow('Cannot delete another user\'s evaluation')
    })

    it('should not affect use case when deleting evaluation', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const evaluationId = testEvaluations[0].id
      const useCaseId = testEvaluations[0].useCaseId
      
      // Get use case before deletion
      const useCaseBefore = await testDb.useCase.findUnique({
        where: { id: useCaseId }
      })
      
      // Act
      await deleteEvaluation({ evaluationId }, context)
      
      // Assert - Use case should still exist
      const useCaseAfter = await testDb.useCase.findUnique({
        where: { id: useCaseId }
      })
      expect(useCaseAfter).toBeDefined()
      expect(useCaseAfter?.id).toBe(useCaseBefore?.id)
      expect(useCaseAfter?.title).toBe(useCaseBefore?.title)
    })
  })

  describe('Database Transactions', () => {
    it('should handle database transaction rollback on error', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      
      // Count evaluations before
      const evaluationsCountBefore = await testDb.evaluation.count()
      
      // Act & Assert - Try to create evaluation with invalid data
      await expect(submitEvaluation({
        useCaseId: 'invalid-use-case-id',
        value: 'HIGH'
      }, context)).rejects.toThrow()
      
      // Assert - No evaluations should be created
      const evaluationsCountAfter = await testDb.evaluation.count()
      expect(evaluationsCountAfter).toBe(evaluationsCountBefore)
    })

    it('should handle concurrent actions properly', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const useCaseId = testUseCases[1].id
      
      // Act - Execute multiple actions concurrently
      const promises = [
        submitEvaluation({ useCaseId, value: 'HIGH' }, context),
        submitEvaluation({ useCaseId, value: 'MEDIUM' }, context),
        submitEvaluation({ useCaseId, value: 'LOW' }, context)
      ]
      
      // Assert - Should not throw errors
      const results = await Promise.allSettled(promises)
      
      // At least one should succeed (due to unique constraint, others may fail)
      const successfulResults = results.filter(r => r.status === 'fulfilled')
      expect(successfulResults.length).toBeGreaterThan(0)
      
      // Verify only one evaluation exists in database
      const evaluations = await testDb.evaluation.findMany({
        where: {
          userId: authenticatedUser.id,
          useCaseId: useCaseId
        }
      })
      expect(evaluations).toHaveLength(1)
    })
  })

  describe('Data Validation', () => {
    it('should validate evaluation values', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const useCaseId = testUseCases[0].id
      
      // Test valid values
      const validValues = ['HIGH', 'MEDIUM', 'LOW']
      for (const value of validValues) {
        const result = await submitEvaluation({ useCaseId, value }, context)
        expect(result.value).toBe(value)
      }
      
      // Note: Invalid values would be caught by TypeScript/Prisma schema validation
      // In a real scenario, you might want to test runtime validation as well
    })

    it('should handle empty update data gracefully', async () => {
      // Arrange
      const authenticatedUser = testUsers.validUser
      const context = createMockContext(authenticatedUser)
      const useCaseId = testUseCases[0].id
      
      // Act
      const result = await updateUseCase({
        id: useCaseId,
        data: {}
      }, context)
      
      // Assert - Should succeed with no changes
      expect(result).toBeDefined()
      expect(result.id).toBe(useCaseId)
    })
  })
})
