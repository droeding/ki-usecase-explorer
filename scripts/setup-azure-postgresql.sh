#!/bin/bash

# ================================================
# Azure PostgreSQL Setup for Ki Use-Case Explorer
# ================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
RESOURCE_GROUP="rg-bechtle-ai-apps"
LOCATION="westeurope"
DB_SERVER_NAME="ki-usecase-db-server"
DB_NAME="ki_usecase_explorer"
DB_ADMIN_USER="dbadmin"
DB_ADMIN_PASSWORD="KiUseCase2024!"

echo -e "${BLUE}🗄️ Setting up Azure PostgreSQL for Ki Use-Case Explorer${NC}"
echo -e "${BLUE}=================================================${NC}"

# Check if resource group exists
if ! az group show --name $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}Creating resource group: $RESOURCE_GROUP${NC}"
    az group create --name $RESOURCE_GROUP --location $LOCATION
fi

# Check if PostgreSQL server exists
if ! az postgres server show --name $DB_SERVER_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}🔧 Creating PostgreSQL server: $DB_SERVER_NAME${NC}"
    
    az postgres server create \
        --resource-group $RESOURCE_GROUP \
        --name $DB_SERVER_NAME \
        --location $LOCATION \
        --admin-user $DB_ADMIN_USER \
        --admin-password $DB_ADMIN_PASSWORD \
        --sku-name GP_Gen5_2 \
        --version 11 \
        --storage-size 5120
        
    echo -e "${GREEN}✅ PostgreSQL server created${NC}"
else
    echo -e "${GREEN}✅ PostgreSQL server already exists${NC}"
fi

# Configure firewall to allow Azure services
echo -e "${YELLOW}🔥 Configuring firewall rules...${NC}"
az postgres server firewall-rule create \
    --resource-group $RESOURCE_GROUP \
    --server $DB_SERVER_NAME \
    --name "AllowAzureServices" \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 0.0.0.0

# Create database
echo -e "${YELLOW}📊 Creating database: $DB_NAME${NC}"
az postgres db create \
    --resource-group $RESOURCE_GROUP \
    --server-name $DB_SERVER_NAME \
    --name $DB_NAME

# Output connection string
echo -e "${GREEN}🎉 PostgreSQL setup completed!${NC}"
echo -e "${BLUE}Connection Details:${NC}"
echo -e "Server: ${DB_SERVER_NAME}.postgres.database.azure.com"
echo -e "Database: ${DB_NAME}"
echo -e "Username: ${DB_ADMIN_USER}@${DB_SERVER_NAME}"
echo -e "Password: ${DB_ADMIN_PASSWORD}"
echo ""
echo -e "${YELLOW}DATABASE_URL for .env.server:${NC}"
echo "DATABASE_URL=\"postgresql://${DB_ADMIN_USER}@${DB_SERVER_NAME}:${DB_ADMIN_PASSWORD}@${DB_SERVER_NAME}.postgres.database.azure.com:5432/${DB_NAME}?sslmode=require\""
