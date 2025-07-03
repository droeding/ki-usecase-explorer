import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create some sample use cases
  const useCases = [
    {
      title: "Automatisierte Rechnungsverarbeitung",
      description: "KI-gestützte Extraktion und Verarbeitung von Rechnungsdaten zur Beschleunigung der Buchhaltungsprozesse",
      businessArea: "Finanzwesen",
      maturityLevel: "Pilot",
      problemStatement: "Manuelle Rechnungsverarbeitung ist zeitaufwändig und fehleranfällig",
      solutionDescription: "Einsatz von OCR und NLP zur automatischen Datenextraktion",
      businessValue: "50% Zeitersparnis, 90% weniger Fehler",
      techStack: "Azure Cognitive Services, Power Automate",
      effortEstimation: "3-6 Monate"
    },
    {
      title: "Intelligenter Chatbot für IT-Support",
      description: "24/7 verfügbarer Chatbot zur Bearbeitung häufiger IT-Anfragen und Ticketerstellung",
      businessArea: "IT Services",
      maturityLevel: "Konzept",
      problemStatement: "Hohe Anzahl repetitiver IT-Support-Anfragen außerhalb der Geschäftszeiten",
      solutionDescription: "NLP-basierter Chatbot mit Integration in bestehende Ticketsysteme",
      businessValue: "40% Reduktion der Level-1-Tickets, verbesserte Mitarbeiterzufriedenheit",
      techStack: "Microsoft Bot Framework, Azure Cognitive Services",
      effortEstimation: "4-8 Monate"
    },
    {
      title: "Predictive Maintenance für Serverinfrastruktur",
      description: "Vorhersagbare Wartung basierend auf Sensor- und Performancedaten zur Minimierung von Ausfallzeiten",
      businessArea: "Infrastructure",
      maturityLevel: "Produktion",
      problemStatement: "Ungeplante Serverausfälle führen zu Geschäftsunterbrechungen",
      solutionDescription: "Machine Learning Modelle zur Anomalieerkennung und Ausfallvorhersage",
      businessValue: "30% weniger ungeplante Ausfälle, optimierte Wartungskosten",
      techStack: "Azure Machine Learning, IoT Hub, Power BI",
      effortEstimation: "6-12 Monate"
    }
  ]

  console.log('Creating sample use cases...')
  
  for (const useCase of useCases) {
    const created = await prisma.useCase.create({
      data: useCase
    })
    console.log(`Created use case: ${created.title}`)
  }
  
  console.log('Sample data created successfully!')
}

main()
  .catch((e) => {
    console.error('Error creating sample data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
