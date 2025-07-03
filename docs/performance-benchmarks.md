# 📊 Performance Benchmarks & Standards

## Performance Target Matrix

| Component | Metric | Target | Warning | Critical | Measurement |
|-----------|--------|---------|---------|----------|-------------|
| **Frontend** | First Contentful Paint | < 1.5s | 2s | 3s | Lighthouse |
| | Time to Interactive | < 3s | 4s | 5s | Lighthouse |
| | Bundle Size | < 500KB | 750KB | 1MB | Webpack Bundle Analyzer |
| **API** | Response Time | < 500ms | 1s | 2s | Application Insights |
| | Throughput | > 100 req/s | 50-100 req/s | < 50 req/s | Load Testing |
| | Error Rate | < 1% | 2-5% | > 5% | Azure Monitoring |
| **Database** | Query Time | < 200ms | 500ms | 1s | Prisma Logs |
| | Connection Pool | < 70% | 80% | 90% | PostgreSQL Metrics |
| | Slow Queries | 0 | 1-2 | > 3 | Query Analysis |
| **Mobile** | Touch Response | < 100ms | 150ms | 200ms | User Testing |
| | Scroll Performance | 60 FPS | 45 FPS | 30 FPS | Browser DevTools |
| | Memory Usage | < 100MB | 150MB | 200MB | Memory Profiler |

---

## 🎯 Frontend Performance Standards

### Core Web Vitals
```javascript
// Performance Measurement
const performanceObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime);
      // Target: < 2.5s
    }
    if (entry.entryType === 'first-input') {
      console.log('FID:', entry.processingStart - entry.startTime);
      // Target: < 100ms
    }
  });
});

// Cumulative Layout Shift
let cls = 0;
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      cls += entry.value;
    }
  }
  // Target: < 0.1
}).observe({entryTypes: ['layout-shift']});
```

### Wasp-Specific Optimizations
- **Client Chunks:** Max 3 chunks für optimal loading
- **Prefetching:** Wasp operations pre-loaded on hover
- **Code Splitting:** Dynamic imports für non-critical components
- **Tree Shaking:** Unused dependencies removed in build

### Bundle Size Optimization
```javascript
// Webpack Bundle Analysis Target
{
  "vendor": "< 150KB gzipped",     // React, Wasp core
  "main": "< 200KB gzipped",       // Application code
  "chunks": "< 150KB gzipped",     // Split chunks
  "total": "< 500KB gzipped"       // Complete bundle
}
```

---

## ⚡ API Performance Standards

### Azure Functions Performance
```typescript
// Performance Monitoring in Azure Functions
export default async function handler(req: Request, res: Response) {
  const startTime = Date.now();
  
  try {
    // Business logic here
    const result = await processRequest(req);
    
    const duration = Date.now() - startTime;
    
    // Log performance metrics
    console.log(`Duration: ${duration}ms`);
    
    // Alert if slow
    if (duration > 1000) {
      console.warn(`Slow request: ${duration}ms`);
    }
    
    return res.json(result);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Error after ${duration}ms:`, error);
    throw error;
  }
}
```

### Database Performance Targets
- **Use Case Queries:** < 100ms (häufigste Operation)
- **Evaluation Inserts:** < 150ms
- **Aggregation Queries:** < 300ms
- **Migration Time:** < 5 minutes

### Caching Strategy
```typescript
// Wasp Query Caching
export const getUseCases: GetUseCases<void, UseCase[]> = async (args, context) => {
  // Cache key based on user context
  const cacheKey = `usecases:${context.user?.id || 'anonymous'}`;
  
  // Check cache first (Redis or Memory)
  const cached = await getFromCache(cacheKey);
  if (cached) return cached;
  
  // Fetch from database
  const useCases = await context.entities.UseCase.findMany({
    orderBy: { title: 'asc' }
  });
  
  // Cache for 5 minutes
  await setCache(cacheKey, useCases, 300);
  
  return useCases;
};
```

---

## 📱 Mobile Performance Standards

### Touch & Interaction
- **Touch Target Size:** Minimum 44×44px (Apple HIG)
- **Touch Response Time:** < 100ms visual feedback
- **Gesture Recognition:** < 50ms for scroll/swipe
- **Animation Frame Rate:** 60 FPS maintained

### Network Optimization
```typescript
// Progressive Loading Strategy
const useProgressiveData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load critical data first
    loadCriticalData().then(critical => {
      setData(critical);
      setLoading(false);
      
      // Load remaining data in background
      loadRemainingData().then(remaining => {
        setData(prev => [...prev, ...remaining]);
      });
    });
  }, []);
  
  return { data, loading };
};
```

### Memory Management
- **Component Cleanup:** useEffect cleanup functions
- **Event Listener Removal:** Prevent memory leaks
- **Image Optimization:** WebP format, lazy loading
- **Data Pagination:** Limit large datasets

---

## 🗄️ Database Performance Standards

### Query Optimization
```sql
-- Use Case Listing (Target: < 100ms)
EXPLAIN ANALYZE 
SELECT id, title, description, business_area, maturity_level 
FROM use_cases 
ORDER BY title ASC;

-- Evaluation Aggregation (Target: < 300ms)
EXPLAIN ANALYZE
SELECT 
  uc.id,
  uc.title,
  COUNT(e.id) as evaluation_count,
  AVG(CASE 
    WHEN e.evaluation_value = 'HIGH' THEN 3
    WHEN e.evaluation_value = 'MEDIUM' THEN 2  
    WHEN e.evaluation_value = 'LOW' THEN 1
  END) as average_score
FROM use_cases uc
LEFT JOIN evaluations e ON uc.id = e.use_case_id
GROUP BY uc.id, uc.title
ORDER BY average_score DESC;
```

### Index Strategy
```sql
-- Essential Indexes for Performance
CREATE INDEX idx_evaluations_use_case_id ON evaluations(use_case_id);
CREATE INDEX idx_evaluations_reviewer_id ON evaluations(reviewer_id);
CREATE INDEX idx_use_cases_business_area ON use_cases(business_area);
CREATE INDEX idx_use_cases_maturity_level ON use_cases(maturity_level);

-- Composite Index for Common Queries
CREATE INDEX idx_evaluations_composite ON evaluations(use_case_id, reviewer_id, evaluation_value);
```

### Connection Pool Optimization
```typescript
// Prisma Connection Pool Configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['warn', 'error'],
  // Connection pool settings
  __internal: {
    engine: {
      connectTimeout: 10000,      // 10 seconds
      poolTimeout: 10000,         // 10 seconds  
      maxAllocatedConnections: 20, // Max connections
    }
  }
});
```

---

## 🧪 Performance Testing Strategy

### Load Testing Scenarios
```javascript
// Artillery.js Load Testing Configuration
module.exports = {
  config: {
    target: 'https://your-app.azurestaticapps.net',
    phases: [
      { duration: 60, arrivalRate: 10 },   // Warm up
      { duration: 120, arrivalRate: 20 },  // Normal load
      { duration: 60, arrivalRate: 50 },   // Peak load
      { duration: 60, arrivalRate: 100 },  // Stress test
    ]
  },
  scenarios: [
    {
      name: 'Browse use cases',
      weight: 70,
      flow: [
        { get: { url: '/' }},
        { get: { url: '/api/usecases' }},
        { think: 3 },
        { get: { url: '/api/usecases/{{$randomInt(1,50)}}' }}
      ]
    },
    {
      name: 'Submit evaluation', 
      weight: 30,
      flow: [
        { post: { 
            url: '/api/evaluations',
            json: {
              useCaseId: '{{$randomInt(1,50)}}',
              reviewerId: '{{$randomUUID()}}',
              evaluationValue: '{{$randomChoice(["HIGH","MEDIUM","LOW"])}}'
            }
          }
        }
      ]
    }
  ]
};
```

### Performance Regression Testing
```typescript
// Automated Performance Testing
describe('Performance Regression Tests', () => {
  beforeAll(async () => {
    // Setup test data
    await seedDatabase();
  });
  
  test('Use case listing performance', async () => {
    const start = Date.now();
    const response = await fetch('/api/usecases');
    const duration = Date.now() - start;
    
    expect(response.ok).toBe(true);
    expect(duration).toBeLessThan(500); // 500ms target
  });
  
  test('Evaluation submission performance', async () => {
    const start = Date.now();
    const response = await fetch('/api/evaluations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        useCaseId: '1',
        reviewerId: 'test-reviewer',
        evaluationValue: 'HIGH'
      })
    });
    const duration = Date.now() - start;
    
    expect(response.ok).toBe(true);
    expect(duration).toBeLessThan(300); // 300ms target
  });
});
```

---

## 📊 Monitoring & Alerting

### Real-User Monitoring (RUM)
```javascript
// Performance Tracking Implementation
class PerformanceTracker {
  static trackPageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paintTiming = performance.getEntriesByType('paint');
      
      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paintTiming.find(p => p.name === 'first-paint')?.startTime,
        firstContentfulPaint: paintTiming.find(p => p.name === 'first-contentful-paint')?.startTime,
      };
      
      // Send to analytics
      this.sendMetrics('page-load', metrics);
    });
  }
  
  static trackApiCall(url, startTime, endTime, success) {
    const duration = endTime - startTime;
    
    this.sendMetrics('api-call', {
      url,
      duration,
      success,
      timestamp: Date.now()
    });
    
    // Alert on slow calls
    if (duration > 1000) {
      console.warn(`Slow API call: ${url} took ${duration}ms`);
    }
  }
}
```

### Azure Application Insights Integration
```typescript
// Custom Performance Tracking
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env.NEXT_PUBLIC_APPINSIGHTS_KEY,
    enableAutoRouteTracking: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true
  }
});

appInsights.loadAppInsights();

// Track custom performance metrics
export const trackPerformance = (name: string, value: number, properties?: any) => {
  appInsights.trackMetric({ name, average: value }, properties);
};

// Track slow operations
export const trackSlowOperation = (operation: string, duration: number) => {
  if (duration > 1000) {
    appInsights.trackEvent({
      name: 'SlowOperation',
      properties: { operation, duration }
    });
  }
};
```

---

## 🚨 Performance Alerting Rules

### Critical Alerts (Immediate Response)
- **API Response Time** > 2 seconds (5 consecutive measurements)
- **Error Rate** > 5% (over 5-minute window)
- **Database Connection Pool** > 90% utilization
- **Memory Usage** > 200MB (mobile devices)

### Warning Alerts (Monitor & Investigate)
- **Frontend Load Time** > 3 seconds
- **API Response Time** > 1 second  
- **Database Query Time** > 500ms
- **Bundle Size** > 750KB

### Alert Actions
```yaml
# Azure Monitor Alert Rules
alerts:
  - name: "High API Response Time"
    condition: "avg_response_time > 2000ms for 5 minutes"
    actions:
      - email: "team@company.com"
      - slack: "#alerts-channel"
      - webhook: "https://monitoring.company.com/alert"
  
  - name: "High Error Rate"
    condition: "error_rate > 5% for 5 minutes"
    actions:
      - pager: "on-call-engineer"
      - email: "management@company.com"
      - auto-scale: "increase_instances"
```

---

## 📈 Performance Optimization Roadmap

### Phase 1: Foundation (Completed)
- ✅ Basic performance monitoring setup
- ✅ Core Web Vitals tracking
- ✅ Database indexing strategy
- ✅ Bundle size optimization

### Phase 2: Enhancement (Current)
- 🔄 Advanced caching implementation
- 🔄 CDN setup for static assets  
- 🔄 Database query optimization
- 🔄 Progressive loading strategies

### Phase 3: Advanced (Future)
- 📅 Service Worker implementation
- 📅 Advanced image optimization (WebP, AVIF)
- 📅 GraphQL for efficient data fetching
- 📅 Edge computing optimization

### Phase 4: Scale (Future)
- 📅 Multi-region deployment
- 📅 Advanced caching strategies (Redis)
- 📅 Microservices architecture
- 📅 Real-time performance optimization

---

**Document Owner:** John - Product Manager  
**Technical Reviewer:** Quinn - QA Architect  
**Last Updated:** 2. Juli 2025  
**Review Schedule:** Monthly or after major releases  
**Next Review:** August 2025
