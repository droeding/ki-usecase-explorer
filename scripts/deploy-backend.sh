#!/bin/bash

# ================================================
# Azure Container Apps Backend Deployment Script
# Ki Use-Case Explorer - Wasp Server
# ================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ki-usecase-server"
CONTAINER_APP_NAME="ki-usecase-server"
CONTAINER_ENV_NAME="ki-usecase-env"
RESOURCE_GROUP="rg-bechtle-ai-apps"
LOCATION="westeurope"
CONTAINER_REGISTRY="kiusecaseregistry"

echo -e "${BLUE}🚀 Azure Container Apps Backend Deployment${NC}"
echo -e "${BLUE}===========================================${NC}"

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

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check completed${NC}"

# Ensure we have a fresh server build
echo -e "${YELLOW}🔨 Building Wasp server...${NC}"
if [ ! -d ".wasp/build/server" ]; then
    echo -e "${YELLOW}Building Wasp project first...${NC}"
    wasp build
fi

cd .wasp/build/server

# Create Dockerfile for the server
echo -e "${YELLOW}🐳 Creating Dockerfile...${NC}"
cat > Dockerfile << 'EOF'
FROM node:18-alpine

# Install required system dependencies
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
EOF

echo -e "${GREEN}✅ Dockerfile created${NC}"

# Create .dockerignore
cat > .dockerignore << 'EOF'
node_modules
.git
.gitignore
README.md
Dockerfile
.dockerignore
npm-debug.log
EOF

# Build and push Docker image
echo -e "${YELLOW}🏗️ Setting up Azure Container Registry...${NC}"

# Create container registry if it doesn't exist
if ! az acr show --name $CONTAINER_REGISTRY --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}Creating Azure Container Registry: $CONTAINER_REGISTRY${NC}"
    az acr create \
        --name $CONTAINER_REGISTRY \
        --resource-group $RESOURCE_GROUP \
        --sku Basic \
        --admin-enabled true
fi

# Login to ACR
echo -e "${YELLOW}🔐 Logging into Azure Container Registry...${NC}"
az acr login --name $CONTAINER_REGISTRY

# Build and push image
echo -e "${YELLOW}🐳 Building and pushing Docker image...${NC}"
IMAGE_TAG="$CONTAINER_REGISTRY.azurecr.io/$APP_NAME:latest"

docker build -t $IMAGE_TAG .
docker push $IMAGE_TAG

echo -e "${GREEN}✅ Docker image pushed successfully${NC}"

# Create Container Apps Environment
echo -e "${YELLOW}🌐 Setting up Container Apps Environment...${NC}"

if ! az containerapp env show --name $CONTAINER_ENV_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}Creating Container Apps Environment: $CONTAINER_ENV_NAME${NC}"
    az containerapp env create \
        --name $CONTAINER_ENV_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION
fi

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name $CONTAINER_REGISTRY --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $CONTAINER_REGISTRY --query passwords[0].value -o tsv)

# Deploy Container App
echo -e "${YELLOW}🚀 Deploying Container App...${NC}"

# Check if container app exists
if az containerapp show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}Updating existing Container App: $CONTAINER_APP_NAME${NC}"
    az containerapp update \
        --name $CONTAINER_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --image $IMAGE_TAG
else
    echo -e "${YELLOW}Creating new Container App: $CONTAINER_APP_NAME${NC}"
    az containerapp create \
        --name $CONTAINER_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --environment $CONTAINER_ENV_NAME \
        --image $IMAGE_TAG \
        --registry-server "$CONTAINER_REGISTRY.azurecr.io" \
        --registry-username $ACR_USERNAME \
        --registry-password $ACR_PASSWORD \
        --target-port 3001 \
        --ingress external \
        --min-replicas 1 \
        --max-replicas 3 \
        --cpu 1.0 \
        --memory 2.0Gi \
        --env-vars \
            "NODE_ENV=production" \
            "PORT=3001" \
            "DATABASE_URL=postgresql://postgres:KiUseCaseTest2024!@ki-usecase-db.postgres.database.azure.com:5432/ki_usecase_explorer?sslmode=require" \
            "MOCK_EMAIL_PROVIDER=true"
fi

# Get the app URL
echo -e "${YELLOW}🔍 Getting application URL...${NC}"
APP_URL=$(az containerapp show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Backend deployment successful!${NC}"
    echo -e "${GREEN}✅ Backend deployed successfully${NC}"
    echo -e "${BLUE}🌐 Backend URL: https://$APP_URL${NC}"
    echo -e "${BLUE}📊 Azure Portal: https://portal.azure.com/#resource/subscriptions/$(az account show --query 'id' -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/containerApps/$CONTAINER_APP_NAME${NC}"
    
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo -e "   1. Set environment variables for database connection"
    echo -e "   2. Update frontend configuration to use backend URL"
    echo -e "   3. Configure CORS settings"
else
    echo -e "${RED}❌ Backend deployment failed${NC}"
    exit 1
fi

cd ../../../
echo -e "${GREEN}🚀 Backend deployment completed!${NC}"
