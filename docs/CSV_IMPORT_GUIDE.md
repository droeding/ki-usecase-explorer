# 📊 CSV Use-Case Import System

## Übersicht
Vollautomatisiertes System zum Import von Use-Cases aus CSV-Dateien in die Ki Use-Case Explorer Datenbank.

## 🚀 Quick Start

### 1. Beispiel-CSV generieren
```bash
npm run import:sample
```
Erstellt `./data/sample-usecases.csv` mit 3 Beispiel Use-Cases.

### 2. CSV-Import testen (Dry Run)
```bash
npm run import:usecases data/sample-usecases.csv --dry-run
```
Validiert die CSV-Datei ohne Datenbank-Import.

### 3. Use-Cases importieren
```bash
npm run import:usecases data/sample-usecases.csv
```
Importiert alle gültigen Use-Cases in die Datenbank.

## 📋 CSV-Format

### Erforderliche Spalten
| Spalte | Erforderlich | Typ | Beschreibung |
|--------|-------------|-----|--------------|
| `title` | ✅ Ja | String | Eindeutiger Titel des Use-Cases |
| `description` | ❌ Nein | String | Detaillierte Beschreibung |
| `businessArea` | ❌ Nein | String | Geschäftsbereich (z.B. "Kundenservice") |
| `maturityLevel` | ❌ Nein | Enum | Draft, Pilot, Production |
| `problemStatement` | ❌ Nein | String | Beschreibung des Problems |
| `solutionDescription` | ❌ Nein | String | Lösungsansatz |
| `expectedBenefit` | ❌ Nein | String | Erwarteter Nutzen |
| `implementationEffort` | ❌ Nein | String | Aufwand der Umsetzung |
| `riskAssessment` | ❌ Nein | String | Risikobewertung |
| `priority` | ❌ Nein | Enum | HIGH, MEDIUM, LOW |

### Beispiel CSV-Header
```csv
title,description,businessArea,maturityLevel,problemStatement,solutionDescription,expectedBenefit,implementationEffort,riskAssessment,priority
```

## 🔧 Verfügbare Kommandos

### Import-Kommandos
```bash
# Beispiel-CSV erstellen
npm run import:sample [pfad/zur/datei.csv]

# Use-Cases importieren
npm run import:usecases <csv-datei> [optionen]

# Dry-Run (nur Validierung)
npm run import:usecases <csv-datei> --dry-run

# Bestehende Use-Cases überschreiben
npm run import:usecases <csv-datei> --force
```

### Beispiele
```bash
# Standard-Import mit Beispieldatei
npm run import:sample
npm run import:usecases data/sample-usecases.csv

# Import einer eigenen CSV-Datei
npm run import:usecases data/meine-usecases.csv

# Validierung ohne Import
npm run import:usecases data/test-usecases.csv --dry-run

# Überschreiben existierender Use-Cases
npm run import:usecases data/update-usecases.csv --force
```

## ⚙️ Import-Verhalten

### Duplikat-Behandlung
- **Standard:** Existierende Use-Cases werden übersprungen
- **Mit --force:** Existierende Use-Cases werden überschrieben
- **Erkennung:** Basiert auf exakter Titel-Übereinstimmung

### Validierung
- **Erforderliche Felder:** Titel muss vorhanden sein
- **Enum-Validierung:** maturityLevel und priority werden validiert
- **Fehler-Sammlung:** Alle Validierungsfehler werden gesammelt und angezeigt

### Error Handling
```bash
# Erfolgreich
✅ Importiert: Use-Case Titel

# Übersprungen
⏭️ Übersprungen (existiert): Use-Case Titel

# Fehler
❌ Zeile 5: Titel ist erforderlich
❌ Zeile 7: Ungültiger Reifegrad 'Invalid'
```

## 📊 Output-Format

### Import-Statistiken
```
📊 CSV-Analyse abgeschlossen:
   📋 Zeilen verarbeitet: 25
   ✅ Gültige Use-Cases: 22
   ⚠️  Übersprungen: 3

🎉 Import abgeschlossen:
   📦 Importiert: 20
   ⏭️  Übersprungen: 2
   ❌ Fehler: 3
```

### Detaillierte Logs
- **✅ Erfolg:** Jeder importierte Use-Case wird einzeln bestätigt
- **⏭️ Übersprungen:** Grund für das Überspringen wird angezeigt
- **❌ Fehler:** Spezifische Fehlermeldungen mit Zeilennummern

## 🗂️ Dateien & Struktur

### Verzeichnisstruktur
```
📦 ki-usecase-explorer-v3/
├── data/
│   ├── sample-usecases.csv          # Generierte Beispieldatei
│   └── [ihre-csv-dateien]           # Ihre Import-Dateien
├── scripts/
│   └── import-usecases.ts           # Import-Logik
└── package.json                     # NPM-Skripte
```

### CSV-Dateipfade
- **Empfohlen:** `./data/` Verzeichnis für CSV-Dateien
- **Absolut:** Vollständige Pfade möglich
- **Relativ:** Relativ zum Projekt-Root

## 🔍 Erweiterte Nutzung

### Programmatische Nutzung
```typescript
import UseCaseImporter from './scripts/import-usecases';

const importer = new UseCaseImporter('./data/usecases.csv');

// Dry-Run
const dryResult = await importer.import({ dryRun: true });

// Echter Import
const result = await importer.import({ 
  skipExisting: false,
  dryRun: false 
});

console.log(`Importiert: ${result.imported}`);
```

### Batch-Import
```bash
# Mehrere Dateien nacheinander
for file in data/*.csv; do
  npm run import:usecases "$file"
done
```

## 🧪 Testing & Validierung

### Test-Workflow
1. **CSV generieren:** `npm run import:sample`
2. **Validieren:** `npm run import:usecases data/sample-usecases.csv --dry-run`
3. **Importieren:** `npm run import:usecases data/sample-usecases.csv`
4. **Überprüfen:** `npm run db:studio` (Datenbank anzeigen)

### Datenbank-Zugriff
```bash
# Prisma Studio öffnen
npm run db:studio

# Development Seeds laufen lassen
npm run db:seed
```

## 🚨 Troubleshooting

### Häufige Probleme

#### CSV-Format-Fehler
```
❌ Zeile 3: Titel ist erforderlich
```
**Lösung:** Stellen Sie sicher, dass jede Zeile einen Titel hat.

#### Ungültige Enum-Werte
```
❌ Zeile 5: Ungültiger Reifegrad 'Produktiv'
```
**Lösung:** Verwenden Sie nur: Draft, Pilot, Production

#### Datei nicht gefunden
```
❌ CSV-Datei nicht gefunden: data/missing.csv
```
**Lösung:** Überprüfen Sie den Dateipfad und die Berechtigung.

### Datenbank-Probleme
- **Connection Error:** Stellen Sie sicher, dass die Datenbank läuft
- **Schema Mismatch:** Führen Sie `wasp db migrate-dev` aus

## 📈 Performance & Limits

### Empfohlene Batch-Größen
- **Klein:** 1-50 Use-Cases - Sofort
- **Mittel:** 51-500 Use-Cases - 10-30 Sekunden  
- **Groß:** 501+ Use-Cases - Aufteilen empfohlen

### Memory Usage
- **CSV-Parser:** Streaming-basiert, niedriger Memory-Verbrauch
- **Datenbank:** Sequentieller Insert, kein Bulk-Insert

---

**Erstellt:** 2. Juli 2025  
**Version:** 1.0  
**Maintenance:** Automatische Updates bei Schema-Änderungen
