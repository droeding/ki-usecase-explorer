import { HttpError } from 'wasp/server'
import type { UseCase, Evaluation } from 'wasp/entities'

// Get all use cases with evaluation counts
export const getUseCases = async (args: any, context: any) => {
  return context.entities.UseCase.findMany({
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
  })
}

// Get specific use case with evaluations
export const getUseCaseById = async (args: any, context: any) => {
  const useCase = await context.entities.UseCase.findUnique({
    where: { id: args.id },
    include: {
      evaluations: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      },
      favoritedBy: {
        where: {
          id: context.user?.id,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!useCase) {
    return null;
  }

  const isFavorite = context.user ? useCase.favoritedBy.length > 0 : false;

  // We don't want to send the full favoritedBy list to the client
  const { favoritedBy, ...restOfUseCase } = useCase;

  return {
    ...restOfUseCase,
    isFavorite,
  };
};

// Get top 10 use cases based on evaluation scores
export const getTopUseCases = async (args: any, context: any) => {
  const useCasesWithScores = await context.entities.UseCase.findMany({
    include: {
      evaluations: true,
      _count: {
        select: {
          evaluations: true
        }
      }
    }
  })

  // Calculate scores: HIGH = 3, MEDIUM = 2, LOW = 1
  const scoredUseCases = useCasesWithScores.map((useCase: any) => {
    const totalScore = useCase.evaluations.reduce((sum: any, evaluation: any) => {
      const score = evaluation.value === 'HIGH' ? 3 : 
                   evaluation.value === 'MEDIUM' ? 2 : 1
      return sum + score
    }, 0)
    
    return {
      ...useCase,
      totalScore
    }
  })

  // Sort by total score descending and return top 10
  return scoredUseCases
    .sort((a: any, b: any) => b.totalScore - a.totalScore)
    .slice(0, 10)
}

// Get current user's evaluations
export const getUserEvaluations = async (args: any, context: any) => {
  if (!context.user) {
    throw new HttpError(401, "User not authenticated")
  }

  return context.entities.Evaluation.findMany({
    where: {
      userId: context.user.id
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
  })
}
