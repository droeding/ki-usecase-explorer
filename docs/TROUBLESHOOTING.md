# Troubleshooting Guide

## 🔍 Common Issues & Solutions

This guide covers issues encountered during development and deployment of Next.js applications to Azure Static Web Apps, based on real-world experience.

## 🚀 Deployment Issues

### 1. Azure Policy Restrictions

#### Issue: Resource Creation Blocked
```bash
Error: Resource 'myapp-static-web-app' was disallowed by policy. 
Policy identifiers: 'BG365 - Allowed Locations'
```

**Root Cause**: Enterprise Azure policies restrict resource creation in certain regions or with certain naming patterns.

**Solutions**:
1. **Use Existing Resources**:
   ```bash
   # Find existing Resource Groups in allowed regions
   az group list --query "[].{Name:name, Location:location}" -o table
   
   # Use existing Static Web Apps
   az staticwebapp list --query "[].name" -o table
   ```

2. **Token-Based Deployment** (Bypasses Policies):
   ```bash
   # Get deployment token
   az rest --method post \
     --uri "https://management.azure.com/subscriptions/SUB_ID/resourceGroups/RG_NAME/providers/Microsoft.Web/staticSites/APP_NAME/listSecrets?api-version=2022-03-01" \
     --query "properties.apiKey" -o tsv
   ```

#### Issue: CLI Authentication Problems
```bash
Error: Application with identifier 'client-id' was not found
```

**Solution**: Remove environment files before SWA CLI operations
```bash
mv .env .env.backup
mv .env.local .env.local.backup
swa deploy out --deployment-token "TOKEN"
```

### 2. Build & Static Export Issues

#### Issue: Missing index.html
```bash
Error: Failed to find a default file in the app artifacts folder (out)
```

**Root Cause**: Next.js not configured for static export.

**Solution**: Configure `next.config.js`
```javascript
const nextConfig = {
  output: 'export',        // Required for static export
  trailingSlash: true,     // SWA compatibility
  images: {
    unoptimized: true      // Required for static export
  }
}
```

#### Issue: Dynamic Routes Not Working
```bash
Error: 404 on dynamic routes after deployment
```

**Solutions**:
1. **Add SWA Routing**:
   ```json
   // staticwebapp.config.json
   {
     "navigationFallback": {
       "rewrite": "/index.html"
     }
   }
   ```

2. **Use generateStaticParams** for dynamic routes:
   ```typescript
   // app/users/[id]/page.tsx
   export async function generateStaticParams() {
     return [{ id: '1' }, { id: '2' }] // Pre-generate static routes
   }
   ```

### 3. API Route Issues

#### Issue: API Routes Return 404
```bash
GET /api/users -> 404 Not Found
```

**Root Cause**: Azure Functions not properly configured for Static Web Apps.

**Solutions**:
1. **Correct Directory Structure**:
   ```
   api/
   ├── users/
   │   ├── function.json
   │   └── index.js
   └── host.json
   ```

2. **Azure Functions Binding**:
   ```json
   // api/users/function.json
   {
     "bindings": [
       {
         "authLevel": "anonymous",
         "type": "httpTrigger",
         "direction": "in",
         "name": "req",
         "methods": ["get", "post"]
       },
       {
         "type": "http",
         "direction": "out",
         "name": "res"
       }
     ]
   }
   ```

#### Issue: CORS Errors in Production
```bash
Access to fetch at 'https://app.azurestaticapps.net/api/users' from origin 'https://app.azurestaticapps.net' has been blocked
```

**Solution**: Configure proper API base URLs
```typescript
// lib/api.ts
const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || ''
}

const apiCall = async (endpoint: string) => {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`
  return fetch(url)
}
```

## 🖥️ Development Issues

### 1. TypeScript Errors

#### Issue: Module Import Errors
```bash
Module '"@ki-usecase-explorer/types"' not found
```

**Root Cause**: Monorepo structure cleanup or missing workspace dependencies.

**Solution**: Create local types file
```typescript
// lib/types.ts
export interface UseCase {
  id: string
  title: string
  description: string
  // ... other properties
}
```

#### Issue: Environment Variable Type Errors
```bash
Property 'CUSTOM_VAR' does not exist on type 'ProcessEnv'
```

**Solution**: Extend environment types
```typescript
// next-env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL: string
    CUSTOM_VAR: string
  }
}
```

### 2. Testing Issues

#### Issue: Jest Configuration Errors
```bash
Jest encountered an unexpected token
```

**Solution**: Update Jest configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  }
}
```

#### Issue: Testing Library Setup
```bash
ReferenceError: expect is not defined
```

**Solution**: Create Jest setup file
```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
```

### 3. Environment Configuration

#### Issue: Environment Variables Not Loading
```bash
process.env.DATABASE_URL is undefined
```

**Solutions**:
1. **Check File Names**:
   - Local: `.env.local`
   - Development: `.env.development`
   - Production: Azure Static Web App settings

2. **Client vs Server Variables**:
   ```bash
   # Client-side (browser)
   NEXT_PUBLIC_API_URL="https://api.example.com"
   
   # Server-side only
   DATABASE_URL="postgresql://..."
   ```

3. **Azure SWA Configuration**:
   ```bash
   # Set in Azure portal under Configuration
   az staticwebapp appsettings set \
     --name "your-app" \
     --setting-names DATABASE_URL="your-connection-string"
   ```

## 🐛 Runtime Issues

### 1. Database Connection Problems

#### Issue: Connection Timeouts
```bash
Error: connect ETIMEDOUT
```

**Solutions**:
1. **Check Connection String**:
   ```bash
   # Test connection
   psql "postgresql://user:pass@host:5432/db?sslmode=require"
   ```

2. **Verify SSL Mode**:
   ```bash
   DATABASE_URL="postgresql://...?sslmode=require"
   ```

3. **Check Firewall Rules**:
   - Azure Database firewall settings
   - Allow Azure services access

#### Issue: Prisma Client Errors
```bash
PrismaClientInitializationError: Can't reach database server
```

**Solutions**:
1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Check Schema Location**:
   ```javascript
   // prisma/schema.prisma should be in correct location
   generator client {
     provider = "prisma-client-js"
   }
   ```

### 2. Performance Issues

#### Issue: Slow Loading Times
**Diagnostics**:
```bash
# Check bundle size
npm run build
npx @next/bundle-analyzer
```

**Solutions**:
1. **Optimize Images**:
   ```javascript
   // next.config.js
   images: {
     unoptimized: true, // For static export
     formats: ['image/webp', 'image/avif']
   }
   ```

2. **Code Splitting**:
   ```typescript
   // Dynamic imports
   const DynamicComponent = dynamic(() => import('./Component'))
   ```

## 🔧 Development Tools

### 1. Debugging Tools

#### VS Code Configuration
```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Next.js",
  "program": "${workspaceFolder}/node_modules/.bin/next",
  "args": ["dev"],
  "console": "integratedTerminal"
}
```

#### Network Debugging
```bash
# Check API endpoints
curl -v https://your-app.azurestaticapps.net/api/health

# Check headers
curl -I https://your-app.azurestaticapps.net/
```

### 2. Log Analysis

#### Azure Functions Logs
```bash
# Stream logs
az functionapp log tail --name "your-app" --resource-group "your-rg"

# Download logs
az functionapp log download --name "your-app" --resource-group "your-rg"
```

#### Application Insights
```javascript
// Add to pages/_app.tsx
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.AZURE_APPLICATION_INSIGHTS_CONNECTION_STRING
  }
})
```

## 📝 Debugging Checklist

### ✅ Before Seeking Help
- [ ] Check console/terminal for error messages
- [ ] Verify environment variables are set correctly
- [ ] Test in both development and production
- [ ] Clear browser cache and try incognito mode
- [ ] Check Azure portal for service status
- [ ] Review recent code changes

### ✅ Gathering Information
- [ ] Exact error message and stack trace
- [ ] Browser/environment information
- [ ] Steps to reproduce the issue
- [ ] Expected vs actual behavior
- [ ] Recent changes or deployments

### ✅ Quick Fixes to Try
- [ ] Restart development server
- [ ] Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- [ ] Clear Next.js cache: `rm -rf .next`
- [ ] Check for typos in configuration files
- [ ] Verify file permissions and paths

## 📞 Getting Additional Help

### 1. Use BMad Agents
```bash
*agent qa        # For deployment and testing issues
*agent dev       # For development problems
*agent architect # For system design questions
```

### 2. Azure Support Resources
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)
- [Azure Support Portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)

### 3. Community Resources
- [Next.js GitHub Issues](https://github.com/vercel/next.js/issues)
- [Azure Static Web Apps GitHub](https://github.com/Azure/static-web-apps)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-static-web-apps)

---

*This troubleshooting guide is based on real issues encountered during KI-UseCase-Explorer development and deployment*
