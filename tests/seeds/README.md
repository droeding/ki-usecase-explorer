# 🌱 Database Seeds Documentation

## Overview
Comprehensive database seeding system for the Ki Use-Case Explorer, providing realistic test data for development, testing, and staging environments.

## 🏗️ Architecture

### Static Fixtures (`tests/fixtures/`)
Predefined, consistent data for reliable testing scenarios:
- **users.ts** - 5 predefined users with different roles (admin, analyst, consultant, manager, developer)
- **usecases.ts** - 6 realistic AI use cases covering various business areas and maturity levels
- **evaluations.ts** - 15 predefined evaluations showing realistic rating patterns

### Dynamic Factories (`tests/factories/`)
Generate realistic data on-demand with customizable parameters:
- **userFactory.ts** - Creates users with realistic German names, corporate emails, varied departments
- **useCaseFactory.ts** - Generates AI use cases with business-relevant templates and solutions
- **evaluationFactory.ts** - Creates evaluations with realistic patterns based on maturity levels

### Database Seeder (`tests/seeds/`)
Main orchestrator supporting different environments and seeding strategies:
- **DatabaseSeeder.ts** - Core seeding logic with flexible options
- **developmentSeed.ts** - Rich dataset for development (20 users, 15 use cases, 70% coverage)
- **testSeed.ts** - Controlled dataset for testing (fixtures only)

## 🚀 Usage

### Quick Commands

```bash
# Development seeding (rich dataset)
npm run db:seed

# Test seeding (controlled dataset)
npm run db:seed:test

# Staging seeding (production-like volume)
npm run db:seed:staging
```

### Manual Seeding

```typescript
import { DatabaseSeeder } from './tests/seeds/DatabaseSeeder';

const seeder = new DatabaseSeeder();

// Custom seeding options
await seeder.seed({
  environment: 'development',
  clearData: true,
  useFixtures: true,
  useFactories: true,
  userCount: 30,
  useCaseCount: 20,
  evaluationCoverage: 0.8
});
```

## 📊 Data Profiles

### Development Profile
- **Users**: 25 total (5 fixtures + 20 generated)
- **Use Cases**: 21 total (6 fixtures + 15 generated)
- **Evaluations**: ~350 (70% coverage with realistic patterns)
- **Focus**: Rich, varied data for UI development and manual testing

### Test Profile
- **Users**: 5 (fixtures only)
- **Use Cases**: 6 (fixtures only)
- **Evaluations**: 15 (fixtures only)
- **Focus**: Consistent, predictable data for automated testing

### Staging Profile
- **Users**: 55 total (5 fixtures + 50 generated)
- **Use Cases**: 36 total (6 fixtures + 30 generated)
- **Evaluations**: ~1200 (60% coverage)
- **Focus**: Production-like volume for performance testing

## 🎯 Use Case Categories

Our seeded use cases cover realistic AI scenarios:

### Customer Service
- Automated customer inquiry classification
- Intelligent chatbot for technical support
- Sentiment analysis for feedback processing

### IT Operations
- Predictive infrastructure monitoring
- Automated incident management
- Performance anomaly detection

### Software Development
- Automated code review assistance
- Bug prediction and classification
- Development productivity analytics

### Business Intelligence
- Intelligent document management
- Automated report generation
- Data quality assessment

## 👥 User Personas

Seeded users represent typical Bechtle stakeholders:

- **Admin User** - System administrator with full access
- **Business Analyst** - Evaluates use cases from business perspective
- **IT Consultant** - Technical feasibility assessment
- **Project Manager** - Resource and timeline planning
- **Software Developer** - Implementation and technical details

## ⭐ Evaluation Patterns

Realistic evaluation distributions based on maturity levels:

- **Production**: 60% HIGH, 30% MEDIUM, 10% LOW
- **Pilot**: 40% HIGH, 40% MEDIUM, 20% LOW
- **Prototype**: 30% HIGH, 40% MEDIUM, 30% LOW
- **Concept**: 20% HIGH, 50% MEDIUM, 30% LOW
- **Research**: 25% HIGH, 35% MEDIUM, 40% LOW

## 🔧 Integration with Tests

### Integration Tests
```typescript
import { seedTest } from '../seeds/testSeed';

beforeAll(async () => {
  await seedTest();
});
```

### Factory Usage in Tests
```typescript
import { createUser, createUseCase } from '../factories';

test('should handle custom user scenarios', () => {
  const testUser = createUser({
    email: 'test@bechtle.com',
    name: 'Test User'
  });
  // ... test logic
});
```

## 📈 Performance Characteristics

- **Test Seeding**: ~500ms (small, consistent dataset)
- **Development Seeding**: ~2-3s (rich dataset with relationships)
- **Staging Seeding**: ~8-12s (large dataset with complex relationships)

## 🛠️ Customization

### Adding New Fixtures
1. Add data to appropriate fixture file
2. Update utility functions for easy access
3. Test with `npm run db:seed:test`

### Extending Factories
1. Add new generation logic to factory files
2. Include business-relevant patterns and constraints
3. Test with custom seeding options

### Environment-Specific Seeds
1. Create new seed script in `tests/seeds/`
2. Configure appropriate options for your environment
3. Add npm script for easy access

## 🔍 Verification

After seeding, verify data quality:

```bash
# Open database browser
npm run db:studio

# Check data via queries
npx wasp start
# Then visit /admin for data overview
```

## 🚨 Best Practices

1. **Clear before seeding** in development/testing environments
2. **Use fixtures for tests** for consistency
3. **Use factories for development** for variety
4. **Monitor seeding performance** for large datasets
5. **Version control fixture data** for reproducibility

---

**Last Updated**: 2. Juli 2025  
**Maintained by**: Development Team  
**Review Schedule**: Every sprint review
