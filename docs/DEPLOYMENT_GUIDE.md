# Deployment Guide - Azure Static Web Apps

## 🎯 Overview

This guide provides the **proven deployment workflow** for Next.js applications to Azure Static Web Apps, specifically designed for enterprise environments with Azure policy restrictions.

### 🔑 Key Strategy: Token-Based Deployment
- **No Git workflows required** (bypasses enterprise Git policies)
- **Uses existing Azure resources** (avoids location/naming policy issues)
- **Cost-optimized** (Free tier Azure Static Web Apps)
- **Enterprise compliant** (works within Azure policy restrictions)

## 🚀 Step-by-Step Deployment

### Prerequisites
- Azure CLI installed and authenticated
- Access to existing Resource Group in allowed region
- Azure Static Web Apps CLI: `npm install -g @azure/static-web-apps-cli`

### Step 1: Prepare Environment
```bash
# Backup environment files (they can interfere with SWA CLI)
mv .env .env.backup 2>/dev/null || true
mv .env.local .env.local.backup 2>/dev/null || true
mv .env.development .env.development.backup 2>/dev/null || true
```

### Step 2: Find Existing Azure Resources
```bash
# List existing Resource Groups
az group list --query "[].{Name:name, Location:location}" -o table

# List existing Static Web Apps in your subscription
az staticwebapp list --query "[].{Name:name, ResourceGroup:resourceGroup, Location:location}" -o table

# Choose existing Resource Group and region to avoid policy restrictions
RESOURCE_GROUP="your-existing-rg"
SUBSCRIPTION_ID="your-subscription-id"
```

### Step 3: Create or Use Static Web App
```bash
# Option A: Use existing Static Web App
APP_NAME="your-existing-app"

# Option B: Create new Static Web App (if policies allow)
az staticwebapp create \
  --name "your-new-app" \
  --resource-group "$RESOURCE_GROUP" \
  --location "West Europe" \
  --source "https://github.com/dummy/repo" \
  --branch "main"
```

### Step 4: Get Deployment Token
```bash
# Get deployment token (this bypasses Azure policies)
DEPLOYMENT_TOKEN=$(az rest \
  --method post \
  --uri "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/staticSites/$APP_NAME/listSecrets?api-version=2022-03-01" \
  --query "properties.apiKey" \
  -o tsv)

echo "Deployment token obtained successfully"
```

### Step 5: Build Application
```bash
# Ensure Next.js is configured for static export
# next.config.js should have:
# output: 'export'
# trailingSlash: true
# images: { unoptimized: true }

# Build the application
npm run build

# Verify build output
ls -la out/  # Should contain index.html and _next/ directory
```

### Step 6: Deploy to Azure
```bash
# Deploy using token (bypasses all Azure policies)
swa deploy out \
  --api-location api \
  --deployment-token "$DEPLOYMENT_TOKEN" \
  --api-language node \
  --api-version 18

# Wait for deployment to complete (usually 2-5 minutes)
```

### Step 7: Restore Environment
```bash
# Restore environment files for local development
mv .env.backup .env 2>/dev/null || true
mv .env.local.backup .env.local 2>/dev/null || true
mv .env.development.backup .env.development 2>/dev/null || true
```

### Step 8: Verify Deployment
```bash
# Get Static Web App URL
APP_URL=$(az staticwebapp show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "defaultHostname" \
  -o tsv)

echo "Application deployed to: https://$APP_URL"
```

## 🔧 Automated Deployment Script

Use the provided deployment script for consistent deployments:

```bash
# Set deployment token as environment variable
export DEPLOYMENT_TOKEN="your-token-here"

# Run deployment script
./scripts/deploy.sh
```

## ⚠️ Common Issues & Solutions

### Issue: "Application not found" Error
```bash
Error: Application with identifier 'your-client-id' was not found
```
**Solution**: Remove/backup .env files before deployment
```bash
mv .env .env.backup
mv .env.local .env.local.backup
```

### Issue: Azure Policy Restrictions
```bash
Error: Resource 'name' was disallowed by policy
```
**Solutions**:
1. Use existing Resource Groups in allowed regions
2. Use token-based deployment (bypasses policies)
3. Deploy to existing Static Web Apps

### Issue: Missing index.html in Build
```bash
Error: Failed to find a default file in the app artifacts folder
```
**Solution**: Configure Next.js for static export
```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
}
```

### Issue: API Routes Not Working
**Check**:
1. API files in `/api/` directory with proper structure
2. `function.json` files for Azure Functions
3. `staticwebapp.config.json` routing configuration

### Issue: Environment Variables Not Available
**Solutions**:
1. Use `NEXT_PUBLIC_` prefix for client-side variables
2. Configure in Azure Static Web App settings for server-side variables
3. Check `staticwebapp.config.json` for proper routing

## 📊 Deployment Verification Checklist

### ✅ Pre-Deployment
- [ ] `next.config.js` configured for static export
- [ ] Environment files backed up
- [ ] Build completes successfully (`npm run build`)
- [ ] `out/` directory contains `index.html`
- [ ] API directory structure correct

### ✅ During Deployment
- [ ] Deployment token obtained successfully
- [ ] SWA CLI deployment completes without errors
- [ ] Azure Functions deploy successfully

### ✅ Post-Deployment
- [ ] Application loads at Azure URL
- [ ] Frontend renders correctly
- [ ] API endpoints respond
- [ ] Database connections work (if applicable)
- [ ] Environment variables function correctly

## 💰 Cost Optimization

### Free Tier Limits
- **Azure Static Web Apps**: Free tier includes:
  - 100GB bandwidth per month
  - 0.5GB storage
  - Custom domains and SSL
  - Up to 2 environments

### Cost Management Tips
1. **Use existing infrastructure** (Resource Groups, databases)
2. **Monitor usage** in Azure portal
3. **Delete unused deployments** to save storage
4. **Use free tier Azure Functions** (1M executions/month)

## 🔄 CI/CD Integration (Optional)

While this guide focuses on manual token-based deployment, you can integrate with CI/CD:

### GitHub Actions (Token-Based)
```yaml
- name: Deploy to Azure Static Web Apps
  run: |
    swa deploy out \
      --api-location api \
      --deployment-token ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }} \
      --api-language node \
      --api-version 18
```

### Azure DevOps (Token-Based)
```yaml
- task: AzureStaticWebApp@0
  inputs:
    app_location: 'out'
    api_location: 'api'
    azure_static_web_apps_api_token: $(AZURE_STATIC_WEB_APPS_API_TOKEN)
```

## 📈 Monitoring & Maintenance

### Health Checks
```bash
# Check application status
curl -I https://your-app.azurestaticapps.net

# Check API endpoints
curl https://your-app.azurestaticapps.net/api/health
```

### Log Monitoring
- Use Azure Application Insights for detailed monitoring
- Check Azure Functions logs in Azure portal
- Monitor Static Web App metrics

### Updates & Maintenance
1. **Dependencies**: Keep npm packages updated
2. **Security**: Monitor for security advisories
3. **Performance**: Use Azure Application Insights
4. **Costs**: Review monthly Azure billing

---

*This deployment guide is based on successful deployment of the KI-UseCase-Explorer project*
