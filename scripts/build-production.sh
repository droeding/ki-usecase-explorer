#!/bin/bash

# ================================================
# Wasp Production Build Script for Azure
# Ki Use-Case Explorer - Bechtle Edition
# ================================================

set -e

echo "🔧 Preparing Wasp project for production build..."

# Backup original files
cp main.wasp main.wasp.backup 2>/dev/null || true

# Create production main.wasp
cat > main.wasp << 'EOF'
app kiUsecaseExplorer {
  wasp: {
    version: "^0.16.7"
  },
  title: "Ki Use-Case Explorer",
  head: [
    "<meta name='description' content='Bewertungsplattform für Ki Use-Cases bei Bechtle'>"
  ],
  
  
  // Email configuration (will use MOCK_EMAIL_PROVIDER=true from .env.server)
  emailSender: {
    provider: SendGrid,
    defaultFrom: {
      name: "Ki Use-Case Platform", 
      email: "noreply@bechtle.com"
    }
  },
  
  auth: {
    userEntity: User,
    methods: {
      email: {
        fromField: {
          name: "Ki Use-Case Platform",
          email: "noreply@bechtle.com"
        },
        emailVerification: {
          clientRoute: EmailVerificationRoute
        },
        passwordReset: {
          clientRoute: PasswordResetRoute
        }
      }
    },
    onAuthFailedRedirectTo: "/login",
    onAuthSucceededRedirectTo: "/dashboard"
  }
}

// Routes and Pages  
route LandingRoute { path: "/", to: LandingPage }
page LandingPage {
  component: import { LandingPage } from "@src/pages/LandingPage",
  authRequired: false
}

route LoginRoute { path: "/login", to: LoginPage }
page LoginPage {
  component: import { LoginPage } from "@src/pages/auth/Login"
}

route SignupRoute { path: "/signup", to: SignupPage }
page SignupPage {
  component: import { SignupPage } from "@src/pages/auth/Signup"
}

route EmailVerificationRoute { path: "/email-verification", to: EmailVerificationPage }
page EmailVerificationPage {
  component: import { EmailVerificationPage } from "@src/pages/auth/EmailVerification"
}

route PasswordResetRoute { path: "/password-reset", to: PasswordResetPage }
page PasswordResetPage {
  component: import { PasswordResetPage } from "@src/pages/auth/PasswordReset"
}

route DashboardRoute { path: "/dashboard", to: DashboardPage }
page DashboardPage {
  component: import { DashboardPage } from "@src/pages/DashboardPage",
  authRequired: true
}

route UseCaseDetailRoute { path: "/usecase/:id", to: UseCaseDetailPage }
page UseCaseDetailPage {
  component: import { UseCaseDetailPage } from "@src/pages/UseCaseDetailPage",
  authRequired: true
}

route AdminRoute { path: "/admin", to: AdminPage }
page AdminPage {
  component: import { AdminPage } from "@src/pages/AdminPage",
  authRequired: true
}

route MobileDemoRoute { path: "/mobile-demo", to: MobileDemoPage }
page MobileDemoPage {
  component: import MobileDemoPage from "@src/pages/MobileDemoPage",
  authRequired: false
}

route TestRoute { path: "/test", to: TestPage }
page TestPage {
  component: import TestPage from "@src/pages/TestPage",
  authRequired: false
}

// Server Operations
query getUseCases {
  fn: import { getUseCases } from "@src/queries",
  entities: [UseCase, Evaluation]
}

query getUseCaseById {
  fn: import { getUseCaseById } from "@src/queries",
  entities: [UseCase, Evaluation]
}

query getTopUseCases {
  fn: import { getTopUseCases } from "@src/queries",
  entities: [UseCase, Evaluation, User]
}

query getUserEvaluations {
  fn: import { getUserEvaluations } from "@src/queries",
  entities: [Evaluation, UseCase]
}

action submitEvaluation {
  fn: import { submitEvaluation } from "@src/actions",
  entities: [Evaluation, User, UseCase]
}

action updateUseCase {
  fn: import { updateUseCase } from "@src/actions", 
  entities: [UseCase]
}

action deleteEvaluation {
  fn: import { deleteEvaluation } from "@src/actions",
  entities: [Evaluation]
}

action toggleFavorite {
  fn: import { toggleFavorite } from "@src/actions",
  entities: [User, UseCase]
}

// Note: Entities are now defined in schema.prisma
EOF

echo "✅ Production main.wasp created"

# Now run the production build
echo "🏗️ Running wasp build..."
wasp build

# Build succeeded, check if the build directory exists
if [ -d ".wasp/build" ]; then
    echo "✅ Wasp build completed successfully"
    echo "📁 Build directory: .wasp/build/"
    echo "🌐 Web app build: .wasp/build/web-app/build/"
    echo "⚡ Server build: .wasp/build/server/"
else
    echo "❌ Build directory not found"
    exit 1
fi

# Restore original main.wasp
if [ -f "main.wasp.backup" ]; then
    mv main.wasp.backup main.wasp
    echo "✅ Original main.wasp restored"
fi

echo "🎉 Production build ready for deployment!"
