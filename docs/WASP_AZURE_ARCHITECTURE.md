# Wasp + Azure Architecture: Ki Use-Case Explorer V3

## 🏗️ Architektur-Überblick

**Migration von**: Next.js + Azure Static Web Apps  
**Migration zu**: Wasp Full-Stack + Azure Container Apps  
**Basiert auf**: Ursprünglichen PRD und Architektur-Dokumenten

## 📋 Projekt-Kontext

### Business Requirements (aus PRD.md)
- **Ziel**: Use-Case-Bewertungsplattform für Mitarbeiter
- **Hauptfunktion**: Visualisierung und Bewertung von Use Cases → Top-Ten-Liste
- **Bewertungssystem**: Hoch (3 Punkte), Mittel (2 Punkte), Niedrig (1 Punkt)
- **Benutzerrollen**: Standard-Bewerter + Administrator
- **UI/UX**: Bechtle Corporate Design, "Experience Green" Farbpalette

### Technische Migration-Ziele
1. **Vereinfachung**: Von komplexer Next.js + Azure Functions → Single Wasp App
2. **Type-Safety**: End-to-end TypeScript mit automatischer API-Generierung
3. **Entwicklungsgeschwindigkeit**: Weniger Boilerplate, mehr Features out-of-the-box
4. **Azure Integration**: Container-basierte Deployment-Strategie

## 🏛️ Neue Wasp + Azure Architektur

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                        Azure Cloud                              │
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────┐ │
│  │   Azure CDN     │    │ Container Apps    │    │ Database    │ │
│  │                 │    │                  │    │             │ │
│  │ Static Assets   │◄───┤  Wasp App        │◄───┤ PostgreSQL  │ │
│  │ (CSS, JS, IMG)  │    │  - Frontend      │    │ Flexible    │ │
│  │                 │    │  - Backend API   │    │ Server      │ │
│  └─────────────────┘    │  - Auth          │    │             │ │
│                         │  - WebSockets    │    └─────────────┘ │
│  ┌─────────────────┐    └──────────────────┘                    │
│  │ App Service     │                                            │
│  │ Domain          │◄─── Load Balancer                          │
│  │ ki-explorer.com │                                            │
│  └─────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Technologie-Stack Mapping

| Komponente | Alte Architektur | Neue Wasp + Azure | Vorteil |
|------------|------------------|-------------------|---------|
| **Frontend** | Next.js 14 + React | Wasp (React + Vite) | Weniger Config |
| **Backend** | Azure Functions | Wasp Server (Node.js) | Type-safe APIs |
| **Database** | Azure PostgreSQL | Azure PostgreSQL | Gleich ✓ |
| **Auth** | Magic Links (custom) | Wasp Auth (Email/OAuth) | Built-in ✓ |
| **Deployment** | Static Web Apps | Container Apps | Mehr Flexibilität |
| **CDN** | Azure CDN | Azure CDN | Gleich ✓ |
| **CI/CD** | GitHub Actions | GitHub Actions | Gleich ✓ |

## 🗃️ Datenbank-Schema Migration

### Von Original Schema zu Wasp Entities

**Original PostgreSQL Schema:**
```sql
CREATE TABLE use_cases (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  business_area VARCHAR(100),
  maturity_level VARCHAR(50),
  problem_statement TEXT,
  solution_description TEXT,
  business_value TEXT,
  tech_stack TEXT,
  effort_estimation VARCHAR(50)
);

CREATE TABLE reviewers (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE evaluations (
  id UUID PRIMARY KEY,
  use_case_id UUID NOT NULL,
  reviewer_id UUID NOT NULL,
  evaluation_value VARCHAR(10) NOT NULL, -- 'HIGH', 'MEDIUM', 'LOW'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (use_case_id, reviewer_id)
);
```

**Neue Wasp Entities (schema.prisma):**
```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  createdAt   DateTime @default(now())
  
  // Relations
  evaluations Evaluation[]
}

model UseCase {
  id                   String   @id @default(cuid())
  title                String
  description          String?
  businessArea         String?
  maturityLevel        String?
  problemStatement     String?
  solutionDescription  String?
  businessValue        String?
  techStack            String?
  effortEstimation     String?
  createdAt           DateTime @default(now())
  
  // Relations
  evaluations         Evaluation[]
  
  // Computed field for total score
  @@map("use_cases")
}

model Evaluation {
  id        String          @id @default(cuid())
  value     EvaluationValue
  createdAt DateTime        @default(now())
  
  // Relations
  useCase   UseCase @relation(fields: [useCaseId], references: [id])
  useCaseId String
  user      User    @relation(fields: [userId], references: [id])
  userId    String
  
  // Constraints
  @@unique([useCaseId, userId])
  @@map("evaluations")
}

enum EvaluationValue {
  HIGH
  MEDIUM
  LOW
}
```

## 🔧 Wasp Application Configuration (basierend auf Context7)

### main.wasp Konfiguration
```wasp
app kiUsecaseExplorer {
  wasp: {
    version: "^0.16.7"
  },
  title: "Ki Use-Case Explorer",
  
  // Database Configuration
  db: {
    system: PostgreSQL
  },
  
  // Authentication Setup
  auth: {
    userEntity: User,
    methods: {
      email: {
        fromField: {
          name: "Ki Use-Case Platform",
          email: "noreply@bechtle.com"
        }
      }
    },
    onAuthFailedRedirectTo: "/login",
    onAuthSucceededRedirectTo: "/dashboard"
  },
  
  // Database Seeds
  db: {
    seeds: [
      import { seedUseCases } from "@src/db/seeds"
    ]
  }
}

// Routes and Pages
route LandingRoute { path: "/", to: LandingPage }
page LandingPage {
  component: import { LandingPage } from "@src/pages/LandingPage",
  authRequired: false
}

route LoginRoute { path: "/login", to: LoginPage }
page LoginPage {
  component: import { LoginPage } from "@src/pages/auth/Login"
}

route DashboardRoute { path: "/dashboard", to: DashboardPage }
page DashboardPage {
  component: import { DashboardPage } from "@src/pages/DashboardPage",
  authRequired: true
}

route UseCaseDetailRoute { path: "/usecase/:id", to: UseCaseDetailPage }
page UseCaseDetailPage {
  component: import { UseCaseDetailPage } from "@src/pages/UseCaseDetailPage",
  authRequired: true
}

route AdminRoute { path: "/admin", to: AdminPage }
page AdminPage {
  component: import { AdminPage } from "@src/pages/AdminPage",
  authRequired: true
}

// Server Operations - Queries (Read Operations)
query getUseCases {
  fn: import { getUseCases } from "@src/queries",
  entities: [UseCase, Evaluation]
}

query getUseCaseById {
  fn: import { getUseCaseById } from "@src/queries",
  entities: [UseCase, Evaluation]
}

query getTopUseCases {
  fn: import { getTopUseCases } from "@src/queries",
  entities: [UseCase, Evaluation, User]
}

query getUserEvaluations {
  fn: import { getUserEvaluations } from "@src/queries",
  entities: [Evaluation, UseCase]
}

// Server Operations - Actions (Write Operations)
action submitEvaluation {
  fn: import { submitEvaluation } from "@src/actions",
  entities: [Evaluation, User, UseCase]
}

action updateUseCase {
  fn: import { updateUseCase } from "@src/actions", 
  entities: [UseCase]
}

action deleteEvaluation {
  fn: import { deleteEvaluation } from "@src/actions",
  entities: [Evaluation]
}
```

### Server-Side Implementation Examples

#### Queries Implementation (src/queries.js)
```typescript
import { type GetUseCases, type GetUseCaseById, type GetTopUseCases } from 'wasp/server/operations'
import { type UseCase, type Evaluation, type User } from 'wasp/entities'

// Get all use cases with evaluation counts
export const getUseCases: GetUseCases<void, UseCase[]> = async (args, context) => {
  return context.entities.UseCase.findMany({
    include: {
      evaluations: {
        select: {
          value: true,
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      },
      _count: {
        select: {
          evaluations: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// Get specific use case with evaluations
export const getUseCaseById: GetUseCaseById<{ id: string }, UseCase | null> = async (args, context) => {
  return context.entities.UseCase.findUnique({
    where: { id: args.id },
    include: {
      evaluations: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      }
    }
  })
}

// Get top 10 use cases based on evaluation scores
export const getTopUseCases: GetTopUseCases<void, Array<UseCase & { totalScore: number }>> = async (args, context) => {
  const useCasesWithScores = await context.entities.UseCase.findMany({
    include: {
      evaluations: true,
      _count: {
        select: {
          evaluations: true
        }
      }
    }
  })

  // Calculate scores: HIGH = 3, MEDIUM = 2, LOW = 1
  const scoredUseCases = useCasesWithScores.map(useCase => {
    const totalScore = useCase.evaluations.reduce((sum, evaluation) => {
      const score = evaluation.value === 'HIGH' ? 3 : 
                   evaluation.value === 'MEDIUM' ? 2 : 1
      return sum + score
    }, 0)
    
    return {
      ...useCase,
      totalScore
    }
  })

  // Sort by total score descending and return top 10
  return scoredUseCases
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10)
}

// Get current user's evaluations
export const getUserEvaluations = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "User not authenticated")
  }

  return context.entities.Evaluation.findMany({
    where: {
      userId: context.user.id
    },
    include: {
      useCase: {
        select: {
          id: true,
          title: true,
          businessArea: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
```

#### Actions Implementation (src/actions.js)
```typescript
import { type SubmitEvaluation, type UpdateUseCase } from 'wasp/server/operations'
import { type Evaluation, type UseCase } from 'wasp/entities'
import { HttpError } from 'wasp/server'

// Submit or update user evaluation
export const submitEvaluation: SubmitEvaluation<
  { useCaseId: string; value: 'HIGH' | 'MEDIUM' | 'LOW' },
  Evaluation
> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "User must be authenticated to submit evaluation")
  }

  // Check if user already evaluated this use case
  const existingEvaluation = await context.entities.Evaluation.findUnique({
    where: {
      useCaseId_userId: {
        useCaseId: args.useCaseId,
        userId: context.user.id
      }
    }
  })

  if (existingEvaluation) {
    // Update existing evaluation
    return context.entities.Evaluation.update({
      where: { id: existingEvaluation.id },
      data: { value: args.value }
    })
  } else {
    // Create new evaluation
    return context.entities.Evaluation.create({
      data: {
        value: args.value,
        useCaseId: args.useCaseId,
        userId: context.user.id
      }
    })
  }
}

// Admin: Update use case details
export const updateUseCase: UpdateUseCase<
  { id: string; data: Partial<UseCase> },
  UseCase
> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Authentication required")
  }

  // TODO: Add admin role check
  // if (!context.user.isAdmin) {
  //   throw new HttpError(403, "Admin access required")
  // }

  return context.entities.UseCase.update({
    where: { id: args.id },
    data: args.data
  })
}

// Delete user's evaluation
export const deleteEvaluation = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Authentication required")
  }

  const evaluation = await context.entities.Evaluation.findUnique({
    where: { id: args.evaluationId }
  })

  if (!evaluation) {
    throw new HttpError(404, "Evaluation not found")
  }

  if (evaluation.userId !== context.user.id) {
    throw new HttpError(403, "Cannot delete another user's evaluation")
  }

  return context.entities.Evaluation.delete({
    where: { id: args.evaluationId }
  })
}
```

### Database Seeds (src/db/seeds.js)
```typescript
import { type UseCase } from 'wasp/entities'

export const seedUseCases = async (prismaClient) => {
  const sampleUseCases: Partial<UseCase>[] = [
    {
      title: "KI-basierte Kundenservice-Automatisierung",
      description: "Automatisierung von Standard-Kundenanfragen durch intelligente Chatbots",
      businessArea: "Customer Service",
      maturityLevel: "Proof of Concept",
      problemStatement: "Hohe Anzahl repetitiver Kundenanfragen belastet Support-Team",
      solutionDescription: "KI-Chatbot mit NLP für automatische Anfragebearbeitung",
      businessValue: "30% Reduktion der Support-Kosten, 24/7 Verfügbarkeit",
      techStack: "Azure Bot Service, LUIS, Power Virtual Agents",
      effortEstimation: "3-6 Monate"
    },
    {
      title: "Predictive Maintenance für IT-Infrastruktur", 
      description: "Vorhersage von Hardware-Ausfällen durch ML-Algorithmen",
      businessArea: "IT Operations",
      maturityLevel: "Konzept",
      problemStatement: "Ungeplante Ausfälle führen zu hohen Kosten und Ausfallzeiten",
      solutionDescription: "ML-Modelle analysieren Telemetrie-Daten für Ausfallprognosen",
      businessValue: "40% Reduktion ungeplanter Ausfälle, optimierte Wartungsplanung",
      techStack: "Azure ML, IoT Hub, Time Series Insights",
      effortEstimation: "6-12 Monate"
    },
    {
      title: "Intelligente Dokumentenklassifizierung",
      description: "Automatische Kategorisierung und Extraktion von Geschäftsdokumenten",
      businessArea: "Document Management",
      maturityLevel: "Pilot",
      problemStatement: "Manuelle Dokumentenverarbeitung ist zeitaufwändig und fehleranfällig",
      solutionDescription: "KI-basierte OCR und Klassifizierung für automatische Verarbeitung",
      businessValue: "70% Zeitersparnis, verbesserte Compliance und Suchbarkeit",
      techStack: "Azure Form Recognizer, Cognitive Services, Power Automate",
      effortEstimation: "2-4 Monate"
    }
  ]

  // Create use cases if they don't exist
  for (const useCaseData of sampleUseCases) {
    const existingUseCase = await prismaClient.useCase.findFirst({
      where: { title: useCaseData.title }
    })

    if (!existingUseCase) {
      await prismaClient.useCase.create({
        data: useCaseData
      })
    }
  }
  
  console.log('✅ Use cases seeded successfully')
}
```

## 🚀 Azure Deployment-Strategie

### Container Apps Deployment
```yaml
# .github/workflows/deploy-azure.yml
name: Deploy to Azure Container Apps

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Build Wasp App
        run: |
          wasp build
          docker build -t ki-usecase-explorer .
      
      - name: Deploy to Azure Container Apps
        uses: azure/container-apps-deploy-action@v1
        with:
          app-name: ki-usecase-explorer
          resource-group: rg-ki-explorer
          container-image: ki-usecase-explorer:latest
          environment-variables: |
            DATABASE_URL=${{ secrets.DATABASE_URL }}
            WASP_SERVER_URL=${{ secrets.WASP_SERVER_URL }}
            WASP_WEB_CLIENT_URL=${{ secrets.WASP_WEB_CLIENT_URL }}
```

### Infrastructure as Code (Bicep)
```bicep
// azure-infrastructure.bicep
param location string = 'West Europe'
param appName string = 'ki-usecase-explorer'

// PostgreSQL Flexible Server
resource database 'Microsoft.DBforPostgreSQL/flexibleServers@2021-06-01' = {
  name: '${appName}-db'
  location: location
  properties: {
    administratorLogin: 'postgres'
    version: '14'
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
    }
  }
}

// Container Apps Environment
resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2022-03-01' = {
  name: '${appName}-env'
  location: location
  properties: {
    daprAIConnectionString: null
  }
}

// Container App
resource containerApp 'Microsoft.App/containerApps@2022-03-01' = {
  name: appName
  location: location
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
      }
      secrets: [
        {
          name: 'database-url'
          value: 'postgresql://postgres:${dbPassword}@${database.properties.fullyQualifiedDomainName}:5432/${appName}'
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'main'
          image: 'ki-usecase-explorer:latest'
          env: [
            {
              name: 'DATABASE_URL'
              secretRef: 'database-url'
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
      }
    }
  }
}
```

## 🎯 Migration Implementation Plan

### Phase 1: Core Infrastructure (Week 1)
- [x] ✅ Wasp application initialized
- [ ] Database schema migrated to Wasp entities
- [ ] Basic authentication setup
- [ ] Azure Container Apps infrastructure

### Phase 2: Feature Implementation (Week 2-3)
- [ ] Use Case listing page (Dashboard)
- [ ] Use Case detail view  
- [ ] Evaluation submission system
- [ ] Admin dashboard with Top-10 calculation

### Phase 3: UI/UX Implementation (Week 4)
- [ ] Bechtle Corporate Design
- [ ] "Experience Green" color scheme
- [ ] Responsive design
- [ ] Progressive Web App features

### Phase 4: Testing & Deployment (Week 5)
- [ ] Unit and integration tests
- [ ] E2E testing with Playwright
- [ ] Performance optimization
- [ ] Production deployment

## 🔒 Security & Compliance

### Authentication Strategy
- **Wasp Email Auth**: Magic links für benutzerfreundliche Anmeldung
- **Azure AD Integration**: Optional für Enterprise SSO
- **Role-based Access**: Standard user vs. Admin permissions

### Data Protection
- **GDPR Compliance**: User data anonymization
- **Azure Security**: Network security groups, private endpoints
- **Database Encryption**: At rest and in transit

## 📊 Monitoring & Analytics

### Application Monitoring
- **Azure Application Insights**: Performance and error tracking
- **Wasp Telemetry**: Built-in logging and metrics
- **Custom Dashboards**: Use case evaluation analytics

### Business Metrics
- **Evaluation Completion Rate**: User engagement tracking
- **Top Use Cases Trends**: Popularity over time
- **User Activity**: Login and evaluation patterns

---

**Architect**: Winston  
**Status**: Ready for Implementation  
**Next Action**: Begin Phase 1 - Core Infrastructure Setup