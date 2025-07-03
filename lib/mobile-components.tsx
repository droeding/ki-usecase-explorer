import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

// ================================================
// MOBILE DESIGN SYSTEM COMPONENTS
// Ki Use-Case Explorer - Bechtle Edition
// ================================================

// ===========================================
// 1. NAVIGATION COMPONENTS
// ===========================================

export const MobileNavigation = ({ activeTab = 'dashboard', onTabChange }: any) => {
  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'search', icon: 'search', label: 'Suchen' },
    { id: 'favorites', icon: 'heart', label: 'Favoriten' },
    { id: 'profile', icon: 'user', label: 'Profil' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center py-1 px-2 min-w-[48px] min-h-[48px] transition-colors ${
              activeTab === item.id 
                ? 'text-bechtle-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MobileIcon name={item.icon} size={24} />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export const MobileHeader = ({ 
  title, 
  showBack = false, 
  onBack,
  actions = [],
  className = ""
}: any) => (
  <header className={`sticky top-0 bg-white border-b border-gray-200 z-40 ${className}`}>
    <div className="flex items-center justify-between p-4 min-h-[60px]">
      {showBack ? (
        <button 
          onClick={onBack}
          className="p-2 -ml-2 touch-manipulation"
          aria-label="Zurück"
        >
          <MobileIcon name="chevron-left" size={24} />
        </button>
      ) : (
        <div className="w-8" />
      )}
      
      <h1 className="text-lg font-semibold text-gray-900 truncate flex-1 text-center px-2">
        {title}
      </h1>
      
      <div className="flex space-x-1">
        {actions.map((action, index) => (
          <button 
            key={index} 
            onClick={action.onClick}
            className="p-2 -mr-2 touch-manipulation"
            aria-label={action.label}
          >
            {action.icon}
          </button>
        ))}
        {actions.length === 0 && <div className="w-8" />}
      </div>
    </div>
  </header>
);

// ===========================================
// 2. CONTENT COMPONENTS
// ===========================================

export const MobileUseCaseCard = ({ useCase, onFavorite, onDetails }: any) => {
  const [isFavorite, setIsFavorite] = useState(useCase.isFavorite || false);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavorite?.(useCase.id, !isFavorite);
  };

  const handleCardClick = () => {
    onDetails?.(useCase.id);
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm touch-manipulation active:bg-gray-50 transition-colors"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">
            {useCase.title}
          </h3>
          <CategoryBadge category={useCase.businessArea} />
        </div>
        <button 
          onClick={handleFavorite}
          className="p-2 -mr-2 touch-manipulation"
          aria-label={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
        >
          <MobileIcon 
            name={isFavorite ? "heart-filled" : "heart"} 
            size={20} 
            className={isFavorite ? "text-red-500" : "text-gray-400"}
          />
        </button>
      </div>
      
      {/* Content */}
      <p className="text-sm text-gray-700 line-clamp-3 mb-4 leading-relaxed">
        {useCase.description}
      </p>
      
      {/* Metrics */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <MetricBadge label="ROI" value={useCase.roi} variant="success" />
          <MetricBadge label="Aufwand" value={useCase.effort} variant="warning" />
        </div>
        <ImplementationStatus status={useCase.status} />
      </div>
      
      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDetails?.(useCase.id);
          }}
          className="flex-1 bg-bechtle-primary text-white py-2.5 px-4 rounded-md text-sm font-medium touch-manipulation hover:bg-bechtle-primary-dark transition-colors"
        >
          Details ansehen
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigator.share?.({
              title: useCase.title,
              text: useCase.description,
              url: `${window.location.origin}/use-cases/${useCase.id}`
            }) || alert('Sharing not supported');
          }}
          className="p-2.5 border border-gray-300 rounded-md touch-manipulation hover:bg-gray-50 transition-colors"
          aria-label="Use Case teilen"
        >
          <MobileIcon name="share" size={16} />
        </button>
      </div>
    </div>
  );
};

export const MobileSearchInterface = ({ 
  onSearch, 
  filters = [], 
  searchValue = "",
  placeholder = "Use Cases suchen..."
}) => {
  const [localValue, setLocalValue] = useState(searchValue);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(localValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localValue, onSearch]);

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Search Input */}
      <div className="p-4">
        <div className="relative">
          <MobileIcon 
            name="search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={placeholder}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-base focus:border-bechtle-primary focus:ring-1 focus:ring-bechtle-primary transition-colors"
          />
          {localValue && (
            <button
              onClick={() => {
                setLocalValue('');
                onSearch('');
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 touch-manipulation"
              aria-label="Suche löschen"
            >
              <MobileIcon name="x" size={16} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>
      
      {/* Filter Section */}
      {filters.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Filter</span>
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="text-sm text-bechtle-primary font-medium touch-manipulation"
            >
              {isFilterExpanded ? 'Weniger' : 'Mehr'}
            </button>
          </div>
          
          <div className={`flex flex-wrap gap-2 ${!isFilterExpanded ? 'max-h-12 overflow-hidden' : ''}`}>
            {filters.map((filter, index) => (
              <FilterChip
                key={index}
                label={filter.label}
                active={filter.active}
                count={filter.count}
                onClick={() => filter.onToggle()}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================
// 3. UI COMPONENTS
// ===========================================

export const MetricBadge = ({ label, value, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  };

  return (
    <div className="text-center">
      <div className={`text-xs font-medium px-2 py-1 rounded ${variants[variant]}`}>
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
};

export const CategoryBadge = ({ category, size = "sm" }) => {
  const sizes = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5"
  };

  return (
    <span className={`inline-flex items-center bg-bechtle-secondary/10 text-bechtle-secondary font-medium rounded-full ${sizes[size]}`}>
      {category}
    </span>
  );
};

export const ImplementationStatus = ({ status }) => {
  const statusConfig = {
    'konzept': { color: 'bg-gray-100 text-gray-800', label: 'Konzept' },
    'entwicklung': { color: 'bg-blue-100 text-blue-800', label: 'In Entwicklung' },
    'pilotphase': { color: 'bg-yellow-100 text-yellow-800', label: 'Pilotphase' },
    'implementiert': { color: 'bg-green-100 text-green-800', label: 'Implementiert' },
    'wartung': { color: 'bg-purple-100 text-purple-800', label: 'Wartung' }
  };

  const config = statusConfig[status] || statusConfig['konzept'];

  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${config.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {config.label}
    </span>
  );
};

export const FilterChip = ({ label, active = false, count, onClick }: any) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium touch-manipulation transition-colors ${
      active 
        ? 'bg-bechtle-primary text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {label}
    {count && (
      <span className={`ml-1.5 text-xs ${active ? 'text-white/80' : 'text-gray-500'}`}>
        ({count})
      </span>
    )}
  </button>
);

// ===========================================
// 4. FORM COMPONENTS
// ===========================================

export const MobileInput = ({ 
  label, 
  type = "text", 
  placeholder, 
  error, 
  required = false,
  helperText,
  icon,
  value,
  onChange,
  ...props 
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <MobileIcon name={icon} size={20} className="text-gray-400" />
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-lg text-base transition-colors ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-bechtle-primary focus:ring-bechtle-primary'
          }`}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <MobileIcon name="exclamation-circle" size={16} className="mr-1" />
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export const MobileButton = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  ...props 
}) => {
  const baseClasses = "font-medium rounded-lg transition-all duration-200 flex items-center justify-center touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-bechtle-primary text-white hover:bg-bechtle-primary-dark active:bg-bechtle-primary-dark shadow-sm",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm"
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
      disabled={loading || disabled}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

// ===========================================
// 5. LAYOUT COMPONENTS
// ===========================================

export const MobileContainer = ({ children, className = "" }) => (
  <div className={`w-full max-w-md mx-auto px-4 ${className}`}>
    {children}
  </div>
);

export const MobileSection = ({ 
  title, 
  subtitle, 
  children, 
  action,
  className = "" 
}) => (
  <section className={`py-6 ${className}`}>
    {(title || subtitle || action) && (
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
    )}
    {children}
  </section>
);

export const MobileGrid = ({ 
  children, 
  columns = 2, 
  gap = 4, 
  className = "" 
}) => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4"
  };

  const gapClasses = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8"
  };

  return (
    <div className={`grid ${gridClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

// ===========================================
// 6. UTILITY COMPONENTS
// ===========================================

export const MobileIcon = ({ name, size = 24, className = "" }) => {
  // Icon mapping - in production, use a proper icon library
  const iconPaths = {
    'dashboard': 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586l-2 2V5H5v14h14v-3.586l2-2V19a1 1 0 01-1 1H4a1 1 0 01-1-1V4z',
    'search': 'M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z',
    'heart': 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z',
    'heart-filled': 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z',
    'user': 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
    'chevron-left': 'M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z',
    'share': 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z',
    'x': 'M6 18L18 6M6 6l12 12',
    'exclamation-circle': 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d={iconPaths[name] || iconPaths['search']}
        clipRule="evenodd"
      />
    </svg>
  );
};

export const LoadingSpinner = ({ size = "md" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={`${sizes[size]} animate-spin`}>
      <svg viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-25"
        />
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          className="opacity-75"
        />
      </svg>
    </div>
  );
};

export const MobileSkeleton = ({ 
  variant = "text", 
  width = "100%", 
  height = "1rem",
  className = "" 
}) => {
  const variants = {
    text: "rounded",
    avatar: "rounded-full",
    card: "rounded-lg"
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

// ===========================================
// 7. HOOKS
// ===========================================

export const useViewportHeight = () => {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
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

export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-top')) || 0,
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-bottom')) || 0,
        left: parseInt(computedStyle.getPropertyValue('--safe-area-left')) || 0,
        right: parseInt(computedStyle.getPropertyValue('--safe-area-right')) || 0
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
};

// ===========================================
// 8. LAZY LOADING COMPONENTS
// ===========================================

export const LazyMobileUseCaseCard = ({ useCase, ...props }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  return (
    <div ref={ref} className="min-h-[200px]">
      {inView ? (
        <MobileUseCaseCard useCase={useCase} {...props} />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <MobileSkeleton variant="text" height="1.25rem" width="80%" className="mb-2" />
              <MobileSkeleton variant="text" height="0.875rem" width="40%" />
            </div>
            <MobileSkeleton variant="avatar" width="1.25rem" height="1.25rem" />
          </div>
          <MobileSkeleton variant="text" height="0.875rem" width="100%" className="mb-2" />
          <MobileSkeleton variant="text" height="0.875rem" width="85%" className="mb-4" />
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <MobileSkeleton variant="text" height="1.5rem" width="3rem" />
              <MobileSkeleton variant="text" height="1.5rem" width="3rem" />
            </div>
            <MobileSkeleton variant="text" height="1.5rem" width="4rem" />
          </div>
          <div className="flex space-x-2">
            <MobileSkeleton variant="card" height="2.5rem" className="flex-1" />
            <MobileSkeleton variant="card" height="2.5rem" width="2.5rem" />
          </div>
        </div>
      )}
    </div>
  );
};

export default {
  MobileNavigation,
  MobileHeader,
  MobileUseCaseCard,
  MobileSearchInterface,
  MetricBadge,
  CategoryBadge,
  ImplementationStatus,
  FilterChip,
  MobileInput,
  MobileButton,
  MobileContainer,
  MobileSection,
  MobileGrid,
  MobileIcon,
  LoadingSpinner,
  MobileSkeleton,
  LazyMobileUseCaseCard,
  // Hooks
  useViewportHeight,
  useMobileDetection,
  useTouchDevice,
  useSafeArea
};
