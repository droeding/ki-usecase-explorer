# Tech Stack - Ki Use-Case Explorer

## Core Framework

### Wasp Framework
- **Version**: 0.16.7
- **Language**: TypeScript + React + Node.js
- **Purpose**: Full-stack web application framework
- **Benefits**: Type-safe operations, built-in auth, database management

## Frontend Stack

### React Ecosystem
- **React**: 18.2.0 - UI library with hooks and functional components
- **TypeScript**: 5.1.0 - Type safety and developer experience
- **Vite**: 4.3.9 - Build tool and development server (Wasp managed)

### Styling & UI
- **CSS**: Custom CSS with inline styles for mobile-first design
- **Bechtle Branding**: #00B04F (primary), #004B87 (secondary)
- **Mobile Components**: Custom mobile-first component library in `lib/`
- **Responsive Design**: 320px → 768px → 1024px breakpoints

### Key Frontend Libraries
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-intersection-observer": "^9.16.0",
  "react-router-dom": "^6.26.2"
}
```

## Backend Stack

### Server Technology
- **Node.js**: Runtime environment (Wasp managed)
- **Express**: Web framework (Wasp managed)
- **Prisma ORM**: Database operations and migrations
- **TypeScript**: Server-side type safety

### Database
- **Development**: SQLite (file-based, zero config)
- **Production**: PostgreSQL (Azure Database for PostgreSQL)
- **Migrations**: Prisma managed through Wasp commands
- **Version**: Prisma 5.19.1

### Authentication
- **Provider**: Wasp Auth with email/password
- **Features**: Email verification, password reset
- **Session Management**: Wasp managed sessions
- **Production Email**: SendGrid integration

## Cloud & Deployment

### Azure Stack
- **Hosting**: Azure Static Web Apps
- **Functions**: Azure Functions for server-side operations
- **Database**: Azure Database for PostgreSQL (production)
- **CDN**: Built-in with Azure Static Web Apps

### Deployment Tools
- **Azure CLI**: Command-line deployment
- **Static Web Apps CLI**: `@azure/static-web-apps-cli`
- **Build Process**: Wasp build → Azure deployment
- **CI/CD**: Token-based deployment (NO GitHub Actions)

## Development Tools

### Code Quality
- **ESLint**: Code linting (Wasp configured)
- **TypeScript**: Type checking
- **Prettier**: Code formatting (optional)
- **Wasp CLI**: Framework-specific tooling

### Testing
- **Jest**: Unit testing framework
- **Testing Library**: React component testing
- **Coverage**: Jest coverage reporting
- **E2E**: Future implementation with Playwright

### Database Tools
- **Prisma Studio**: Database GUI (`wasp db studio`)
- **Migrations**: `wasp db migrate-dev`
- **Seeding**: Custom seeding scripts

## Security & Compliance

### Security Measures
- **HTTPS**: Enforced by Azure Static Web Apps
- **CSP**: Content Security Policy in `staticwebapp.config.json`
- **Headers**: Security headers (X-Frame-Options, X-Content-Type-Options)
- **Authentication**: Email-based with verification

### Enterprise Features
- **Token-based Deployment**: No Git integration required
- **Environment Variables**: Azure Static Web App configuration
- **Role-based Access**: Admin routes protected
- **Audit Trail**: User actions logged

## Performance & Monitoring

### Performance Features
- **Static Generation**: Wasp builds static assets
- **CDN**: Global distribution via Azure
- **Lazy Loading**: Component-level code splitting
- **Mobile Optimization**: Touch-first interface design

### Monitoring (Future)
- **Azure Application Insights**: Performance monitoring
- **Error Tracking**: Centralized error logging
- **Analytics**: User interaction tracking
- **Alerts**: Performance and error alerts

## Package Management

### Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0", 
    "react-intersection-observer": "^9.16.0",
    "react-router-dom": "^6.26.2",
    "wasp": "file:.wasp/out/sdk/wasp"
  },
  "devDependencies": {
    "@types/react": "^18.0.37",
    "prisma": "5.19.1",
    "typescript": "^5.1.0",
    "vite": "^4.3.9"
  }
}
```

### Scripts
```json
{
  "scripts": {
    "dev": "wasp start",
    "build": "wasp build", 
    "deploy:azure": "wasp build && ./scripts/deploy.sh",
    "test": "jest",
    "db:studio": "wasp db studio"
  }
}
```

## Environment Configuration

### Development Environment
- **Database**: SQLite (`dev.db`)
- **Email**: Dummy provider (console logging)
- **API**: localhost:3001
- **Client**: localhost:3000

### Production Environment
- **Database**: PostgreSQL connection string
- **Email**: SendGrid API key
- **API**: Azure Functions
- **Client**: Azure Static Web Apps domain

## File Structure

### Framework Structure
```
├── main.wasp              # Wasp configuration
├── src/
│   ├── pages/             # React page components
│   ├── queries.ts         # Server-side read operations
│   ├── actions.ts         # Server-side write operations
│   └── components/        # Shared React components
├── lib/                   # Utility libraries
├── scripts/               # Deployment scripts
└── .wasp/                 # Generated code (git ignored)
```

### Database Schema
```
User          - Authentication and profile
UseCase       - AI use case definitions
Evaluation    - User ratings and feedback  
Session       - Auth sessions (Wasp managed)
AuthIdentity  - Auth providers (Wasp managed)
```

## Integration Points

### External Services
- **SendGrid**: Email delivery for production
- **Azure Static Web Apps**: Hosting and CDN
- **Azure Database**: PostgreSQL for production
- **VS Code**: Development environment with BMad agents

### API Endpoints
- **Wasp Operations**: Type-safe client-server communication
- **Authentication**: Built-in auth endpoints
- **Static Assets**: Served by Azure CDN

---

*Tech Stack Documentation for Bechtle Ki Use-Case Explorer*
