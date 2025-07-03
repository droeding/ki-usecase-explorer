import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

interface UseCaseCSVRow {
  title: string;
  description?: string;
  businessArea?: string;
  maturityLevel?: 'Draft' | 'Pilot' | 'Production';
  problemStatement?: string;
  solutionDescription?: string;
  expectedBenefit?: string;
  implementationEffort?: string;
  riskAssessment?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
}

/**
 * CSV Use-Case Import Tool
 * 
 * Erwartet CSV-Format:
 * title,description,businessArea,maturityLevel,problemStatement,solutionDescription,expectedBenefit,implementationEffort,riskAssessment,priority
 */
export class UseCaseImporter {
  private csvFilePath: string;
  private results: ImportResult = {
    total: 0,
    imported: 0,
    skipped: 0,
    errors: []
  };

  constructor(csvFilePath: string) {
    this.csvFilePath = csvFilePath;
  }

  /**
   * Validate CSV row data
   */
  private validateRow(row: any, lineNumber: number): UseCaseCSVRow | null {
    // Required field validation
    if (!row.title || row.title.trim() === '') {
      this.results.errors.push(`Zeile ${lineNumber}: Titel ist erforderlich`);
      return null;
    }

    // Maturity level validation
    const validMaturityLevels = ['Draft', 'Pilot', 'Production'];
    if (row.maturityLevel && !validMaturityLevels.includes(row.maturityLevel)) {
      this.results.errors.push(`Zeile ${lineNumber}: Ungültiger Reifegrad '${row.maturityLevel}'. Erwartet: ${validMaturityLevels.join(', ')}`);
      return null;
    }

    // Priority validation
    const validPriorities = ['HIGH', 'MEDIUM', 'LOW'];
    if (row.priority && !validPriorities.includes(row.priority)) {
      this.results.errors.push(`Zeile ${lineNumber}: Ungültige Priorität '${row.priority}'. Erwartet: ${validPriorities.join(', ')}`);
      return null;
    }

    return {
      title: row.title.trim(),
      description: row.description?.trim() || null,
      businessArea: row.businessArea?.trim() || null,
      maturityLevel: row.maturityLevel || 'Draft',
      problemStatement: row.problemStatement?.trim() || null,
      solutionDescription: row.solutionDescription?.trim() || null,
      expectedBenefit: row.expectedBenefit?.trim() || null,
      implementationEffort: row.implementationEffort?.trim() || null,
      riskAssessment: row.riskAssessment?.trim() || null,
      priority: row.priority || 'MEDIUM'
    };
  }

  /**
   * Check if use case already exists
   */
  private async useCaseExists(title: string): Promise<boolean> {
    const existing = await prisma.useCase.findFirst({
      where: {
        title: title
      }
    });
    return !!existing;
  }

  /**
   * Create use case in database
   */
  private async createUseCase(data: UseCaseCSVRow): Promise<void> {
    await prisma.useCase.create({
      data: {
        title: data.title,
        description: data.description,
        businessArea: data.businessArea,
        maturityLevel: data.maturityLevel,
        problemStatement: data.problemStatement,
        solutionDescription: data.solutionDescription,
        expectedBenefit: data.expectedBenefit,
        implementationEffort: data.implementationEffort,
        riskAssessment: data.riskAssessment,
        priority: data.priority
      }
    });
  }

  /**
   * Process CSV file and import use cases
   */
  async import(options: {
    skipExisting?: boolean;
    dryRun?: boolean;
  } = {}): Promise<ImportResult> {
    const { skipExisting = true, dryRun = false } = options;

    return new Promise((resolve, reject) => {
      if (!fs.existsSync(this.csvFilePath)) {
        reject(new Error(`CSV-Datei nicht gefunden: ${this.csvFilePath}`));
        return;
      }

      const rows: UseCaseCSVRow[] = [];
      let lineNumber = 1; // Header line

      fs.createReadStream(this.csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => {
          lineNumber++;
          this.results.total++;

          const validatedRow = this.validateRow(row, lineNumber);
          if (validatedRow) {
            rows.push(validatedRow);
          } else {
            this.results.skipped++;
          }
        })
        .on('end', async () => {
          try {
            console.log(`\n📊 CSV-Analyse abgeschlossen:`);
            console.log(`   📋 Zeilen verarbeitet: ${this.results.total}`);
            console.log(`   ✅ Gültige Use-Cases: ${rows.length}`);
            console.log(`   ⚠️  Übersprungen: ${this.results.skipped}`);
            
            if (this.results.errors.length > 0) {
              console.log(`\n❌ Validierungsfehler:`);
              this.results.errors.forEach(error => console.log(`   • ${error}`));
            }

            if (dryRun) {
              console.log(`\n🔍 DRY RUN - Keine Daten importiert`);
              resolve(this.results);
              return;
            }

            // Import valid use cases
            for (const useCaseData of rows) {
              try {
                const exists = await this.useCaseExists(useCaseData.title);
                
                if (exists && skipExisting) {
                  console.log(`   ⏭️  Übersprungen (existiert): ${useCaseData.title}`);
                  this.results.skipped++;
                  continue;
                }

                if (exists && !skipExisting) {
                  this.results.errors.push(`Use-Case existiert bereits: ${useCaseData.title}`);
                  this.results.skipped++;
                  continue;
                }

                await this.createUseCase(useCaseData);
                console.log(`   ✅ Importiert: ${useCaseData.title}`);
                this.results.imported++;

              } catch (error) {
                const errorMsg = `Fehler beim Import von '${useCaseData.title}': ${error instanceof Error ? error.message : String(error)}`;
                this.results.errors.push(errorMsg);
                console.log(`   ❌ ${errorMsg}`);
                this.results.skipped++;
              }
            }

            console.log(`\n🎉 Import abgeschlossen:`);
            console.log(`   📦 Importiert: ${this.results.imported}`);
            console.log(`   ⏭️  Übersprungen: ${this.results.skipped}`);
            console.log(`   ❌ Fehler: ${this.results.errors.length}`);

            resolve(this.results);

          } catch (error) {
            reject(error);
          } finally {
            await prisma.$disconnect();
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Generate sample CSV file
   */
  static generateSampleCSV(outputPath: string): void {
    const sampleData = [
      {
        title: 'Automatisierte Kundenberatung',
        description: 'KI-basierte Chatbots für 24/7 Kundensupport',
        businessArea: 'Kundenservice',
        maturityLevel: 'Pilot',
        problemStatement: 'Lange Wartezeiten im Kundensupport',
        solutionDescription: 'Implementierung eines intelligenten Chatbots',
        expectedBenefit: 'Reduzierung der Supportkosten um 30%',
        implementationEffort: 'Mittel',
        riskAssessment: 'Gering',
        priority: 'HIGH'
      },
      {
        title: 'Predictive Maintenance',
        description: 'Vorhersage von Ausfällen in der Produktion',
        businessArea: 'Produktion',
        maturityLevel: 'Draft',
        problemStatement: 'Ungeplante Maschinenausfälle verursachen hohe Kosten',
        solutionDescription: 'ML-Modelle zur Ausfallvorhersage',
        expectedBenefit: 'Reduzierung ungeplanter Ausfälle um 50%',
        implementationEffort: 'Hoch',
        riskAssessment: 'Mittel',
        priority: 'MEDIUM'
      },
      {
        title: 'Intelligente Dokumentenverarbeitung',
        description: 'Automatische Extraktion von Daten aus Dokumenten',
        businessArea: 'Verwaltung',
        maturityLevel: 'Production',
        problemStatement: 'Manuelle Dokumentenverarbeitung ist zeitaufwändig',
        solutionDescription: 'OCR und NLP für automatische Datenextraktion',
        expectedBenefit: 'Zeitersparnis von 70% bei Dokumentenverarbeitung',
        implementationEffort: 'Niedrig',
        riskAssessment: 'Gering',
        priority: 'HIGH'
      }
    ];

    const csvHeader = 'title,description,businessArea,maturityLevel,problemStatement,solutionDescription,expectedBenefit,implementationEffort,riskAssessment,priority\n';
    const csvRows = sampleData.map(row => 
      Object.values(row).map(value => 
        `"${value.replace(/"/g, '""')}"`
      ).join(',')
    ).join('\n');

    fs.writeFileSync(outputPath, csvHeader + csvRows);
    console.log(`✅ Beispiel-CSV erstellt: ${outputPath}`);
  }
}

// CLI interface when running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔧 Use-Case CSV Import Tool

Verwendung:
  npm run import:usecases <csv-file> [options]

Optionen:
  --dry-run           Nur Validierung, kein Import
  --force             Überschreibt existierende Use-Cases
  --generate-sample   Erstellt eine Beispiel-CSV-Datei

Beispiele:
  npm run import:usecases data/usecases.csv
  npm run import:usecases data/usecases.csv --dry-run
  npm run import:usecases --generate-sample

CSV-Format:
  title,description,businessArea,maturityLevel,problemStatement,solutionDescription,expectedBenefit,implementationEffort,riskAssessment,priority
    `);
    process.exit(0);
  }

  if (args[0] === '--generate-sample') {
    const outputPath = args[1] || './data/sample-usecases.csv';
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    UseCaseImporter.generateSampleCSV(outputPath);
    process.exit(0);
  }

  const csvFilePath = args[0];
  const options = {
    dryRun: args.includes('--dry-run'),
    skipExisting: !args.includes('--force')
  };

  const importer = new UseCaseImporter(csvFilePath);
  
  importer.import(options)
    .then((results) => {
      if (results.errors.length > 0) {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Import-Fehler:', error.message);
      process.exit(1);
    });
}

export default UseCaseImporter;
