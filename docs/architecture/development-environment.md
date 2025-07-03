# Development Environment Setup

## Prerequisites

### Required Software
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Wasp CLI**: Version 0.16.7
- **Azure CLI**: For deployment (optional for development)

### Installation Steps

#### 1. Install Node.js
```bash
# macOS (using Homebrew)
brew install node@18

# Verify installation
node --version
npm --version
```

#### 2. Install Wasp CLI
```bash
# Install Wasp CLI globally
curl -sSL https://get.wasp-lang.dev/installer.sh | sh

# Verify installation
wasp version
```

#### 3. Install Azure CLI (for deployment)
```bash
# macOS (using Homebrew)
brew install azure-cli

# Verify installation
az --version
```

## Project Setup

### 1. Clone and Initialize
```bash
# Navigate to project directory
cd /Users/daniel.roeding/_Entwicklung/_ai_projekte/demos/ki-usecase-explorer-v3

# Install dependencies
npm install

# Initialize Wasp project (if needed)
wasp clean
```

### 2. Database Setup
```bash
# Create and apply database migrations
wasp db migrate-dev

# Open Prisma Studio (optional)
wasp db studio
```

### 3. Environment Configuration
Create `.env.local` file in project root:
```env
# Development settings
NODE_ENV=development

# Database (SQLite for development - no config needed)
# DATABASE_URL is automatically managed by Wasp

# Email (Dummy provider for development)
# No SendGrid configuration needed for development
```

## Development Workflow

### Starting Development Server
```bash
# Start both client and server
wasp start

# Access application
# Client: http://localhost:3000
# Server: http://localhost:3001
# Database: SQLite file in .wasp/out/db/dev.db
```

### Code Organization

#### Wasp Files
- `main.wasp` - Application configuration and entities
- `src/pages/` - React page components
- `src/queries.ts` - Server-side read operations
- `src/actions.ts` - Server-side write operations

#### Custom Libraries
- `lib/mobile-components.tsx` - Mobile-first UI components
- `lib/types.ts` - TypeScript type definitions
- `lib/utils.ts` - Utility functions
- `lib/api.ts` - API helper functions

### Database Operations

#### Migrations
```bash
# Create new migration after schema changes
wasp db migrate-dev

# Apply migrations in production
wasp db migrate-prod

# Reset database (development only)
wasp clean
wasp db migrate-dev
```

#### Database Studio
```bash
# Open Prisma Studio
wasp db studio

# Access at http://localhost:5555
```

## IDE Configuration

### VS Code Setup
Required extensions:
- **Wasp Language Support** (if available)
- **TypeScript and JavaScript Language Features**
- **Prisma** (for database schema)
- **ES7+ React/Redux/React-Native snippets**

### BMad Agent Integration
Activate specialized agents for different tasks:
```bash
*agent dev        # Full Stack Developer (James)
*agent architect  # System Architect (Winston)  
*agent qa         # QA Architect (Quinn)
*agent ux-expert  # UX Expert (Sally)
```

### TypeScript Configuration
Wasp manages TypeScript configuration automatically. Custom types in `lib/types.ts`:
```typescript
export interface UseCase {
  id: number
  title: string
  description: string
  businessArea: string
  maturityLevel: string
}

export interface Evaluation {
  id: number
  rating: 'HIGH' | 'MEDIUM' | 'LOW'
  useCaseId: number
  userId: number
}
```

## Testing Setup

### Unit Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure
```
src/
├── __tests__/          # Test files
├── components/
│   └── __tests__/      # Component tests
└── pages/
    └── __tests__/      # Page tests
```

## Build Process

### Development Build
```bash
# Clean previous builds
wasp clean

# Start development server
wasp start
```

### Production Build
```bash
# Build for production
wasp build

# Or use automated build script
./scripts/build-production.sh
```

### Build Outputs
```
.wasp/out/
├── web-app/           # Client application
├── server/            # Server application  
├── db/                # Database files
└── sdk/               # Generated SDK
```

## Common Development Tasks

### Adding New Pages
1. Create React component in `src/pages/`
2. Add route in `main.wasp`
3. Update navigation if needed

### Adding Database Fields
1. Update entity in `main.wasp`
2. Run `wasp db migrate-dev`
3. Update TypeScript types

### Adding Server Operations
1. Add query/action in `src/queries.ts` or `src/actions.ts`
2. Import and use in components with `useQuery` or `useAction`

## Debugging

### Client-Side Debugging
- Use browser DevTools
- React DevTools extension
- Console logging for development

### Server-Side Debugging
- Check terminal output from `wasp start`
- Add console.log in operations
- Use Prisma Studio for database inspection

### Database Debugging
```bash
# View database schema
wasp db studio

# Check migration status
wasp db migrate-dev --create-only

# Reset database if corrupted
wasp clean
wasp db migrate-dev
```

## Mobile Development

### Testing on Mobile
- Use browser DevTools device simulation
- Test on actual mobile devices via network IP
- Chrome DevTools mobile debugging

### Mobile-First Development
- Use custom mobile components from `lib/mobile-components.tsx`
- Follow 320px → 768px → 1024px breakpoints
- Touch-first interface design

## Performance Optimization

### Development Performance
- Use React DevTools Profiler
- Monitor bundle size with build output
- Lazy load components when needed

### Database Performance
- Use Prisma query optimization
- Add database indexes for frequently queried fields
- Monitor query performance in development

---

*Development Environment Documentation for Bechtle Ki Use-Case Explorer*
