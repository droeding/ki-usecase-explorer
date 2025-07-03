#!/bin/bash

# ================================================
# Azure Static Web Apps Deployment Script
# Ki Use-Case Explorer - Bechtle Edition
# ================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ki-usecase-explorer"
RESOURCE_GROUP="rg-bechtle-ai-apps"
LOCATION="westeurope"
SKU="Free"

# Environment-specific settings
ENVIRONMENT=${1:-"production"}  # Default to production if not specified
echo -e "${BLUE}🌍 Deploying to environment: $ENVIRONMENT${NC}"

echo -e "${BLUE}🚀 Azure Static Web Apps Deployment${NC}"
echo -e "${BLUE}====================================${NC}"

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}🔐 Please log in to Azure...${NC}"
    az login
fi

# Check if Node.js and npm are available
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi

# Check if Wasp is installed
if ! command -v wasp &> /dev/null; then
    echo -e "${RED}❌ Wasp is not installed. Please install it first.${NC}"
    echo "Visit: https://wasp-lang.dev/docs/quick-start"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check completed${NC}"

# Build the application for production
echo -e "${YELLOW}🔨 Building Wasp application for production...${NC}"

# Run production build script (handles PostgreSQL config)
./scripts/build-production.sh

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Wasp production build failed${NC}"
    exit 1
fi

# Build the web app for production
echo -e "${YELLOW}🌐 Building web app for production...${NC}"
cd .wasp/build/web-app
npm run build
cd ../../../

# Check if build directory exists
if [ ! -d ".wasp/build/web-app/build" ]; then
    echo -e "${RED}❌ Build directory not found. Web app build may have failed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Wasp application built successfully for production${NC}"

# Check if resource group exists, create if not
echo -e "${YELLOW}🏗️ Setting up Azure resources...${NC}"

if ! az group show --name $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}Creating resource group: $RESOURCE_GROUP${NC}"
    az group create --name $RESOURCE_GROUP --location $LOCATION
else
    echo -e "${GREEN}✅ Resource group $RESOURCE_GROUP already exists${NC}"
fi

# Check if Static Web App exists
if ! az staticwebapp show --name $APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}🌐 Creating Azure Static Web App: $APP_NAME${NC}"
    
    # Create Static Web App without GitHub integration (manual upload)
    az staticwebapp create \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --sku $SKU
        
    echo -e "${GREEN}✅ Static Web App created successfully${NC}"
else
    echo -e "${GREEN}✅ Static Web App $APP_NAME already exists${NC}"
fi

# Get deployment token
echo -e "${YELLOW}🔑 Getting deployment token...${NC}"

DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name $APP_NAME --resource-group $RESOURCE_GROUP --query "properties.apiKey" -o tsv)

if [ -z "$DEPLOYMENT_TOKEN" ]; then
    echo -e "${RED}❌ Failed to get deployment token${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployment token retrieved${NC}"

# Deploy using Static Web Apps CLI
echo -e "${YELLOW}📦 Deploying to Azure Static Web Apps...${NC}"

# Install SWA CLI if not installed
if ! command -v swa &> /dev/null; then
    echo -e "${YELLOW}Installing Azure Static Web Apps CLI...${NC}"
    npm install -g @azure/static-web-apps-cli
fi

# Deploy the application
swa deploy .wasp/build/web-app/build \
    --deployment-token $DEPLOYMENT_TOKEN

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    
    # Get the app URL
    APP_URL=$(az staticwebapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "defaultHostname" -o tsv)
    
    echo -e "${GREEN}✅ Application deployed successfully${NC}"
    echo -e "${BLUE}🌐 URL: https://$APP_URL${NC}"
    echo -e "${BLUE}📊 Azure Portal: https://portal.azure.com/#resource/subscriptions/$(az account show --query 'id' -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/staticSites/$APP_NAME${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}🚀 Deployment completed successfully!${NC}"
