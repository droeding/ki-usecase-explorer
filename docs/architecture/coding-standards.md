# Coding Standards - Ki Use-Case Explorer

## Wasp Framework Standards

### File Organization
- **Main Configuration**: `main.wasp` - Central app configuration
- **Queries**: `src/queries.ts` - Server-side read operations
- **Actions**: `src/actions.ts` - Server-side write operations  
- **Pages**: `src/pages/` - React components for routes
- **Components**: `src/components/` - Shared React components
- **Utils**: `lib/` - Utility functions and mobile components

### Wasp Operations Pattern
```typescript
// Queries (src/queries.ts) - Read operations
export const getUseCases = async (args: any, context: any) => {
  return context.entities.UseCase.findMany()
}

// Actions (src/actions.ts) - Write operations  
export const submitEvaluation = async (args: any, context: any) => {
  return context.entities.Evaluation.create({ data: args })
}
```

### TypeScript Standards
- **Operation Parameters**: Use `(args: any, context: any)` for Wasp operations
- **Strict Typing**: Use explicit types except for Wasp operation signatures
- **Error Handling**: Use `HttpError` from 'wasp/server' for API errors
- **Context Validation**: Always check `context.user` for authentication

### Import Patterns
```typescript
// 1. Wasp imports first
import { useQuery } from 'wasp/client/operations'
import { getUseCases } from 'wasp/client/operations'
import { HttpError } from 'wasp/server'

// 2. External libraries
import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

// 3. Internal utilities
import { cn } from '@/lib/utils'
import { MobileUseCaseCard } from '@/lib/mobile-components'
```

## React Component Standards

### Component Structure
```tsx
// Named export for Wasp pages
export const DashboardPage = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('')
  
  // Wasp queries
  const { data: useCases, isLoading } = useQuery(getUseCases)
  
  // Custom hooks
  const isMobile = useMobileDetection()
  
  // Render
  return (
    <div style={{ /* inline styles for mobile-first */ }}>
      {/* Component content */}
    </div>
  )
}
```

### Mobile-First Design
- **Responsive breakpoints**: 320px (mobile) → 768px (tablet) → 1024px (desktop)
- **Touch targets**: Minimum 48px for interactive elements
- **Viewport handling**: Use `vh` units and orientation change handlers
- **Inline styles**: Preferred for component-specific styling

## Styling Standards

### Bechtle Brand Colors
```css
:root {
  --bechtle-primary: #00B04F;    /* Bechtle Green */
  --bechtle-secondary: #004B87;  /* Bechtle Blue */
  --bechtle-gray: #6b7280;       /* Neutral Gray */
}
```

### CSS Approach
- **Inline styles**: Component-specific styling
- **CSS variables**: Brand colors and spacing
- **Mobile-first**: All styles start with mobile, scale up
- **Performance**: Minimal CSS bundle, prefer inline styles

### Component Styling Pattern
```tsx
const cardStyle = {
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '16px',
  transition: 'all 150ms ease',
  cursor: 'pointer'
}
```

## Database Standards

### Entity Design
```prisma
// Wasp entity definition in main.wasp
entity UseCase {=psl
  id               Int          @id @default(autoincrement())
  title            String
  description      String
  businessArea     String
  maturityLevel    String       // Draft, Pilot, Production
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
  evaluations      Evaluation[]
psl=}
```

### Query Patterns
```typescript
// Include related data
const useCase = await context.entities.UseCase.findUnique({
  where: { id: args.id },
  include: {
    evaluations: {
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    }
  }
})
```

## Error Handling

### Server-Side Errors
```typescript
export const getUseCaseById = async (args: any, context: any) => {
  const { id } = args
  
  if (!id) {
    throw new HttpError(400, 'Use case ID is required')
  }
  
  if (!context.user) {
    throw new HttpError(401, 'User must be authenticated')
  }
  
  const useCase = await context.entities.UseCase.findUnique({
    where: { id }
  })
  
  if (!useCase) {
    throw new HttpError(404, 'Use case not found')
  }
  
  return useCase
}
```

### Client-Side Error Handling
```tsx
const { data, isLoading, error } = useQuery(getUseCases)

if (error) {
  return <div>Error loading use cases: {error.message}</div>
}
```

## Testing Standards

### Test Organization
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: Wasp operation tests
- **E2E Tests**: Critical user flows

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1'
  }
}
```

## Security Standards

### Authentication
- **Route Protection**: Use `authRequired: true` in page definitions
- **Context Validation**: Always validate `context.user` in operations
- **Role-Based Access**: Check user roles for admin operations

### Data Validation
```typescript
export const submitEvaluation = async (args: any, context: any) => {
  if (!context.user) {
    throw new HttpError(401, "User must be authenticated")
  }
  
  const { useCaseId, value } = args
  
  if (!['HIGH', 'MEDIUM', 'LOW'].includes(value)) {
    throw new HttpError(400, "Invalid evaluation value")
  }
  
  // Continue with operation...
}
```

## Performance Standards

### Optimization Techniques
- **Lazy Loading**: Use React.lazy() for route components
- **Memoization**: useMemo/useCallback for expensive operations
- **Virtual Scrolling**: For large use case lists
- **Image Optimization**: Use optimized formats and sizes

### Mobile Performance
- **Bundle Size**: Minimize JavaScript bundle
- **Loading States**: Show loading indicators for all async operations
- **Offline Handling**: Graceful degradation when offline

---

*Coding Standards for Bechtle Ki Use-Case Explorer - Wasp Framework*
