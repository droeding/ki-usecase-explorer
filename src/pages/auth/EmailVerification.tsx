import React from 'react';
import { VerifyEmailForm } from 'wasp/client/auth';

export function EmailVerificationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-bechtle-green">
            Ki Use-Case Explorer
          </h1>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          E-Mail-Adresse bestätigen
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Bitte prüfen Sie Ihre E-Mails und klicken Sie auf den Bestätigungslink.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <VerifyEmailForm />
        </div>
      </div>
    </div>
  );
}
