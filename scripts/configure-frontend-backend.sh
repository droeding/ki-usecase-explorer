#!/bin/bash

# ================================================
# Frontend Backend Configuration Script
# Updates frontend to connect to production backend
# ================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BACKEND_URL=$1

if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}❌ Backend URL is required${NC}"
    echo "Usage: $0 \u003cbackend-url\u003e"
    echo "Example: $0 https://ki-usecase-server--abcd1234.azurecontainerapps.io"
    exit 1
fi

echo -e "${BLUE}🔧 Configuring Frontend for Production Backend${NC}"
echo -e "${BLUE}Backend URL: $BACKEND_URL${NC}"

# Update the Wasp configuration to use production backend
echo -e "${YELLOW}📝 Updating Wasp configuration...${NC}"

# Create a production environment configuration
cat > .env.client << EOF
# Production Frontend Configuration
REACT_APP_API_URL=$BACKEND_URL
REACT_APP_ENV=production
EOF

echo -e "${GREEN}✅ Frontend configuration updated${NC}"

# Update the static web app configuration for better routing
echo -e "${YELLOW}🌐 Creating Azure Static Web Apps configuration...${NC}"

mkdir -p .wasp/build/web-app/build

cat > .wasp/build/web-app/build/staticwebapp.config.json << EOF
{
  "routes": [
    {
      "route": "/api/*",
      "rewrite": "$BACKEND_URL/api/*"
    },
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "responseOverrides": {
    "401": {
      "redirect": "/login",
      "statusCode": 302
    }
  },
  "globalHeaders": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  }
}
EOF

echo -e "${GREEN}✅ Azure Static Web Apps configuration created${NC}"

echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Rebuild and redeploy frontend: npm run deploy:azure"
echo -e "   2. Test the full-stack application"

echo -e "${GREEN}🎉 Frontend configuration completed!${NC}"
