export const getVerificationEmailContent = ({ verificationLink }: { verificationLink: string }) => {
  return {
    subject: 'Ki Use-Case Explorer - E-Mail verifizieren',
    text: `Hallo!

Willkommen beim Ki Use-Case Explorer von Bechtle!

Bitte klicken Sie auf den folgenden Link, um Ihre E-Mail-Adresse zu verifizieren:
${verificationLink}

Falls Sie sich nicht registriert haben, können Sie diese E-Mail ignorieren.

Viele Grüße
Ihr Ki Use-Case Explorer Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00B04F, #004B87); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Ki Use-Case Explorer</h1>
          <p style="color: white; margin: 5px 0;">Powered by Bechtle</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Willkommen!</h2>
          <p style="color: #666; line-height: 1.6;">
            Vielen Dank für Ihre Registrierung beim Ki Use-Case Explorer von Bechtle.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Bitte klicken Sie auf den Button unten, um Ihre E-Mail-Adresse zu verifizieren:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background: #00B04F; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              E-Mail verifizieren
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px;">
            Falls Sie sich nicht registriert haben, können Sie diese E-Mail ignorieren.
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          © 2025 Bechtle AG • Alle Rechte vorbehalten
        </div>
      </div>
    `
  }
}
