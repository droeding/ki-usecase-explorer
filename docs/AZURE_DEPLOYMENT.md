# Azure Static Web Apps Deployment Guide (Wasp)

## 🚀 Token-Based Deployment (NO GitHub Required)

Dieses **Wasp-Projekt** nutzt ausschließlich token-basiertes Deployment ohne GitHub Actions oder Git-Integration.

## Voraussetzungen

### 1. Wasp Installation
```bash
curl -sSL https://get.wasp-lang.dev/installer.sh | sh
```

### 2. Azure CLI Installation
```bash
# macOS
brew install azure-cli

# Windows
winget install Microsoft.AzureCLI

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### 3. Azure Login
```bash
az login
```

### 4. Node.js und npm
- Node.js >= 18.0.0
- npm >= 8.0.0

## Deployment-Prozess

### Option 1: Automatisches Deployment (Empfohlen)
```bash
# Alles in einem Schritt
npm run deploy:azure
```

### Option 2: Manueller Prozess
```bash
# 1. Build für Production mit Wasp
wasp build

# 2. Deploy ausführen
./scripts/deploy.sh
```

### Option 3: Nur Token-Deployment
```bash
# 1. Wasp Build
wasp build

# 2. Token abrufen (falls bereits deployed)
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name ki-usecase-explorer \
  --resource-group rg-bechtle-ai-apps \
  --query "properties.apiKey" -o tsv)

# 3. Deployment
npx @azure/static-web-apps-cli deploy .wasp/build/web-app/build \
  --deployment-token $DEPLOYMENT_TOKEN
```

## Wasp-spezifische Konfiguration

### Build-Verzeichnis
- Wasp erstellt: `.wasp/build/web-app/build/`
- Client Build: `.wasp/build/web-app/build/`
- Server wird separat als Azure Functions deployed

### Database Migration
```bash
# Vor dem ersten Deployment
wasp db migrate-dev

# Für Production (PostgreSQL)
wasp db migrate-prod
```

### Environment Setup
```bash
# .env.server (für Production)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
WASP_WEB_CLIENT_URL=https://ki-usecase-explorer.azurestaticapps.net
```

## Azure Ressourcen

### Azure Ressourcen
- **App Name**: `ki-usecase-explorer`
- **Resource Group**: `rg-bechtle-ai-apps`
- **Location**: `westeurope`
- **SKU**: `Free`

### Environment Variables
Folgende Variablen in Azure Static Web App konfigurieren:

```bash
# Production API Base URL
NEXT_PUBLIC_API_BASE_URL=https://ki-usecase-explorer.azurestaticapps.net

# Database Connection (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Authentication
AUTH_SECRET=your-secret-key
```

## Troubleshooting

### Problem: "Resource group not found"
```bash
# Resource Group erstellen
az group create --name rg-bechtle-ai-apps --location westeurope
```

### Problem: "Static Web App not found"
```bash
# Erste Deployment ausführen
./scripts/deploy.sh
```

### Problem: "Build failed"
```bash
# Dependencies installieren
npm install

# TypeScript Fehler prüfen
npm run type-check

# Wasp Clean
wasp clean && wasp start
```

### Problem: "Deployment token invalid"
```bash
# Neuen Token abrufen
az staticwebapp secrets list \
  --name ki-usecase-explorer \
  --resource-group rg-bechtle-ai-apps \
  --query "properties.apiKey" -o tsv
```

## Monitoring & Management

### Azure Portal
```
https://portal.azure.com/#resource/subscriptions/{subscription-id}/resourceGroups/rg-bechtle-ai-apps/providers/Microsoft.Web/staticSites/ki-usecase-explorer
```

### Logs anzeigen
```bash
# Deployment Logs
az staticwebapp logs show \
  --name ki-usecase-explorer \
  --resource-group rg-bechtle-ai-apps
```

### Custom Domain hinzufügen
```bash
az staticwebapp hostname set \
  --name ki-usecase-explorer \
  --resource-group rg-bechtle-ai-apps \
  --hostname your-domain.com
```

## Security Considerations

### HTTPS
- Automatisch aktiviert durch Azure Static Web Apps
- Kostenlose SSL-Zertifikate

### Authentication
- Configured in `staticwebapp.config.json`
- Route-basierte Zugriffskontrollen

### Headers
- Security Headers in `staticwebapp.config.json`
- CSP, X-Frame-Options, etc.

## Performance

### CDN
- Automatisch aktiviert
- Global Edge-Standorte

### Caching
- Static Assets: 1 Jahr
- HTML: No-Cache
- API: Custom Headers

## Kosten

### Free Tier Limits
- 100 GB Traffic/Monat
- 0.5 GB Storage
- Custom Domains: 2

### Monitoring
```bash
# Usage anzeigen
az staticwebapp show \
  --name ki-usecase-explorer \
  --resource-group rg-bechtle-ai-apps \
  --query "usage"
```

---

**Wichtig**: Dieses Deployment nutzt ausschließlich Azure CLI und Token - KEINE GitHub Integration erforderlich!
