#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyAllUsers() {
  try {
    console.log('🔍 Suche nach unverifizierte Benutzern...')
    
    // Finde alle AuthIdentity-Einträge mit E-Mail-Provider
    const authIdentities = await prisma.authIdentity.findMany({
      where: {
        providerName: 'email'
      },
      include: {
        auth: {
          include: {
            user: true
          }
        }
      }
    })

    console.log(`📋 ${authIdentities.length} E-Mail-Benutzer gefunden`)

    let verifiedCount = 0
    let alreadyVerifiedCount = 0

    for (const authIdentity of authIdentities) {
      const providerData = JSON.parse(authIdentity.providerData)
      const userEmail = authIdentity.auth?.user?.email || 'Unbekannt'
      
      if (providerData.isEmailVerified === true) {
        console.log(`✅ ${userEmail} - bereits verifiziert`)
        alreadyVerifiedCount++
      } else {
        // Setze isEmailVerified auf true
        const updatedProviderData = {
          ...providerData,
          isEmailVerified: true
        }

        await prisma.authIdentity.update({
          where: {
            providerName_providerUserId: {
              providerName: authIdentity.providerName,
              providerUserId: authIdentity.providerUserId
            }
          },
          data: {
            providerData: JSON.stringify(updatedProviderData)
          }
        })

        console.log(`🔓 ${userEmail} - wurde verifiziert`)
        verifiedCount++
      }
    }

    console.log('\n📊 Zusammenfassung:')
    console.log(`✅ Bereits verifiziert: ${alreadyVerifiedCount}`)
    console.log(`🔓 Neu verifiziert: ${verifiedCount}`)
    console.log(`📧 Gesamt Benutzer: ${authIdentities.length}`)
    
    if (verifiedCount > 0) {
      console.log('\n🎉 Alle Benutzer wurden erfolgreich verifiziert!')
    } else {
      console.log('\n✨ Alle Benutzer waren bereits verifiziert!')
    }

  } catch (error) {
    console.error('❌ Fehler beim Verifizieren der Benutzer:', error)
    throw error
  }
}

async function main() {
  console.log('🚀 Starte Benutzerverifizierung...\n')
  
  await verifyAllUsers()
  
  console.log('\n✅ Benutzerverifizierung abgeschlossen!')
}

main()
  .catch((e) => {
    console.error('💥 Unerwarteter Fehler:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 Datenbankverbindung getrennt')
  })
