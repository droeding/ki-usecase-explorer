/**
 * Static UseCase Fixtures for Testing
 * Provides realistic AI use cases relevant to Bechtle's business context
 */

export interface UseCaseFixture {
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

export const useCaseFixtures: UseCaseFixture[] = [
  {
    id: 'usecase-001',
    title: 'Automatisierte Kundenanfrage-Klassifikation',
    description: 'KI-basierte Klassifikation und Weiterleitung von Kundenanfragen zur Verbesserung der Servicequalität',
    businessArea: 'Customer Service',
    maturityLevel: 'Pilot',
    problemStatement: 'Manuelle Klassifikation von täglich 500+ Kundenanfragen führt zu Verzögerungen und inkonsistenter Bearbeitung',
    solutionDescription: 'Machine Learning Modell zur automatischen Kategorisierung von E-Mails nach Thema, Priorität und zuständiger Abteilung',
    businessValue: 'Reduzierung der Bearbeitungszeit um 60%, Verbesserung der Kundenzufriedenheit um 25%',
    techStack: 'Azure Cognitive Services, Logic Apps, Power Automate',
    effortEstimation: '3-4 Monate',
    createdAt: new Date('2025-01-01T10:00:00Z')
  },
  {
    id: 'usecase-002',
    title: 'Intelligente Inventory-Optimierung',
    description: 'Predictive Analytics für optimale Lagerhaltung und Beschaffungsplanung',
    businessArea: 'Supply Chain',
    maturityLevel: 'Konzept',
    problemStatement: 'Überschüssige Lagerbestände führen zu Kapitalbindung von 2.3M€, gleichzeitig 15% Out-of-Stock-Rate',
    solutionDescription: 'ML-Algorithmus zur Vorhersage von Nachfrage basierend auf historischen Daten, Trends und externen Faktoren',
    businessValue: 'Reduzierung der Lagerkosten um 20%, Verbesserung der Verfügbarkeit um 30%',
    techStack: 'Azure Machine Learning, Synapse Analytics, Power BI',
    effortEstimation: '6-8 Monate',
    createdAt: new Date('2025-01-02T10:00:00Z')
  },
  {
    id: 'usecase-003',
    title: 'Automatisierte Code-Review-Assistenz',
    description: 'KI-unterstützte Code-Qualitätsprüfung und Sicherheitsanalyse für Entwicklungsprojekte',
    businessArea: 'Software Development',
    maturityLevel: 'Prototyp',
    problemStatement: 'Manuelle Code-Reviews verzögern Releases um durchschnittlich 2-3 Tage und finden nur 70% der kritischen Issues',
    solutionDescription: 'GitHub Copilot Integration mit Custom Rules für automatische Code-Analyse, Sicherheitschecks und Best Practice Validation',
    businessValue: 'Beschleunigung der Entwicklungszyklen um 40%, Reduktion kritischer Bugs um 50%',
    techStack: 'GitHub Advanced Security, Azure DevOps, SonarCloud',
    effortEstimation: '2-3 Monate',
    createdAt: new Date('2025-01-03T10:00:00Z')
  },
  {
    id: 'usecase-004',
    title: 'Intelligentes Dokumenten-Management',
    description: 'Automatische Extraktion und Kategorisierung von Informationen aus Verträgen und technischen Dokumenten',
    businessArea: 'Document Management',
    maturityLevel: 'Research',
    problemStatement: 'Manuelle Verarbeitung von 1000+ Dokumenten pro Monat kostet 120 Arbeitsstunden und ist fehleranfällig',
    solutionDescription: 'OCR und NLP Pipeline zur automatischen Extraktion von Schlüsselinformationen, Klassifikation und Indexierung',
    businessValue: 'Zeitersparnis von 80%, Verbesserung der Suchbarkeit und Compliance',
    techStack: 'Azure Form Recognizer, Cognitive Search, Document Intelligence',
    effortEstimation: '4-5 Monate',
    createdAt: new Date('2025-01-04T10:00:00Z')
  },
  {
    id: 'usecase-005',
    title: 'Predictive IT-Infrastructure Monitoring',
    description: 'Vorhersage von System-Ausfällen durch KI-basierte Analyse von Performance-Metriken',
    businessArea: 'IT Operations',
    maturityLevel: 'Pilot',
    problemStatement: 'Ungeplante Systemausfälle verursachen durchschnittlich 15 Stunden Downtime pro Monat',
    solutionDescription: 'Machine Learning Modell zur Anomalieerkennung in Systemmetriken mit proaktiven Wartungsempfehlungen',
    businessValue: 'Reduzierung ungeplanter Ausfälle um 70%, Kosteneinsparung von 200k€ pro Jahr',
    techStack: 'Azure Monitor, Log Analytics, Machine Learning Studio',
    effortEstimation: '3-4 Monate',
    createdAt: new Date('2025-01-05T10:00:00Z')
  },
  {
    id: 'usecase-006',
    title: 'Chatbot für technischen Support',
    description: 'Intelligenter Chatbot zur Beantwortung häufiger technischer Fragen und Troubleshooting',
    businessArea: 'Technical Support',
    maturityLevel: 'Production',
    problemStatement: 'Support-Team verbringt 60% der Zeit mit wiederkehrenden Standard-Anfragen',
    solutionDescription: 'Conversational AI mit Zugriff auf Knowledge Base für automatische Problemlösung und Eskalation',
    businessValue: 'Entlastung des Support-Teams um 50%, 24/7 Verfügbarkeit, bessere Kundenerfahrung',
    techStack: 'Azure Bot Service, QnA Maker, Language Understanding',
    effortEstimation: '2-3 Monate',
    createdAt: new Date('2025-01-06T10:00:00Z')
  }
];

// Utility functions for accessing specific use cases
export const getUseCasesByMaturity = (maturityLevel: string): UseCaseFixture[] => {
  return useCaseFixtures.filter(uc => uc.maturityLevel === maturityLevel);
};

export const getUseCasesByBusinessArea = (businessArea: string): UseCaseFixture[] => {
  return useCaseFixtures.filter(uc => uc.businessArea === businessArea);
};

export const getUseCaseById = (id: string): UseCaseFixture | undefined => {
  return useCaseFixtures.find(uc => uc.id === id);
};

// Get use cases for different test scenarios
export const getPilotUseCases = () => getUseCasesByMaturity('Pilot');
export const getProductionUseCases = () => getUseCasesByMaturity('Production');
export const getConceptUseCases = () => getUseCasesByMaturity('Konzept');
