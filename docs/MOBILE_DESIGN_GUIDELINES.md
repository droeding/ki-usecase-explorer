# Mobile App Design Guidelines
## Ki Use-Case Explorer - Bechtle Edition

*Version 1.0 | 2. Juli 2025 | Sarah - Product Owner*

---

## 📱 Executive Summary

Diese Mobile Design Guidelines definieren die strategischen Prinzipien und praktischen Standards für die mobile Optimierung der **Ki Use-Case Explorer Plattform**. Als enterprise-grade B2B-Lösung muss die mobile Experience professionelle Standards erfüllen und gleichzeitig eine intuitive Benutzererfahrung bieten.

### Business Goals
- **Maximierung der Mobile Adoption**: 70%+ der Nutzer greifen mobil zu
- **Produktivitätssteigerung**: 40% schnellere Use-Case-Recherche unterwegs
- **Executive Dashboard Access**: C-Level Entscheidungsträger benötigen mobile Insights

---

## 🎯 Mobile-First Strategy

### Core Principles

#### 1. **Progressive Enhancement** 
```
Mobile Core → Tablet Enhanced → Desktop Extended
```
- Mobile-first Development Approach
- Feature-parity across all Devices
- Performance-optimierte Basis-Experience

#### 2. **Enterprise Accessibility**
- WCAG 2.1 AA Compliance
- Bechtle Corporate Design Integration
- Multi-language Support (DE/EN)

#### 3. **Performance Standards**
```
Target Metrics:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms
```

---

## 📐 Design System Specifications

### Color Palette (Mobile Optimized)

```css
/* Bechtle Corporate Colors - Mobile Contrast Enhanced */
:root {
  /* Primary Colors */
  --bechtle-primary: #00B04F;           /* Enhanced for mobile visibility */
  --bechtle-primary-dark: #008A3D;     /* Touch state feedback */
  --bechtle-primary-light: #33C06F;    /* Hover states */
  
  /* Secondary Colors */
  --bechtle-secondary: #004B87;        /* Navigation elements */
  --bechtle-secondary-dark: #003966;   /* Active states */
  --bechtle-secondary-light: #2E6BA8;  /* Secondary actions */
  
  /* Neutral Colors - Mobile Optimized */
  --mobile-gray-50: #F9FAFB;          /* Background surfaces */
  --mobile-gray-100: #F3F4F6;         /* Card backgrounds */
  --mobile-gray-200: #E5E7EB;         /* Borders, dividers */
  --mobile-gray-300: #D1D5DB;         /* Input borders */
  --mobile-gray-400: #9CA3AF;         /* Placeholder text */
  --mobile-gray-500: #6B7280;         /* Secondary text */
  --mobile-gray-600: #4B5563;         /* Primary text */
  --mobile-gray-700: #374151;         /* Headings */
  --mobile-gray-800: #1F2937;         /* High contrast text */
  --mobile-gray-900: #111827;         /* Maximum contrast */
  
  /* Status Colors */
  --success: #10B981;                 /* Success states */
  --warning: #F59E0B;                 /* Warning states */
  --error: #EF4444;                   /* Error states */
  --info: #3B82F6;                    /* Information states */
}
```

### Typography Scale

```css
/* Mobile Typography System */
.mobile-typography {
  /* Headlines */
  --text-4xl: 2.25rem;  /* 36px - Page titles */
  --text-3xl: 1.875rem; /* 30px - Section headers */
  --text-2xl: 1.5rem;   /* 24px - Card titles */
  --text-xl: 1.25rem;   /* 20px - Subheadings */
  
  /* Body Text */
  --text-lg: 1.125rem;  /* 18px - Large body text */
  --text-base: 1rem;    /* 16px - Standard body text */
  --text-sm: 0.875rem;  /* 14px - Secondary text */
  --text-xs: 0.75rem;   /* 12px - Captions, metadata */
  
  /* Line Heights - Mobile Optimized */
  --leading-tight: 1.25;   /* Headlines */
  --leading-snug: 1.375;   /* Subheadings */
  --leading-normal: 1.5;   /* Body text */
  --leading-relaxed: 1.625; /* Long-form content */
}
```

### Spacing System

```css
/* Mobile-First Spacing Scale */
:root {
  --space-1: 0.25rem;   /* 4px - Fine details */
  --space-2: 0.5rem;    /* 8px - Small gaps */
  --space-3: 0.75rem;   /* 12px - Component spacing */
  --space-4: 1rem;      /* 16px - Standard spacing */
  --space-5: 1.25rem;   /* 20px - Section spacing */
  --space-6: 1.5rem;    /* 24px - Large spacing */
  --space-8: 2rem;      /* 32px - Major sections */
  --space-10: 2.5rem;   /* 40px - Page sections */
  --space-12: 3rem;     /* 48px - Hero sections */
  --space-16: 4rem;     /* 64px - Major layouts */
  
  /* Touch Target Sizes */
  --touch-sm: 44px;     /* Minimum touch target */
  --touch-md: 48px;     /* Comfortable touch target */
  --touch-lg: 56px;     /* Large touch target */
}
```

---

## 📱 Mobile Breakpoint Strategy

### Responsive Breakpoints

```css
/* Mobile-First Breakpoint System */
:root {
  /* Device Categories */
  --mobile-sm: 320px;   /* Small phones (iPhone SE) */
  --mobile-md: 375px;   /* Standard phones (iPhone 12/13) */
  --mobile-lg: 414px;   /* Large phones (iPhone 12 Pro Max) */
  --tablet-sm: 768px;   /* Small tablets (iPad mini) */
  --tablet-lg: 1024px;  /* Large tablets (iPad Pro) */
  --desktop: 1280px;    /* Desktop breakpoint */
}

/* Breakpoint Usage */
@media (min-width: 320px) { /* Mobile Small */ }
@media (min-width: 375px) { /* Mobile Standard */ }
@media (min-width: 414px) { /* Mobile Large */ }
@media (min-width: 768px) { /* Tablet Portrait */ }
@media (min-width: 1024px) { /* Tablet Landscape */ }
@media (min-width: 1280px) { /* Desktop */ }
```

### Layout Grid System

```css
/* Mobile Grid System */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  
  /* Mobile Padding */
  padding-left: var(--space-4);   /* 16px */
  padding-right: var(--space-4);  /* 16px */
}

@media (min-width: 768px) {
  .container {
    padding-left: var(--space-6);  /* 24px */
    padding-right: var(--space-6); /* 24px */
  }
}

@media (min-width: 1024px) {
  .container {
    padding-left: var(--space-8);  /* 32px */
    padding-right: var(--space-8); /* 32px */
  }
}
```

---

## 🧩 Mobile Component Library

### 1. Navigation Components

#### Mobile Navigation Bar
```jsx
// Primary Mobile Navigation
const MobileNavigation = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
    <div className="flex justify-around py-2">
      <NavItem icon="dashboard" label="Dashboard" active />
      <NavItem icon="search" label="Suchen" />
      <NavItem icon="favorites" label="Favoriten" />
      <NavItem icon="profile" label="Profil" />
    </div>
  </nav>
);

// Navigation Item Component
const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex flex-col items-center py-1 px-2 min-w-[${var(--touch-md)}] ${
    active ? 'text-bechtle-primary' : 'text-gray-500'
  }`}>
    <Icon name={icon} size={24} />
    <span className="text-xs mt-1">{label}</span>
  </button>
);
```

#### Mobile Header
```jsx
const MobileHeader = ({ title, showBack = false, actions = [] }) => (
  <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
    <div className="flex items-center justify-between p-4 min-h-[60px]">
      {showBack && (
        <button className="p-2 -ml-2">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      )}
      <h1 className="text-lg font-semibold text-gray-900 truncate flex-1 text-center">
        {title}
      </h1>
      <div className="flex space-x-2">
        {actions.map((action, index) => (
          <button key={index} className="p-2 -mr-2">
            {action.icon}
          </button>
        ))}
      </div>
    </div>
  </header>
);
```

### 2. Content Components

#### Mobile Use-Case Card
```jsx
const MobileUseCaseCard = ({ useCase }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
          {useCase.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {useCase.businessArea}
        </p>
      </div>
      <button className="p-2 -mr-2">
        <HeartIcon className="w-5 h-5 text-gray-400" />
      </button>
    </div>
    
    {/* Content */}
    <p className="text-sm text-gray-700 line-clamp-3 mb-3">
      {useCase.description}
    </p>
    
    {/* Metrics */}
    <div className="flex justify-between items-center mb-3">
      <div className="flex space-x-4">
        <MetricBadge label="ROI" value={useCase.roi} />
        <MetricBadge label="Aufwand" value={useCase.effort} />
      </div>
      <ImplementationStatus status={useCase.status} />
    </div>
    
    {/* Actions */}
    <div className="flex space-x-2">
      <button className="flex-1 bg-bechtle-primary text-white py-2 px-4 rounded-md text-sm font-medium">
        Details ansehen
      </button>
      <button className="p-2 border border-gray-300 rounded-md">
        <ShareIcon className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  </div>
);
```

#### Mobile Search Interface
```jsx
const MobileSearch = ({ onSearch, filters = [] }) => (
  <div className="bg-white border-b border-gray-200">
    {/* Search Input */}
    <div className="p-4">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Use Cases suchen..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
    
    {/* Filter Chips */}
    <div className="px-4 pb-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <FilterChip
            key={index}
            label={filter.label}
            active={filter.active}
            onClick={() => filter.onToggle()}
          />
        ))}
      </div>
    </div>
  </div>
);
```

### 3. Form Components

#### Mobile Form Input
```jsx
const MobileInput = ({ 
  label, 
  type = "text", 
  placeholder, 
  error, 
  required = false,
  ...props 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border rounded-lg text-base ${
        error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
          : 'border-gray-300 focus:border-bechtle-primary focus:ring-bechtle-primary'
      }`}
      {...props}
    />
    {error && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
);
```

#### Mobile Action Button
```jsx
const MobileButton = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  fullWidth = false,
  loading = false,
  ...props 
}) => {
  const baseClasses = "font-medium rounded-lg transition-colors duration-200 flex items-center justify-center";
  
  const variants = {
    primary: "bg-bechtle-primary text-white hover:bg-bechtle-primary-dark",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[40px]",
    md: "px-4 py-3 text-base min-h-[48px]",
    lg: "px-6 py-4 text-lg min-h-[56px]"
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      }`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        children
      )}
    </button>
  );
};
```

---

## 📐 Layout Patterns

### 1. Dashboard Layout (Mobile)

```jsx
const MobileDashboard = () => (
  <div className="min-h-screen bg-gray-50 pb-16"> {/* Bottom nav space */}
    <MobileHeader title="Dashboard" />
    
    {/* Stats Cards - Horizontal Scroll */}
    <section className="p-4">
      <div className="flex space-x-4 overflow-x-auto pb-2">
        <StatCard metric="Aktive Use Cases" value="156" trend="+12%" />
        <StatCard metric="Implementiert" value="89" trend="+8%" />
        <StatCard metric="ROI Total" value="€2.4M" trend="+15%" />
        <StatCard metric="Potenzial" value="€5.8M" trend="+22%" />
      </div>
    </section>
    
    {/* Quick Actions */}
    <section className="px-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Schnellzugriff</h2>
      <div className="grid grid-cols-2 gap-3">
        <QuickAction icon="plus" label="Neuer Use Case" />
        <QuickAction icon="search" label="Use Cases finden" />
        <QuickAction icon="chart" label="Analytics" />
        <QuickAction icon="team" label="Team Dashboard" />
      </div>
    </section>
    
    {/* Recent Use Cases */}
    <section className="px-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Zuletzt bearbeitet</h2>
        <button className="text-bechtle-primary text-sm font-medium">
          Alle anzeigen
        </button>
      </div>
      <div className="space-y-3">
        {recentUseCases.map(useCase => (
          <MobileUseCaseCard key={useCase.id} useCase={useCase} />
        ))}
      </div>
    </section>
    
    <MobileNavigation />
  </div>
);
```

### 2. Use Case Detail Layout (Mobile)

```jsx
const MobileUseCaseDetail = ({ useCase }) => (
  <div className="min-h-screen bg-white">
    <MobileHeader 
      title={useCase.title}
      showBack={true}
      actions={[
        { icon: <ShareIcon className="w-6 h-6" /> },
        { icon: <HeartIcon className="w-6 h-6" /> }
      ]}
    />
    
    {/* Hero Section */}
    <section className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <CategoryBadge category={useCase.businessArea} />
        <ImplementationStatus status={useCase.status} />
      </div>
      
      <h1 className="text-xl font-bold text-gray-900 mb-2">
        {useCase.title}
      </h1>
      
      <p className="text-gray-600 text-base leading-relaxed">
        {useCase.description}
      </p>
    </section>
    
    {/* Key Metrics */}
    <section className="p-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold mb-3">Kennzahlen</h2>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard label="ROI" value={useCase.roi} />
        <MetricCard label="Implementierungsaufwand" value={useCase.effort} />
        <MetricCard label="Zeitersparnis" value={useCase.timeSaving} />
        <MetricCard label="Komplexität" value={useCase.complexity} />
      </div>
    </section>
    
    {/* Implementation Details */}
    <section className="p-4">
      <h2 className="text-lg font-semibold mb-3">Umsetzung</h2>
      <div className="space-y-4">
        <DetailSection 
          title="Technologie-Stack"
          content={useCase.technology}
        />
        <DetailSection 
          title="Voraussetzungen"
          content={useCase.requirements}
        />
        <DetailSection 
          title="Nächste Schritte"
          content={useCase.nextSteps}
        />
      </div>
    </section>
    
    {/* Action Buttons */}
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
      <div className="flex space-x-3">
        <MobileButton variant="outline" className="flex-1">
          Zu Favoriten
        </MobileButton>
        <MobileButton variant="primary" className="flex-1">
          Implementierung starten
        </MobileButton>
      </div>
    </div>
  </div>
);
```

---

## ⚡ Performance Optimization

### Image Optimization

```jsx
// Responsive Image Component
const ResponsiveImage = ({ 
  src, 
  alt, 
  sizes = "100vw",
  className = "",
  priority = false 
}) => (
  <img
    src={src}
    alt={alt}
    sizes={sizes}
    className={`${className} object-cover`}
    loading={priority ? "eager" : "lazy"}
    decoding="async"
  />
);

// Usage Examples
<ResponsiveImage 
  src="/api/images/use-case-hero.webp"
  alt="Use Case Visualization"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={isAboveFold}
/>
```

### Lazy Loading Strategies

```jsx
// Progressive Loading Hook
const useProgressiveLoading = (threshold = 0.1) => {
  const [ref, inView] = useInView({ threshold });
  const [hasLoaded, setHasLoaded] = useState(false);
  
  useEffect(() => {
    if (inView && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [inView, hasLoaded]);
  
  return [ref, hasLoaded];
};

// Lazy Use Case Card
const LazyUseCaseCard = ({ useCase }) => {
  const [ref, hasLoaded] = useProgressiveLoading();
  
  return (
    <div ref={ref} className="min-h-[200px]">
      {hasLoaded ? (
        <MobileUseCaseCard useCase={useCase} />
      ) : (
        <UseCaseCardSkeleton />
      )}
    </div>
  );
};
```

### Data Fetching Optimization

```typescript
// Mobile-Optimized API Queries
interface MobileUseCaseQuery {
  limit: number;
  offset: number;
  fields: string[]; // Only essential fields for mobile
  includeMetrics: boolean;
}

// Progressive Data Loading
export const useMobileUseCases = (query: MobileUseCaseQuery) => {
  return useInfiniteQuery({
    queryKey: ['use-cases-mobile', query],
    queryFn: ({ pageParam = 0 }) => 
      fetchUseCases({
        ...query,
        offset: pageParam,
        // Mobile-specific field selection
        fields: ['id', 'title', 'businessArea', 'roi', 'status', 'thumbnail']
      }),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length * query.limit : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

---

## 🔧 Technical Implementation

### CSS Custom Properties for Mobile

```css
/* Mobile-specific CSS Variables */
:root {
  /* Safe Area Support */
  --safe-area-top: env(safe-area-inset-top);
  --safe-area-bottom: env(safe-area-inset-bottom);
  --safe-area-left: env(safe-area-inset-left);
  --safe-area-right: env(safe-area-inset-right);
  
  /* Mobile Viewport Units */
  --vh: 1vh; /* Dynamic viewport height */
  --vw: 1vw; /* Dynamic viewport width */
  
  /* Touch-friendly Sizing */
  --min-touch-target: 44px;
  --comfortable-touch: 48px;
  --large-touch: 56px;
  
  /* Mobile-optimized Animations */
  --mobile-transition: 150ms ease-out;
  --mobile-transition-slow: 300ms ease-out;
}

/* Safe Area Utilities */
.safe-area-pt { padding-top: var(--safe-area-top); }
.safe-area-pb { padding-bottom: var(--safe-area-bottom); }
.safe-area-pl { padding-left: var(--safe-area-left); }
.safe-area-pr { padding-right: var(--safe-area-right); }

/* Mobile Viewport Height Fix */
.min-h-screen-mobile {
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
}
```

### React Hooks for Mobile Features

```typescript
// Mobile-specific Hooks
export const useViewportHeight = () => {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    
    return () => window.removeEventListener('resize', setVH);
  }, []);
};

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

export const useTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  
  return isTouch;
};
```

### Service Worker for Mobile Performance

```javascript
// sw.js - Mobile-optimized Service Worker
const CACHE_NAME = 'ki-usecase-explorer-v1';
const MOBILE_ASSETS = [
  '/',
  '/dashboard',
  '/offline',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Cache Strategy for Mobile
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/use-cases')) {
    // Network-first for dynamic content
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
```

---

## 🧪 Testing Strategy

### Mobile Testing Checklist

#### Device Testing Matrix
```
Primary Devices:
✓ iPhone 12/13 (375x812) - iOS 15+
✓ iPhone 12/13 Pro Max (414x896) - iOS 15+
✓ Samsung Galaxy S21 (360x800) - Android 11+
✓ iPad (768x1024) - iPadOS 15+
✓ iPad Pro (1024x1366) - iPadOS 15+

Secondary Devices:
✓ iPhone SE (320x568) - iOS 15+
✓ Google Pixel 5 (393x851) - Android 11+
✓ Samsung Galaxy Tab S7 (753x1037) - Android 11+
```

#### Performance Testing
```javascript
// Mobile Performance Tests
describe('Mobile Performance', () => {
  test('First Contentful Paint < 1.5s', async () => {
    const metrics = await page.metrics();
    expect(metrics.FirstContentfulPaint).toBeLessThan(1500);
  });
  
  test('Time to Interactive < 3s', async () => {
    const tti = await page.evaluate(() => performance.timing.domInteractive);
    expect(tti).toBeLessThan(3000);
  });
  
  test('Bundle size < 500KB gzipped', async () => {
    const bundleSize = await getBundleSize();
    expect(bundleSize).toBeLessThan(500 * 1024);
  });
});
```

#### Accessibility Testing
```javascript
// Mobile A11y Tests
describe('Mobile Accessibility', () => {
  test('Touch targets >= 44px', async () => {
    const touchTargets = await page.$$eval('button, a, [role="button"]', 
      elements => elements.map(el => ({
        width: el.offsetWidth,
        height: el.offsetHeight
      }))
    );
    
    touchTargets.forEach(target => {
      expect(target.width).toBeGreaterThanOrEqual(44);
      expect(target.height).toBeGreaterThanOrEqual(44);
    });
  });
  
  test('Focus visible on touch devices', async () => {
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement);
    const focusOutline = await page.evaluate(el => 
      getComputedStyle(el).outline, focusedElement);
    expect(focusOutline).not.toBe('none');
  });
});
```

---

## 📊 Analytics & Monitoring

### Mobile-Specific Metrics

```typescript
// Mobile Analytics Events
interface MobileAnalyticsEvent {
  action: string;
  category: 'mobile_interaction' | 'mobile_performance' | 'mobile_error';
  label?: string;
  value?: number;
  device_type: 'phone' | 'tablet';
  screen_size: string;
  connection_type: string;
}

// Usage Tracking
export const trackMobileUsage = (event: MobileAnalyticsEvent) => {
  gtag('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    custom_map: {
      device_type: event.device_type,
      screen_size: event.screen_size,
      connection_type: event.connection_type
    }
  });
};

// Performance Monitoring
export const monitorMobilePerformance = () => {
  // Core Web Vitals for Mobile
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'largest-contentful-paint') {
        trackMobileUsage({
          action: 'lcp_measurement',
          category: 'mobile_performance',
          value: entry.startTime,
          device_type: window.innerWidth < 768 ? 'phone' : 'tablet',
          screen_size: `${window.innerWidth}x${window.innerHeight}`,
          connection_type: navigator.connection?.effectiveType || 'unknown'
        });
      }
    });
  }).observe({ entryTypes: ['largest-contentful-paint'] });
};
```

### User Behavior Analytics

```typescript
// Mobile User Journey Tracking
export const trackMobileUserJourney = () => {
  // Touch vs Mouse Detection
  let touchDevice = false;
  
  window.addEventListener('touchstart', () => {
    touchDevice = true;
  }, { once: true });
  
  // Scroll Depth Tracking
  let maxScrollDepth = 0;
  
  window.addEventListener('scroll', () => {
    const scrollDepth = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;
      
      if (scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
        trackMobileUsage({
          action: 'scroll_depth',
          category: 'mobile_interaction',
          value: scrollDepth,
          device_type: window.innerWidth < 768 ? 'phone' : 'tablet',
          screen_size: `${window.innerWidth}x${window.innerHeight}`,
          connection_type: navigator.connection?.effectiveType || 'unknown'
        });
      }
    }
  });
};
```

---

## 🚀 Future Roadmap

### Phase 1: Foundation (Q3 2025)
- ✅ Mobile-First Design System Implementation
- ✅ Core Component Library
- ✅ Responsive Layouts für alle Haupt-Pages
- 🔄 Performance Optimization
- 📋 Accessibility Compliance (WCAG 2.1 AA)

### Phase 2: Enhancement (Q4 2025)
- 📋 Progressive Web App (PWA) Features
- 📋 Offline-First Capabilities
- 📋 Push Notifications
- 📋 Advanced Touch Gestures
- 📋 Dark Mode Support

### Phase 3: Innovation (Q1 2026)
- 📋 Voice Search Integration
- 📋 AR Use-Case Visualization
- 📋 Biometric Authentication
- 📋 AI-Powered Mobile Assistant
- 📋 Cross-Platform Mobile App (React Native)

---

## 📚 Resources & References

### Design Tools & Assets
- **Figma Design System**: [Bechtle Mobile Components](https://figma.com/bechtle-mobile)
- **Icon Library**: [Heroicons](https://heroicons.com) + Custom Bechtle Icons
- **Illustration System**: [Bechtle Brand Guidelines](https://brand.bechtle.com)

### Technical Documentation
- [React Native Guidelines](https://reactnative.dev/docs/getting-started)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [Mobile Web Performance](https://web.dev/fast/)
- [Touch Accessibility](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)

### Testing Tools
- **Device Testing**: BrowserStack, LambdaTest
- **Performance**: Lighthouse, WebPageTest
- **Accessibility**: axe-core, WAVE
- **Visual Regression**: Percy, Chromatic

---

## 🤝 Contribution Guidelines

### Design Review Process
1. **Mobile-First Approach**: Alle Designs starten mit Mobile Breakpoint
2. **Touch-Friendly**: Mindestens 44px Touch Targets
3. **Performance Budget**: Jede Komponente muss Performance-Kriterien erfüllen
4. **Accessibility First**: WCAG 2.1 AA Compliance von Anfang an

### Code Review Checklist
- [ ] Mobile-responsive Implementation
- [ ] Touch Accessibility verified
- [ ] Performance impact analyzed
- [ ] Cross-browser tested (iOS Safari, Chrome Mobile, Samsung Internet)
- [ ] Offline capabilities considered

---

*Diese Guidelines werden kontinuierlich durch User Feedback und Analytics Insights weiterentwickelt. Letzte Aktualisierung: 2. Juli 2025*

**Kontakt**: Sarah - Product Owner | Ki Use-Case Explorer Team | Bechtle AG
