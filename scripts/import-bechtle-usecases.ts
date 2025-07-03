import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

interface BechtelCSVRow {
  "Titel": string;
  "Offizieller Titel": string;
  "Kurzbeschreibung": string;
  "Ausgangssituation": string;
  "KI-Lösung": string;
  "Kundennutzen": string;
  "Quelle": string;
  "Status": string;
  "Verantwortlich": string;
  "Branche": string;
  "Funktion": string;
  "Komplexität": string;
  "ROI-Potenzial": string;
  "Abhängigkeiten": string;
  "Demo verfügbar ": string;
}

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
}

/**
 * Specialized importer for Bechtle KI Use-Case CSV format
 */
export class BechtelUseCaseImporter {
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
   * Map complexity to maturity level
   */
  private mapComplexityToMaturity(komplexität: string): string {
    const komplexitätLower = komplexität.toLowerCase();
    if (komplexitätLower.includes('niedrig') || komplexitätLower.includes('gering')) {
      return 'Production';
    } else if (komplexitätLower.includes('mittel')) {
      return 'Pilot';
    } else if (komplexitätLower.includes('hoch')) {
      return 'Draft';
    }
    return 'Draft'; // Default
  }

  /**
   * Map ROI potential to priority
   */
  private mapROIToPriority(roiPotenzial: string): string {
    const roiLower = roiPotenzial.toLowerCase();
    if (roiLower.includes('hoch')) {
      return 'HIGH';
    } else if (roiLower.includes('mittel')) {
      return 'MEDIUM';
    } else if (roiLower.includes('niedrig') || roiLower.includes('gering')) {
      return 'LOW';
    }
    return 'MEDIUM'; // Default
  }

  /**
   * Map business area (clean up the value)
   */
  private mapBusinessArea(branche: string): string {
    // Extract main business area, remove details in parentheses
    const cleaned = branche.replace(/\(.*\)/g, '').trim();
    return cleaned || 'Allgemein';
  }

  /**
   * Validate and transform CSV row
   */
  private validateAndTransformRow(row: BechtelCSVRow, lineNumber: number): any | null {
    // Use "Offizieller Titel" as primary title, fallback to "Titel"
    const title = row["Offizieller Titel"]?.trim() || row["Titel"]?.trim();
    
    if (!title || title === '') {
      this.results.errors.push(`Zeile ${lineNumber}: Titel ist erforderlich`);
      return null;
    }

    // Skip rows where Titel is just a number (seems to be ID rows)
    if (/^\d+$/.test(row["Titel"]?.trim())) {
      // Use the official title for these cases
      if (!row["Offizieller Titel"]?.trim()) {
        this.results.errors.push(`Zeile ${lineNumber}: Kein gültiger Titel gefunden`);
        return null;
      }
    }

    return {
      title: title,
      description: row["Kurzbeschreibung"]?.trim() || null,
      businessArea: this.mapBusinessArea(row["Branche"]?.trim() || ''),
      maturityLevel: this.mapComplexityToMaturity(row["Komplexität"]?.trim() || ''),
      problemStatement: row["Ausgangssituation"]?.trim() || null,
      solutionDescription: row["KI-Lösung"]?.trim() || null,
      expectedBenefit: row["Kundennutzen"]?.trim() || null,
      implementationEffort: row["Komplexität"]?.trim() || null,
      riskAssessment: row["Abhängigkeiten"]?.trim() || null,
      priority: this.mapROIToPriority(row["ROI-Potenzial"]?.trim() || '')
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
  private async createUseCase(data: any): Promise<void> {
    await prisma.useCase.create({
      data: data
    });
  }

  /**
   * Process Bechtle CSV and import use cases
   */
  async import(options: {
    skipExisting?: boolean;
    dryRun?: boolean;
    skipFirstLine?: boolean;
  } = {}): Promise<ImportResult> {
    const { skipExisting = true, dryRun = false, skipFirstLine = true } = options;

    return new Promise((resolve, reject) => {
      if (!fs.existsSync(this.csvFilePath)) {
        reject(new Error(`CSV-Datei nicht gefunden: ${this.csvFilePath}`));
        return;
      }

      const rows: any[] = [];
      let lineNumber = 0; // Start with 0, will be incremented
      let skipLine = true; // Skip the first data line (SharePoint schema)

      fs.createReadStream(this.csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => {
          lineNumber++;
          
          // Skip the first data line if it contains SharePoint schema
          if (skipLine && skipFirstLine) {
            const firstValue = Object.values(row)[0] as string;
            if (firstValue && (firstValue.includes('ListSchema') || firstValue.includes('{'))) {
              console.log('   📋 SharePoint-Schema-Zeile übersprungen');
              skipLine = false;
              return;
            }
          }
          skipLine = false;

          this.results.total++;

          const validatedRow = this.validateAndTransformRow(row as BechtelCSVRow, lineNumber);
          if (validatedRow) {
            rows.push(validatedRow);
          } else {
            this.results.skipped++;
          }
        })
        .on('end', async () => {
          try {
            console.log(`\n📊 Bechtle CSV-Analyse abgeschlossen:`);
            console.log(`   📋 Zeilen verarbeitet: ${this.results.total}`);
            console.log(`   ✅ Gültige Use-Cases: ${rows.length}`);
            console.log(`   ⚠️  Übersprungen: ${this.results.skipped}`);
            
            if (this.results.errors.length > 0) {
              console.log(`\n❌ Validierungsfehler:`);
              this.results.errors.forEach(error => console.log(`   • ${error}`));
            }

            if (dryRun) {
              console.log(`\n🔍 DRY RUN - Keine Daten importiert`);
              console.log(`\n📋 Beispiel Use-Cases:`);
              rows.slice(0, 3).forEach((useCase, index) => {
                console.log(`   ${index + 1}. ${useCase.title}`);
                console.log(`      📍 Bereich: ${useCase.businessArea}`);
                console.log(`      🎯 Priorität: ${useCase.priority}`);
                console.log(`      📊 Reifegrad: ${useCase.maturityLevel}`);
                console.log('');
              });
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
                console.log(`   ✅ Importiert: ${useCaseData.title} (${useCaseData.businessArea})`);
                this.results.imported++;

              } catch (error) {
                const errorMsg = `Fehler beim Import von '${useCaseData.title}': ${error instanceof Error ? error.message : String(error)}`;
                this.results.errors.push(errorMsg);
                console.log(`   ❌ ${errorMsg}`);
                this.results.skipped++;
              }
            }

            console.log(`\n🎉 Bechtle Use-Case Import abgeschlossen:`);
            console.log(`   📦 Importiert: ${this.results.imported}`);
            console.log(`   ⏭️  Übersprungen: ${this.results.skipped}`);
            console.log(`   ❌ Fehler: ${this.results.errors.length}`);

            // Show business area distribution
            const businessAreas = rows.reduce((acc: any, useCase) => {
              acc[useCase.businessArea] = (acc[useCase.businessArea] || 0) + 1;
              return acc;
            }, {});
            
            console.log(`\n📊 Verteilung nach Geschäftsbereichen:`);
            Object.entries(businessAreas).forEach(([area, count]) => {
              console.log(`   • ${area}: ${count} Use-Cases`);
            });

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
}

// CLI interface when running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  const csvFilePath = './data/KI-UseCase-Sammlung-clean.csv';
  const options = {
    dryRun: args.includes('--dry-run'),
    skipExisting: !args.includes('--force'),
    skipFirstLine: false // Already cleaned CSV
  };

  if (args.includes('--help') || (args.length === 0 && !args.includes('--dry-run'))) {
    console.log(`
🔧 Bechtle KI Use-Case CSV Import Tool

Verwendung:
  npm run import:bechtle [options]

Optionen:
  --dry-run           Nur Validierung, kein Import
  --force             Überschreibt existierende Use-Cases

Beispiele:
  npm run import:bechtle --dry-run
  npm run import:bechtle
  npm run import:bechtle --force

Die CSV-Datei wird automatisch unter data/KI-UseCase-Sammlung-clean.csv verwendet.
    `);
    
    // If no arguments provided, run the actual import
    if (args.length === 0) {
      console.log(`\n🚀 Starte Import der Bechtle Use-Cases...\n`);
    } else {
      process.exit(0);
    }
  }

  const importer = new BechtelUseCaseImporter(csvFilePath);
  
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

export default BechtelUseCaseImporter;
