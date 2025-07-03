/**
 * Dynamic UseCase Factory for Test Data Generation
 * Creates realistic AI use case scenarios for various business contexts
 */

export interface UseCaseFactoryOptions {
  id?: string;
  title?: string;
  description?: string;
  businessArea?: string;
  maturityLevel?: string;
  problemStatement?: string;
  solutionDescription?: string;
  businessValue?: string;
  techStack?: string;
  effortEstimation?: string;
  createdAt?: Date;
}

export interface GeneratedUseCase {
  id: string;
  title: string;
  description: string;
  businessArea: string;
  maturityLevel: string;
  problemStatement: string;
  solutionDescription: string;
  businessValue: string;
  techStack: string;
  effortEstimation: string;
  createdAt: Date;
}

// Business Areas for realistic use cases
const businessAreas = [
  'Customer Service', 'Supply Chain', 'Software Development', 'IT Operations',
  'Human Resources', 'Finance & Accounting', 'Marketing & Sales', 'Security',
  'Document Management', 'Business Intelligence', 'Quality Assurance', 'Compliance'
];

// Maturity Levels according to enterprise adoption patterns
const maturityLevels = ['Research', 'Konzept', 'Prototyp', 'Pilot', 'Production'];

// AI Technology Stacks commonly used at enterprise level
const techStacks = [
  'Azure Cognitive Services, Logic Apps',
  'Azure Machine Learning, Synapse Analytics',
  'Azure OpenAI Service, Semantic Kernel',
  'Power Platform, AI Builder',
  'GitHub Copilot, Azure DevOps',
  'Azure Form Recognizer, Cognitive Search',
  'Azure Bot Service, QnA Maker',
  'Azure Monitor, Log Analytics',
  'Databricks, MLflow',
  'Azure Computer Vision, Custom Vision'
];

// Effort estimations in realistic enterprise timeframes
const effortEstimations = [
  '2-3 Wochen', '1-2 Monate', '2-3 Monate', '3-4 Monate', 
  '4-6 Monate', '6-8 Monate', '8-12 Monate'
];

// AI Use Case Title Templates
const titleTemplates = [
  'Automatisierte {process} {technology}',
  'Intelligente {area} Optimierung',
  'KI-basierte {function} Analyse',
  'Predictive {domain} Management',
  'Smart {process} Assistenz',
  'Automatische {data} Extraktion',
  'Intelligentes {area} Monitoring',
  'KI-unterstützte {process} Bewertung'
];

const processWords = [
  'Dokumentenverarbeitung', 'Kundenanfrage-Klassifikation', 'Anomalieerkennung',
  'Qualitätskontrolle', 'Risikobeurteilung', 'Bestandsplanung', 'Kapazitätsplanung',
  'Code-Review', 'Incident-Management', 'Compliance-Prüfung'
];

const technologyWords = [
  'mit Machine Learning', 'durch NLP', 'via Computer Vision', 'mit Deep Learning',
  'durch Predictive Analytics', 'via Conversational AI', 'mit OCR-Technologie'
];

const areaWords = [
  'Inventory', 'Customer Journey', 'IT-Infrastructure', 'Supply Chain',
  'Document', 'Process', 'Security', 'Performance', 'Quality', 'Compliance'
];

let useCaseCounter = 1;

/**
 * Generate a unique use case ID
 */
const generateUseCaseId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `usecase-${timestamp}-${random}`;
};

/**
 * Generate a realistic AI use case title
 */
const generateTitle = (): string => {
  const template = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
  
  return template
    .replace('{process}', processWords[Math.floor(Math.random() * processWords.length)])
    .replace('{technology}', technologyWords[Math.floor(Math.random() * technologyWords.length)])
    .replace('{area}', areaWords[Math.floor(Math.random() * areaWords.length)])
    .replace('{function}', processWords[Math.floor(Math.random() * processWords.length)])
    .replace('{domain}', areaWords[Math.floor(Math.random() * areaWords.length)])
    .replace('{data}', ['Daten', 'Information', 'Content', 'Metriken'][Math.floor(Math.random() * 4)]);
};

/**
 * Generate realistic problem statement
 */
const generateProblemStatement = (businessArea: string): string => {
  const problems = {
    'Customer Service': [
      'Manuelle Bearbeitung von Kundenanfragen führt zu Verzögerungen und inkonsistenter Servicequalität',
      'Hohe Anzahl wiederkehrender Standardfragen belastet das Support-Team',
      'Schwierige Klassifikation und Priorisierung eingehender Tickets'
    ],
    'IT Operations': [
      'Ungeplante Systemausfälle verursachen erhebliche Downtime und Kosten',
      'Reaktive Wartung führt zu kritischen Problemen und Notfall-Einsätzen',
      'Komplexe IT-Landschaft erschwert proaktive Überwachung'
    ],
    'Software Development': [
      'Manuelle Code-Reviews verzögern Entwicklungszyklen erheblich',
      'Inkonsistente Codequalität und übersehene Sicherheitslücken',
      'Zeitaufwändige Identifikation von Performance-Problemen'
    ]
  };
  
  const areaProblems = problems[businessArea] || [
    'Manuelle Prozesse sind zeitaufwendig und fehleranfällig',
    'Fehlende Automatisierung führt zu ineffizienten Arbeitsabläufen',
    'Komplexe Entscheidungsfindung ohne datengetriebene Insights'
  ];
  
  return areaProblems[Math.floor(Math.random() * areaProblems.length)];
};

/**
 * Generate business value proposition
 */
const generateBusinessValue = (): string => {
  const savings = [20, 30, 40, 50, 60, 70];
  const improvements = [15, 25, 35, 45];
  const costs = ['50k€', '100k€', '200k€', '500k€'];
  
  const savingPercent = savings[Math.floor(Math.random() * savings.length)];
  const improvementPercent = improvements[Math.floor(Math.random() * improvements.length)];
  const costSaving = costs[Math.floor(Math.random() * costs.length)];
  
  const templates = [
    `Reduzierung der Bearbeitungszeit um ${savingPercent}%, Kosteneinsparung von ${costSaving} pro Jahr`,
    `Verbesserung der Effizienz um ${improvementPercent}%, Qualitätssteigerung um ${savingPercent}%`,
    `Automatisierung spart ${costSaving} jährlich, ${improvementPercent}% weniger manuelle Arbeit`,
    `${savingPercent}% Zeitersparnis, ${improvementPercent}% Verbesserung der Kundenzufriedenheit`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
};

/**
 * Create a single use case with optional parameters
 */
export const createUseCase = (options: UseCaseFactoryOptions = {}): GeneratedUseCase => {
  const businessArea = options.businessArea || businessAreas[Math.floor(Math.random() * businessAreas.length)];
  const title = options.title || generateTitle();
  
  return {
    id: options.id || generateUseCaseId(),
    title: title,
    description: options.description || `${title} zur Verbesserung der ${businessArea.toLowerCase()} Prozesse`,
    businessArea: businessArea,
    maturityLevel: options.maturityLevel || maturityLevels[Math.floor(Math.random() * maturityLevels.length)],
    problemStatement: options.problemStatement || generateProblemStatement(businessArea),
    solutionDescription: options.solutionDescription || `KI-basierte Lösung zur Automatisierung und Optimierung der ${businessArea.toLowerCase()} Arbeitsabläufe`,
    businessValue: options.businessValue || generateBusinessValue(),
    techStack: options.techStack || techStacks[Math.floor(Math.random() * techStacks.length)],
    effortEstimation: options.effortEstimation || effortEstimations[Math.floor(Math.random() * effortEstimations.length)],
    createdAt: options.createdAt || new Date()
  };
};

/**
 * Create multiple use cases
 */
export const createUseCases = (count: number, baseOptions: UseCaseFactoryOptions = {}): GeneratedUseCase[] => {
  return Array.from({ length: count }, (_, index) => {
    return createUseCase({
      ...baseOptions,
      id: baseOptions.id ? `${baseOptions.id}-${index + 1}` : undefined
    });
  });
};

/**
 * Create use cases for specific maturity levels
 */
export const createUseCasesByMaturity = (maturityLevel: string, count: number = 3): GeneratedUseCase[] => {
  return createUseCases(count, { maturityLevel });
};

/**
 * Create a comprehensive use case portfolio
 */
export const createUseCasePortfolio = (): GeneratedUseCase[] => {
  const portfolio: GeneratedUseCase[] = [];
  
  // Create use cases for each maturity level
  maturityLevels.forEach(maturity => {
    const count = maturity === 'Production' ? 2 : 3; // Fewer in production
    portfolio.push(...createUseCasesByMaturity(maturity, count));
  });
  
  return portfolio;
};
