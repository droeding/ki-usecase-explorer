# KI Use-Case Explorer

## Azure Deployment via GitHub Actions

This project automatically deploys to Azure Web App using GitHub Actions.

### Setup Instructions

1. **Create GitHub Repository**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/ki-usecase-explorer.git
   git push -u origin main
   ```

2. **Get Azure Web App Publish Profile**
   - Go to Azure Portal → ki-usecase-backend-app
   - Click "Get publish profile" and download the file
   - Copy the entire content of the .publishsettings file

3. **Set GitHub Secret**
   - Go to GitHub Repository → Settings → Secrets and Variables → Actions
   - Add new secret: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Paste the publish profile content

4. **Configure Environment Variables in Azure**
   Set these in Azure Portal → App Service → Configuration → Application Settings:
   ```
   PORT=8000
   NODE_ENV=production
   DATABASE_URL=postgresql://ki_admin:P%40ssw0rd123@ki-usecase-db-server.postgres.database.azure.com:5432/ki_usecase_db?sslmode=require
   WASP_SERVER_URL=https://ki-usecase-backend-app.azurewebsites.net
   WASP_WEB_CLIENT_URL=https://ki-usecase-frontend.azurewebsites.net
   JWT_SECRET=[generate a secure random string]
   SENDGRID_API_KEY=[your SendGrid API key]
   SKIP_EMAIL_VERIFICATION_IN_DEV=false
   ```

5. **Deploy**
   - Push to main branch triggers automatic deployment
   - Or manually trigger via GitHub Actions tab

### Local Development

```bash
npm install
wasp db migrate-dev
wasp start
```

### Architecture

- **Backend**: Wasp + Node.js + Express + Prisma
- **Database**: PostgreSQL on Azure
- **Deployment**: GitHub Actions → Azure Web App
- **Authentication**: Lucia Auth with email/password

## 🎭 BMad Agent System

This project uses **BMad Method** for structured development with specialized AI agents.

### Quick Agent Activation
```bash
*help           # Show all available commands
*agents         # List all specialist agents
*agent dev      # Activate Full Stack Developer (James)
*agent po       # Activate Product Owner (Sarah)
*agent architect # Activate System Architect (Winston)
```

### Available Specialists
- **James** (`*agent dev`) - Full Stack Developer for implementation
- **Sarah** (`*agent po`) - Product Owner for stories and backlog
- **Winston** (`*agent architect`) - System Architect for design
- **Quinn** (`*agent qa`) - QA Architect for testing
- **Sally** (`*agent ux-expert`) - UX Expert for design
- **Mary** (`*agent analyst`) - Business Analyst for requirements
- **Bob** (`*agent sm`) - Scrum Master for process

### Key BMad Locations
- **Stories**: `docs/stories/` - Development user stories
- **PRD**: `docs/prd/` - Product requirements (sharded)
- **Architecture**: `docs/architecture/` - Technical specifications (sharded)
- **Templates**: `.bmad-core/templates/` - Document templates
- **Workflows**: `.bmad-core/workflows/` - Process automation

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Wasp (React 18 + TypeScript + Vite)
- **Backend**: Wasp (Node.js + Express + Prisma)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Deployment**: Azure Static Web Apps + Azure Functions
- **Styling**: Custom CSS with Bechtle branding

### Key Components
- **Mobile-First UI**: Responsive design for tablets/phones
- **Evaluation System**: HIGH/MEDIUM/LOW ratings for use cases
- **Authentication**: Email-based with verification
- **Admin Panel**: Use case management interface

## 🚀 Deployment

### Azure Static Web Apps (Production)
```bash
# Build and deploy in one step
npm run deploy:azure

# Manual deployment
./scripts/build-production.sh
./scripts/deploy.sh
```

### Environment Setup
```bash
# Development (.env.local)
DATABASE_URL="file:./dev.db"

# Production (Azure)
DATABASE_URL="postgresql://user:password@host:5432/database"
SENDGRID_API_KEY="your-sendgrid-key"
```

## 📋 Development Commands

### Core Commands
```bash
wasp start              # Development server
wasp clean              # Clean build cache
wasp build              # Production build
wasp db migrate-dev     # Database migrations
wasp db studio          # Database management
```

### Testing & Quality
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run lint            # Code linting
npm run type-check      # TypeScript validation
```

### Database Operations
```bash
wasp db migrate-dev     # Development migrations
wasp db migrate-prod    # Production migrations
wasp db studio          # Prisma Studio
```

## 🎯 Business Context

### Purpose
Internal Bechtle platform for evaluating AI use cases in various business domains.

### Target Users
- **Bechtle Employees**: Evaluate and rate use cases
- **IT Consultants**: Assess implementation feasibility
- **Business Analysts**: Analyze adoption potential
- **Managers**: Track evaluation metrics and trends

### Key Features
- **Mobile-Optimized**: Designed for tablet/phone usage in meetings
- **Evaluation System**: Standardized HIGH/MEDIUM/LOW rating system
- **Business Areas**: IT Services, Consulting, Infrastructure, etc.
- **Maturity Tracking**: Draft → Pilot → Production lifecycle

## 📁 Project Structure

```
├── src/
│   ├── pages/          # React components for routes
│   ├── queries.ts      # Server-side read operations
│   ├── actions.ts      # Server-side write operations
│   └── components/     # Shared React components
├── lib/
│   ├── mobile-components.tsx  # Mobile-first UI library
│   └── mobile-templates.tsx   # Template components
├── main.wasp          # Wasp configuration and entities
├── scripts/           # Deployment and build scripts
├── docs/              # BMad documentation and specs
├── .bmad-core/        # BMad agent system
└── .github/chatmodes/ # VS Code agent integration
```

## 🔧 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clean and restart
wasp clean && wasp start
```

**Database Issues**
```bash
# Reset database
wasp db migrate-dev --create-only
```

**TypeScript Errors**
```bash
# Check types
npm run type-check
```

## 📖 Documentation

- [Azure Deployment Guide](docs/AZURE_DEPLOYMENT.md)
- [BMad Agent System](.bmad-core/README.md)
- [Architecture Documentation](docs/architecture/)
- [Product Requirements](docs/prd/)

## 🤝 Contributing

This project uses BMad Method for structured development:

1. **Activate appropriate agent**: `*agent dev` for code changes
2. **Follow story-driven development**: Check `docs/stories/`
3. **Update documentation**: Use BMad templates for consistency
4. **Run quality gates**: Tests, linting, type checking

---

**Bechtle Ki Use-Case Explorer** - Empowering AI adoption through structured evaluation.
