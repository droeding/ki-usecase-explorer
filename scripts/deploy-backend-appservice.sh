#!/bin/bash

# ================================================
# Azure App Service Backend Deployment Script
# Ki Use-Case Explorer - Wasp Server (Alternative)
# ================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ki-usecase-server-app"
PLAN_NAME="ki-usecase-plan"
RESOURCE_GROUP="rg-bechtle-ai-apps"
LOCATION="westeurope"

echo -e "${BLUE}🚀 Azure App Service Backend Deployment${NC}"
echo -e "${BLUE}=======================================${NC}"

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}🔐 Please log in to Azure...${NC}"
    az login
fi

echo -e "${GREEN}✅ Prerequisites check completed${NC}"

# Ensure we have a fresh server build
echo -e "${YELLOW}🔨 Building Wasp server...${NC}"
if [ ! -d ".wasp/build/server" ]; then
    echo -e "${YELLOW}Building Wasp project first...${NC}"
    wasp build
fi

# Create App Service Plan if it doesn't exist
echo -e "${YELLOW}🏗️ Setting up Azure App Service Plan...${NC}"

if ! az appservice plan show --name $PLAN_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}Creating App Service Plan: $PLAN_NAME${NC}"
    az appservice plan create \
        --name $PLAN_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --sku B1 \
        --is-linux
else
    echo -e "${GREEN}✅ App Service Plan $PLAN_NAME already exists${NC}"
fi

# Create Web App if it doesn't exist
echo -e "${YELLOW}🌐 Setting up Azure Web App...${NC}"

if ! az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}Creating Web App: $APP_NAME${NC}"
    az webapp create \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --plan $PLAN_NAME \
        --runtime "NODE:20-lts"
else
    echo -e "${GREEN}✅ Web App $APP_NAME already exists${NC}"
fi

# Configure environment variables
echo -e "${YELLOW}⚙️ Setting environment variables...${NC}"

az webapp config appsettings set \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings \
        NODE_ENV=production \
        PORT=8000 \
        SCM_DO_BUILD_DURING_DEPLOYMENT=true \
        ENABLE_ORYX_BUILD=true \
        DATABASE_URL="postgresql://postgres:KiUseCaseTest2024!@ki-usecase-db.postgres.database.azure.com:5432/ki_usecase_explorer?sslmode=require" \
        MOCK_EMAIL_PROVIDER=true

# Deploy the application
echo -e "${YELLOW}📦 Deploying application...${NC}"

cd .wasp/build/server

# Create a deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
zip -r ../server-deploy.zip . -x "node_modules/*" ".git/*"

# Deploy using ZIP
echo -e "${YELLOW}🚀 Uploading and deploying...${NC}"
az webapp deployment source config-zip \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --src ../server-deploy.zip

cd ../../../

# Get the app URL
echo -e "${YELLOW}🔍 Getting application URL...${NC}"
APP_URL=$(az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query defaultHostName -o tsv)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Backend deployment successful!${NC}"
    echo -e "${GREEN}✅ Backend deployed successfully${NC}"
    echo -e "${BLUE}🌐 Backend URL: https://$APP_URL${NC}"
    echo -e "${BLUE}📊 Azure Portal: https://portal.azure.com/#resource/subscriptions/$(az account show --query 'id' -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$APP_NAME${NC}"
    
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo -e "   1. Configure frontend to use backend URL: https://$APP_URL"
    echo -e "   2. Run: ./scripts/configure-frontend-backend.sh https://$APP_URL"
    echo -e "   3. Redeploy frontend: npm run deploy:azure"
else
    echo -e "${RED}❌ Backend deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}🚀 Backend deployment completed!${NC}"
