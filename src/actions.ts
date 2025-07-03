import { HttpError } from 'wasp/server'
import type { Evaluation } from 'wasp/entities'
import type { 
  SubmitEvaluation,
  ToggleFavorite,
  UpdateUseCase,
  DeleteEvaluation
} from 'wasp/server/operations'

type EvaluationInput = {
  useCaseId: string;
  value: string;
}

// Submit or update user evaluation
export const submitEvaluation: SubmitEvaluation<EvaluationInput, Evaluation> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "User must be authenticated to submit evaluation")
  }

  const { useCaseId, value } = args;
  const userId = context.user.id;

  const existingEvaluation = await context.entities.Evaluation.findUnique({
    where: {
      useCaseId_userId: {
        useCaseId,
        userId,
      },
    },
  });

  if (existingEvaluation) {
    return context.entities.Evaluation.update({
      where: {
        id: existingEvaluation.id,
      },
      data: { value },
    });
  } else {
    return context.entities.Evaluation.create({
      data: {
        useCaseId,
        userId,
        value,
      },
    });
  }
}

// Toggle favorite status for a use case
export const toggleFavorite: ToggleFavorite<{ useCaseId: string }, { isFavorite: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "User must be authenticated to manage favorites");
  }

  const { useCaseId } = args;
  const userId = context.user.id;

  const user = await context.entities.User.findUnique({
    where: { id: userId },
    include: { favoriteUseCases: { where: { id: useCaseId } } },
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const isFavorite = user.favoriteUseCases.length > 0;

  if (isFavorite) {
    // Remove from favorites
    await context.entities.User.update({
      where: { id: userId },
      data: { favoriteUseCases: { disconnect: { id: useCaseId } } },
    });
    return { isFavorite: false };
  } else {
    // Add to favorites
    await context.entities.User.update({
      where: { id: userId },
      data: { favoriteUseCases: { connect: { id: useCaseId } } },
    });
    return { isFavorite: true };
  }
};

// Admin: Update use case details
export const updateUseCase: UpdateUseCase<any, any> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Authentication required")
  }

  // TODO: Add admin role check
  // if (!context.user.isAdmin) {
  //   throw new HttpError(403, "Admin access required")
  // }

  return context.entities.UseCase.update({
    where: { id: args.id },
    data: args.data
  })
}

// Delete user's evaluation
export const deleteEvaluation: DeleteEvaluation<any, any> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Authentication required")
  }

  const evaluation = await context.entities.Evaluation.findUnique({
    where: { id: args.evaluationId }
  })

  if (!evaluation) {
    throw new HttpError(404, "Evaluation not found")
  }

  if (evaluation.userId !== context.user.id) {
    throw new HttpError(403, "Cannot delete another user's evaluation")
  }

  return context.entities.Evaluation.delete({
    where: { id: args.evaluationId }
  })
}
