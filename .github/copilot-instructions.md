# Wasp Ki Use-Case Explorer - Copilot Instructions

## 🎯 Project Overview
Bechtle Ki Use-Case Explorer - A mobile-first evaluation platform for AI use cases built with Wasp framework.

## ⚠️ MANDATORY: BMad Agent Usage

**KRITISCHE VORGABE**: Für ALLE Arbeiten an diesem Projekt MUSS ein spezialisierter BMad-Agent verwendet werden.

### BMad-Core Integration
- **BMad System**: `.bmad-core/` mit vollständiger Agent-Konfiguration installiert
- **Chatmodes**: `.github/chatmodes/` für VS Code Integration
- **Core Config**: `.bmad-core/core-config.yml` definiert Projekt-Konfiguration
- **Agent Teams**: Verschiedene Teams für verschiedene Projekt-Typen

### Verpflichtende Prozedur:
1. **Bevor** Sie mit der Arbeit beginnen, MÜSSEN Sie einen passenden BMad-Agent aktivieren
2. Verwenden Sie `*agents` um verfügbare Agenten zu sehen
3. Aktivieren Sie den passenden Agent mit `*agent [name]`
4. Arbeiten Sie NUR innerhalb der Rolle des aktivierten Agents

### Agent-Zuordnung nach Aufgabentyp:
- **Code-Implementierung**: `*agent dev` (James - Full Stack Developer)
- **System-Design/Architektur**: `*agent architect` (Winston - Architect)
- **Produktplanung/PRDs**: `*agent pm` (John - Product Manager)
- **Story-Erstellung/Backlog**: `*agent po` (Sarah - Product Owner)
- **Code-Review/Testing**: `*agent qa` (Quinn - QA Architect)
- **UX/UI Design**: `*agent ux-expert` (Sally - UX Expert)
- **Projekt-Analyse**: `*agent analyst` (Mary - Business Analyst)
- **Agile Prozesse**: `*agent sm` (Bob - Scrum Master)

### BMad Commands (alle mit * Prefix):
- `*help` - BMad Hilfe anzeigen
- `*agent [name]` - Agent aktivieren
- `*agents` - Verfügbare Agenten auflisten
- `*workflow [name]` - Workflow starten
- `*task [name]` - Spezifische Aufgabe ausführen
- `*status` - Aktueller Status anzeigen
- `*exit` - Agent verlassen

**KEINE Arbeit ohne aktiven BMad-Agent!**

## Core Commands

### Development
- `wasp start` - Start development server (localhost:3000)
- `wasp clean` - Clean build cache and node_modules
- `wasp db migrate-dev` - Run database migrations for development
- `wasp db studio` - Open Prisma Studio for database management

### Build & Deployment
- `wasp build` - Production build (requires PostgreSQL config)
- `./scripts/build-production.sh` - Build with auto PostgreSQL/SendGrid config
- `./scripts/deploy.sh` - Deploy to Azure Static Web Apps (token-based)
- `npm run deploy:azure` - Build and deploy in one step

### Testing
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

### Database Operations
- `wasp db migrate-dev` - Create and apply development migrations
- `wasp db migrate-prod` - Apply production migrations
- `wasp db studio` - Launch Prisma Studio
- `wasp db seed` - Run database seeding (if configured)

### Linting & Type Checking
- `npm run lint` - Run linting (Wasp managed)
- `npm run type-check` - TypeScript type checking

## Architecture Overview

### Tech Stack
- **Frontend**: Wasp (React 18, TypeScript, Vite)
- **Backend**: Wasp (Node.js, Express, Prisma ORM)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Deployment**: Azure Static Web Apps + Azure Functions
- **Authentication**: Wasp Auth (email/password, SendGrid for production)
- **Styling**: Custom CSS with Bechtle branding (#00B04F, #004B87)

### Project Structure
```
├── src/
│   ├── pages/          # React components for routes
│   ├── queries.ts      # Server-side read operations
│   ├── actions.ts      # Server-side write operations
│   └── components/     # Shared React components
├── lib/
│   ├── mobile-components.tsx  # Mobile-first UI components
│   └── mobile-templates.tsx   # Template components
├── main.wasp          # Wasp configuration and entities
├── scripts/           # Deployment and build scripts
└── docs/             # Project documentation
```

### Database Schema
- **User**: Authentication, evaluations relationship
- **UseCase**: Title, description, business area, maturity level
- **Evaluation**: User ratings (HIGH/MEDIUM/LOW) for use cases
- **Auth entities**: Session, AuthIdentity (Wasp managed)

### External Services
- **SendGrid**: Email service for production
- **Azure Static Web Apps**: Hosting platform
- **Azure PostgreSQL**: Production database

## Coding Standards

### Wasp Configuration
- Main config in `main.wasp`
- TypeScript enabled by default
- Use Wasp operations for client-server communication
- Prisma ORM for database operations

### File Naming
- Components: `PascalCase.tsx` in `src/pages/`
- Queries: `camelCase.ts` in `src/queries.ts`
- Actions: `camelCase.ts` in `src/actions.ts`
- Utils/libs: `camelCase.ts` in `lib/`

### Import Patterns
```typescript
// Wasp imports first
import { useQuery } from 'wasp/client/operations'
import { getUseCases } from 'wasp/client/operations'

// External libraries
import { useState, useEffect } from 'react'

// Internal utilities
import { cn } from '@/lib/utils'
import { ApiResponse } from '@/lib/types'
```

### Wasp Operations
```typescript
// Queries (src/queries.ts)
export const getUseCases = async (args: any, context: any) => {
  return context.entities.UseCase.findMany()
}

// Actions (src/actions.ts)  
export const submitEvaluation = async (args: any, context: any) => {
  return context.entities.Evaluation.create({ data: args })
}
```

### Styling & UI Standards
- **Mobile-first design**: All components responsive from 320px
- **Bechtle branding**: Primary #00B04F, Secondary #004B87
- **Inline styles**: Used for component-specific styling
- **Utility classes**: Custom CSS utilities for layout/spacing
- **Component library**: `lib/mobile-components.tsx` for reusable UI

### TypeScript & Error Handling
- **Strict typing**: Use `any` only for Wasp operation parameters
- **Operation types**: `(args: any, context: any)` for queries/actions
- **Error responses**: Use `HttpError` from 'wasp/server' for API errors
- **Authentication checks**: `context.user` validation in operations

## 🚀 Deployment Strategy (Enterprise Azure)

### CRITICAL: Token-Based Deployment Only - NO GITHUB WORKFLOWS
This template uses **token-based deployment WITHOUT GitHub Actions** - Direct Azure CLI deployment only.

### Deployment Process
```bash
# 1. Build application for production
npm run deploy:azure

# 2. Manual deployment (alternative)
./scripts/deploy.sh
```

### Manual Token Deployment (Alternative)
```bash
# 1. Get deployment token from Azure
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name APP_NAME --resource-group RG_NAME --query "properties.apiKey" -o tsv)

# 2. Deploy using SWA CLI
npx @azure/static-web-apps-cli deploy ./out --deployment-token $DEPLOYMENT_TOKEN

# 3. Deploy using script
./scripts/deploy.sh
```

### Azure Enterprise Policy Handling
When encountering Azure policy restrictions:
- **Use existing Resource Groups** in allowed regions
- **Deploy with tokens** (bypasses policies)
- **Avoid CLI authentication** issues
- **NO GitHub integration required**
- **NO Git workflows needed**

### Static Export Configuration
```javascript
// Wasp handles Next.js configuration internally
// Only custom overrides in next.config.js if needed
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  }
}
```

## Environment Configuration

### Required Variables (.env.local)
```bash
# Database (if applicable)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Production API base
NEXT_PUBLIC_API_BASE_URL="https://your-app.azurestaticapps.net"

# Development
NODE_ENV="development"
```

### Azure Static Web App Settings
Configure server-side environment variables in Azure portal under Static Web App configuration.

## Common Issues & Solutions

### 1. Deployment Token Issues
```bash
Error: Application with identifier 'client-id' was not found
```
**Solution**: Remove .env files before deployment
```bash
mv .env .env.backup
./scripts/deploy.sh
mv .env.backup .env
```

### 2. Missing index.html Error
```bash
Error: Failed to find a default file in the app artifacts folder
```
**Solution**: Ensure `output: 'export'` in next.config.js

### 3. API Routes Not Working
**Check**:
- Azure Functions structure in `/api/` directory
- `function.json` files present
- `staticwebapp.config.json` routing

### 4. Environment Variables Not Loading
**Solutions**:
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Configure server variables in Azure Static Web App settings
- Check file naming: `.env.local` for development

## BMad Agent Integration

### Available Commands (require `*` prefix)
- `*help` - Show BMad Orchestrator guide with available agents and workflows
- `*agent [name]` - Transform into specific agent (dev, architect, pm, po, qa, ux-expert, analyst, sm)
- `*agents` - List all available specialist agents
- `*workflow [name]` - Start specific workflow (list if no name provided)
- `*workflow-guidance` - Get personalized help selecting the right workflow
- `*task [name]` - Run specific task (requires active agent)
- `*checklist [name]` - Execute checklist (requires active agent)
- `*status` - Show current context, active agent, and progress
- `*plan` - Create detailed workflow plan before starting
- `*plan-status` - Show current workflow plan progress
- `*exit` - Return to BMad or exit session

### BMad-Core File Structure
```
.bmad-core/
├── agents/           # Agent definitions and configurations
├── tasks/           # Reusable tasks for agents
├── templates/       # Document templates (PRD, stories, architecture)
├── checklists/      # Quality gates and validation checklists
├── workflows/       # Multi-step process definitions
├── utils/           # Utility functions and helpers
├── data/           # Knowledge base and preferences
└── core-config.yml # Project configuration
```

### Project-Specific BMad Configuration
- **Stories**: `docs/stories/` - Development stories location
- **PRD**: `docs/prd.md` - Product requirements (sharded in `docs/prd/`)
- **Architecture**: `docs/architecture.md` - Technical architecture (sharded in `docs/architecture/`)
- **Debug Log**: `.ai/debug-log.md` - Development debug tracking
- **Always Load**: Coding standards, tech stack, source tree for dev agent

### Chatmodes Integration (.github/chatmodes/)
- VS Code integration for BMad agents
- Each agent has dedicated `.chatmode.md` file
- Automatic persona activation in VS Code
- Preserves context between sessions

## Documentation Reference

- [docs/AZURE_DEPLOYMENT.md](../docs/AZURE_DEPLOYMENT.md) - Complete Azure deployment guide
- [docs/DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md) - Deployment workflow
- [docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) - Common issues

## Key Project Context

### Business Domain
- **Bechtle Ki Use-Case Explorer**: Internal platform for evaluating AI use cases
- **Target users**: Bechtle employees, IT consultants, business analysts
- **Evaluation system**: HIGH/MEDIUM/LOW ratings for use case viability
- **Mobile-optimized**: Designed for tablet/mobile usage in meetings

### Development Notes
- **EmailSender**: Uses Dummy for dev, SendGrid for production
- **Database**: SQLite in development, must switch to PostgreSQL for production builds
- **Authentication**: Email-based with verification, no social auth
- **Deployment**: Token-based Azure CLI deployment, NO GitHub Actions

---

*Bechtle Ki Use-Case Explorer - Mobile-first AI use case evaluation platform built with Wasp framework.*
