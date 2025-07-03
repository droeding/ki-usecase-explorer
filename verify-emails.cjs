const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:KiUseCaseTest2024!@ki-usecase-db.postgres.database.azure.com:5432/ki_usecase_explorer?sslmode=require"
    }
  }
});

async function verifyAllEmails() {
  try {
    console.log('🔍 Finding all email auth identities...');
    
    const identities = await prisma.authIdentity.findMany({
      where: {
        providerName: 'email'
      }
    });
    
    console.log(`📧 Found ${identities.length} email identities`);
    
    for (const identity of identities) {
      const providerData = JSON.parse(identity.providerData);
      
      if (!providerData.isEmailVerified) {
        console.log(`✉️ Verifying email: ${identity.providerUserId}`);
        
        await prisma.authIdentity.update({
          where: {
            providerName_providerUserId: {
              providerName: 'email',
              providerUserId: identity.providerUserId
            }
          },
          data: {
            providerData: JSON.stringify({
              ...providerData,
              isEmailVerified: true,
              emailVerificationSentAt: null
            })
          }
        });
        
        console.log(`✅ Email verified: ${identity.providerUserId}`);
      } else {
        console.log(`✅ Already verified: ${identity.providerUserId}`);
      }
    }
    
    console.log('🎉 All emails verified!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAllEmails();
