/**
 * Dynamic Evaluation Factory for Test Data Generation
 * Creates realistic evaluation patterns and user feedback scenarios
 */

export interface EvaluationFactoryOptions {
  id?: string;
  value?: 'HIGH' | 'MEDIUM' | 'LOW';
  useCaseId?: string;
  userId?: string;
  createdAt?: Date;
  pattern?: 'random' | 'positive' | 'negative' | 'mixed' | 'realistic';
}

export interface GeneratedEvaluation {
  id: string;
  value: 'HIGH' | 'MEDIUM' | 'LOW';
  useCaseId: string;
  userId: string;
  createdAt: Date;
}

const evaluationValues: ('HIGH' | 'MEDIUM' | 'LOW')[] = ['HIGH', 'MEDIUM', 'LOW'];

// Realistic evaluation patterns based on enterprise adoption
const evaluationPatterns = {
  // Production systems tend to be well-received
  'Production': { HIGH: 0.6, MEDIUM: 0.3, LOW: 0.1 },
  // Pilot projects show mixed but generally positive results
  'Pilot': { HIGH: 0.4, MEDIUM: 0.4, LOW: 0.2 },
  // Prototypes are more experimental, varied opinions
  'Prototyp': { HIGH: 0.3, MEDIUM: 0.4, LOW: 0.3 },
  // Concepts are theoretical, skeptical reception
  'Konzept': { HIGH: 0.2, MEDIUM: 0.5, LOW: 0.3 },
  // Research phase has the most varied opinions
  'Research': { HIGH: 0.25, MEDIUM: 0.35, LOW: 0.4 }
};

// Business area preferences - some areas are more AI-ready
const businessAreaPatterns = {
  'IT Operations': { HIGH: 0.5, MEDIUM: 0.35, LOW: 0.15 },
  'Customer Service': { HIGH: 0.45, MEDIUM: 0.4, LOW: 0.15 },
  'Software Development': { HIGH: 0.4, MEDIUM: 0.4, LOW: 0.2 },
  'Document Management': { HIGH: 0.35, MEDIUM: 0.4, LOW: 0.25 },
  'Supply Chain': { HIGH: 0.3, MEDIUM: 0.45, LOW: 0.25 },
  'Human Resources': { HIGH: 0.25, MEDIUM: 0.45, LOW: 0.3 }
};

let evaluationCounter = 1;

/**
 * Generate a unique evaluation ID
 */
const generateEvaluationId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `eval-${timestamp}-${random}`;
};

/**
 * Generate evaluation value based on pattern and context
 */
const generateEvaluationValue = (
  pattern: string = 'realistic',
  maturityLevel?: string,
  businessArea?: string
): 'HIGH' | 'MEDIUM' | 'LOW' => {
  
  switch (pattern) {
    case 'positive':
      return Math.random() < 0.7 ? 'HIGH' : 'MEDIUM';
    
    case 'negative':
      return Math.random() < 0.6 ? 'LOW' : 'MEDIUM';
    
    case 'mixed':
      return evaluationValues[Math.floor(Math.random() * evaluationValues.length)];
    
    case 'realistic':
    default:
      // Use maturity level or business area patterns if available
      const weights = maturityLevel && evaluationPatterns[maturityLevel] 
        ? evaluationPatterns[maturityLevel]
        : businessArea && businessAreaPatterns[businessArea]
        ? businessAreaPatterns[businessArea]
        : { HIGH: 0.33, MEDIUM: 0.34, LOW: 0.33 };
      
      const random = Math.random();
      if (random < weights.HIGH) return 'HIGH';
      if (random < weights.HIGH + weights.MEDIUM) return 'MEDIUM';
      return 'LOW';
  }
};

/**
 * Generate random date within evaluation period
 */
const generateEvaluationDate = (baseDate?: Date): Date => {
  const base = baseDate || new Date();
  const daysBack = Math.floor(Math.random() * 30); // Within last 30 days
  const hoursBack = Math.floor(Math.random() * 24);
  const minutesBack = Math.floor(Math.random() * 60);
  
  return new Date(
    base.getTime() - 
    (daysBack * 24 * 60 * 60 * 1000) - 
    (hoursBack * 60 * 60 * 1000) - 
    (minutesBack * 60 * 1000)
  );
};

/**
 * Create a single evaluation with optional parameters
 */
export const createEvaluation = (options: EvaluationFactoryOptions = {}): GeneratedEvaluation => {
  return {
    id: options.id || generateEvaluationId(),
    value: options.value || generateEvaluationValue(options.pattern),
    useCaseId: options.useCaseId || 'usecase-default',
    userId: options.userId || 'user-default',
    createdAt: options.createdAt || generateEvaluationDate()
  };
};

/**
 * Create multiple evaluations
 */
export const createEvaluations = (count: number, baseOptions: EvaluationFactoryOptions = {}): GeneratedEvaluation[] => {
  return Array.from({ length: count }, (_, index) => {
    return createEvaluation({
      ...baseOptions,
      id: baseOptions.id ? `${baseOptions.id}-${index + 1}` : undefined
    });
  });
};

/**
 * Create evaluations for a specific use case with realistic patterns
 */
export const createEvaluationsForUseCase = (
  useCaseId: string,
  userIds: string[],
  options: {
    maturityLevel?: string;
    businessArea?: string;
    pattern?: 'random' | 'positive' | 'negative' | 'mixed' | 'realistic';
  } = {}
): GeneratedEvaluation[] => {
  
  return userIds.map((userId, index) => {
    return createEvaluation({
      useCaseId,
      userId,
      pattern: options.pattern || 'realistic',
      createdAt: generateEvaluationDate(new Date(Date.now() - index * 24 * 60 * 60 * 1000)) // Spread over days
    });
  });
};

/**
 * Create a realistic evaluation matrix for multiple use cases and users
 */
export const createEvaluationMatrix = (
  useCases: Array<{ id: string; maturityLevel?: string; businessArea?: string }>,
  userIds: string[],
  coverage: number = 0.7 // 70% of users evaluate each use case
): GeneratedEvaluation[] => {
  
  const evaluations: GeneratedEvaluation[] = [];
  
  useCases.forEach(useCase => {
    // Randomly select users to evaluate this use case
    const numEvaluators = Math.floor(userIds.length * coverage);
    const shuffledUsers = [...userIds].sort(() => Math.random() - 0.5);
    const evaluatingUsers = shuffledUsers.slice(0, numEvaluators);
    
    const useCaseEvaluations = createEvaluationsForUseCase(
      useCase.id,
      evaluatingUsers,
      {
        maturityLevel: useCase.maturityLevel,
        businessArea: useCase.businessArea,
        pattern: 'realistic'
      }
    );
    
    evaluations.push(...useCaseEvaluations);
  });
  
  return evaluations;
};

/**
 * Create evaluations with specific rating distribution
 */
export const createEvaluationsWithDistribution = (
  useCaseId: string,
  userIds: string[],
  distribution: { HIGH: number; MEDIUM: number; LOW: number }
): GeneratedEvaluation[] => {
  
  const total = distribution.HIGH + distribution.MEDIUM + distribution.LOW;
  const evaluations: GeneratedEvaluation[] = [];
  
  // Calculate number of each rating type
  const highCount = Math.floor((distribution.HIGH / total) * userIds.length);
  const mediumCount = Math.floor((distribution.MEDIUM / total) * userIds.length);
  const lowCount = userIds.length - highCount - mediumCount;
  
  // Create evaluations with specified distribution
  let userIndex = 0;
  
  // HIGH ratings
  for (let i = 0; i < highCount; i++) {
    evaluations.push(createEvaluation({
      useCaseId,
      userId: userIds[userIndex++],
      value: 'HIGH'
    }));
  }
  
  // MEDIUM ratings
  for (let i = 0; i < mediumCount; i++) {
    evaluations.push(createEvaluation({
      useCaseId,
      userId: userIds[userIndex++],
      value: 'MEDIUM'
    }));
  }
  
  // LOW ratings
  for (let i = 0; i < lowCount; i++) {
    evaluations.push(createEvaluation({
      useCaseId,
      userId: userIds[userIndex++],
      value: 'LOW'
    }));
  }
  
  return evaluations;
};

/**
 * Create a comprehensive evaluation scenario for testing
 */
export const createTestEvaluationScenario = (
  useCaseIds: string[],
  userIds: string[]
): {
  popular: GeneratedEvaluation[];
  controversial: GeneratedEvaluation[];
  unanimous: GeneratedEvaluation[];
} => {
  
  const popular = useCaseIds.slice(0, 2).flatMap(useCaseId =>
    createEvaluationsWithDistribution(useCaseId, userIds, { HIGH: 6, MEDIUM: 3, LOW: 1 })
  );
  
  const controversial = useCaseIds.slice(2, 4).flatMap(useCaseId =>
    createEvaluationsWithDistribution(useCaseId, userIds, { HIGH: 3, MEDIUM: 3, LOW: 4 })
  );
  
  const unanimous = useCaseIds.slice(4, 6).flatMap(useCaseId =>
    createEvaluationsWithDistribution(useCaseId, userIds, { HIGH: 8, MEDIUM: 2, LOW: 0 })
  );
  
  return { popular, controversial, unanimous };
};
