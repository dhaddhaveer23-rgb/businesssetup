import LegalLayout, { H2, P, UL } from '@/components/LegalLayout';

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="August 23, 2026">
      <P>
        These Terms of Service govern your use of BusinessSetup. By creating an account or using the
        application, you agree to these terms.
      </P>

      <H2>Use of the service</H2>
      <UL>
        <li>You agree to provide accurate information when using the wizard and saving businesses.</li>
        <li>You are responsible for keeping your account credentials secure.</li>
        <li>You may not misuse the service or attempt to access another user's data.</li>
      </UL>

      <H2>Your account</H2>
      <P>
        You can create an account, save multiple businesses, and manage your profile. You may delete your
        saved businesses at any time.
      </P>

      <H2>Informational content only</H2>
      <P>
        BusinessSetup provides general informational guidance about starting a business. The content is
        not legal, tax or professional advice. Please review our Disclaimer for full details.
      </P>

      <H2>Limitation of liability</H2>
      <P>
        BusinessSetup is provided on an "as is" basis. We are not liable for decisions made based on the
        information provided in the app. You are responsible for verifying requirements with the relevant
        official authorities before acting.
      </P>

      <H2>Changes to these terms</H2>
      <P>
        We may update these terms from time to time. We will reflect the last updated date above. Continued
        use of the service after changes constitutes acceptance of the updated terms.
      </P>

      <H2>Contact</H2>
      <P>If you have questions about these terms, please reach out via the Contact page.</P>
    </LegalLayout>
  );
}