// Unit Tests for Wasp Queries
// Following Testing Strategy: 70% Unit Tests with ≥80% Coverage

import { HttpError } from 'wasp/server';
import { 
  getUseCases, 
  getUseCaseById, 
  getTopUseCases, 
  getUserEvaluations 
} from './queries';

// Mock Wasp entities and context
const mockContext = {
  entities: {
    UseCase: {
      findMany: jest.fn(),
      findUnique: jest.fn()
    },
    Evaluation: {
      findMany: jest.fn()
    }
  },
  user: null as any
};

describe('Wasp Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUseCases', () => {
    it('should return use cases with evaluations and counts', async () => {
      // Arrange
      const mockUseCases = [
        {
          id: '1',
          title: 'Test Use Case 1',
          evaluations: [
            { value: 'HIGH', user: { id: '1', email: 'user1@test.com' } }
          ],
          _count: { evaluations: 1 },
          createdAt: new Date('2025-07-01')
        }
      ];
      
      mockContext.entities.UseCase.findMany.mockResolvedValue(mockUseCases);

      // Act
      const result = await getUseCases({}, mockContext);

      // Assert
      expect(result).toEqual(mockUseCases);
      expect(mockContext.entities.UseCase.findMany).toHaveBeenCalledWith({
        include: {
          evaluations: {
            select: {
              value: true,
              user: {
                select: {
                  id: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              evaluations: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockContext.entities.UseCase.findMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(getUseCases({}, mockContext)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getUseCaseById', () => {
    it('should return specific use case with evaluations', async () => {
      // Arrange
      const mockUseCase = {
        id: '1',
        title: 'Test Use Case',
        evaluations: [
          {
            value: 'HIGH',
            user: { id: '1', email: 'user1@test.com', name: 'Test User' }
          }
        ]
      };
      
      mockContext.entities.UseCase.findUnique.mockResolvedValue(mockUseCase);

      // Act
      const result = await getUseCaseById({ id: '1' }, mockContext);

      // Assert
      expect(result).toEqual(mockUseCase);
      expect(mockContext.entities.UseCase.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          evaluations: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true
                }
              }
            }
          }
        }
      });
    });

    it('should return null for non-existent use case', async () => {
      // Arrange
      mockContext.entities.UseCase.findUnique.mockResolvedValue(null);

      // Act
      const result = await getUseCaseById({ id: 'non-existent' }, mockContext);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getTopUseCases', () => {
    it('should calculate scores and return top 10 use cases', async () => {
      // Arrange
      const mockUseCases = [
        {
          id: '1',
          title: 'High Score Use Case',
          evaluations: [
            { value: 'HIGH' }, // 3 points
            { value: 'HIGH' }, // 3 points
            { value: 'MEDIUM' } // 2 points
          ],
          _count: { evaluations: 3 }
        },
        {
          id: '2', 
          title: 'Medium Score Use Case',
          evaluations: [
            { value: 'MEDIUM' }, // 2 points
            { value: 'LOW' } // 1 point
          ],
          _count: { evaluations: 2 }
        },
        {
          id: '3',
          title: 'Low Score Use Case', 
          evaluations: [
            { value: 'LOW' } // 1 point
          ],
          _count: { evaluations: 1 }
        }
      ];

      mockContext.entities.UseCase.findMany.mockResolvedValue(mockUseCases);

      // Act
      const result = await getTopUseCases({}, mockContext);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('1'); // Highest score first
      expect(result[0].totalScore).toBe(8); // 3+3+2
      expect(result[1].id).toBe('2'); // Medium score second
      expect(result[1].totalScore).toBe(3); // 2+1
      expect(result[2].id).toBe('3'); // Lowest score last
      expect(result[2].totalScore).toBe(1); // 1
    });

    it('should return only top 10 use cases when more than 10 exist', async () => {
      // Arrange - Create 15 use cases
      const mockUseCases = Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Use Case ${i + 1}`,
        evaluations: [{ value: 'MEDIUM' }], // 2 points each
        _count: { evaluations: 1 }
      }));

      mockContext.entities.UseCase.findMany.mockResolvedValue(mockUseCases);

      // Act
      const result = await getTopUseCases({}, mockContext);

      // Assert
      expect(result).toHaveLength(10);
    });

    it('should handle use cases with no evaluations', async () => {
      // Arrange
      const mockUseCases = [
        {
          id: '1',
          title: 'No Evaluations Use Case',
          evaluations: [],
          _count: { evaluations: 0 }
        }
      ];

      mockContext.entities.UseCase.findMany.mockResolvedValue(mockUseCases);

      // Act
      const result = await getTopUseCases({}, mockContext);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].totalScore).toBe(0);
    });
  });

  describe('getUserEvaluations', () => {
    it('should return user evaluations when authenticated', async () => {
      // Arrange
      const authenticatedUser = { id: 'user-1', email: 'test@example.com' };
      const contextWithUser = {
        ...mockContext,
        user: authenticatedUser
      };

      const mockEvaluations = [
        {
          id: '1',
          value: 'HIGH',
          userId: 'user-1',
          useCase: {
            id: '1',
            title: 'Test Use Case',
            businessArea: 'Test Area'
          },
          createdAt: new Date('2025-07-01')
        }
      ];

      contextWithUser.entities.Evaluation.findMany.mockResolvedValue(mockEvaluations);

      // Act
      const result = await getUserEvaluations({}, contextWithUser);

      // Assert
      expect(result).toEqual(mockEvaluations);
      expect(contextWithUser.entities.Evaluation.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1'
        },
        include: {
          useCase: {
            select: {
              id: true,
              title: true,
              businessArea: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    });

    it('should throw 401 error when user not authenticated', async () => {
      // Arrange
      const contextWithoutUser = {
        ...mockContext,
        user: null
      };

      // Act & Assert
      await expect(getUserEvaluations({}, contextWithoutUser))
        .rejects
        .toThrow(HttpError);
      
      // Verify the error details
      try {
        await getUserEvaluations({}, contextWithoutUser);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        expect((error as HttpError).statusCode).toBe(401);
        expect((error as HttpError).message).toBe('User not authenticated');
      }
    });

    it('should return empty array when user has no evaluations', async () => {
      // Arrange
      const contextWithUser = {
        ...mockContext,
        user: { id: 'user-1', email: 'test@example.com' }
      };

      contextWithUser.entities.Evaluation.findMany.mockResolvedValue([]);

      // Act
      const result = await getUserEvaluations({}, contextWithUser);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
