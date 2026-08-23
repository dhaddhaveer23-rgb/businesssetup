import LegalLayout, { H2, P, UL } from '@/components/LegalLayout';

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="August 23, 2026">
      <P>
        This Privacy Policy explains how BusinessSetup ("we", "us") collects, uses and protects your
        information when you use our application. We are committed to handling your data responsibly and
        transparently.
      </P>

      <H2>Information we collect</H2>
      <UL>
        <li><strong>Account information:</strong> your name and email address, used to create and manage your account.</li>
        <li><strong>Business information:</strong> the businesses you save, your wizard answers, and your checklist progress.</li>
        <li><strong>Usage information:</strong> anonymous analytics about how you use the app, to help us improve it.</li>
      </UL>

      <H2>How we use your information</H2>
      <UL>
        <li>To create and manage your account.</li>
        <li>To save and display your saved businesses and checklists.</li>
        <li>To improve the application and its content.</li>
        <li>To send you service-related notifications or updates where applicable.</li>
      </UL>

      <H2>Data security</H2>
      <P>
        Your saved businesses and checklists are private to your account. Other users cannot view your
        personal data. We use industry-standard access controls to protect your information.
      </P>

      <H2>Data retention</H2>
      <P>
        We retain your account and saved business information for as long as your account is active. You
        may request deletion of your data at any time by contacting us.
      </P>

      <H2>Your rights</H2>
      <P>
        You may access, correct or request deletion of your personal information. To exercise these rights,
        please contact us through the Contact page.
      </P>

      <H2>Contact</H2>
      <P>
        If you have questions about this Privacy Policy, please reach out via the Contact page.
      </P>
    </LegalLayout>
  );
}