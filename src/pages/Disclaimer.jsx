import LegalLayout, { H2, P, UL } from '@/components/LegalLayout';

export default function Disclaimer() {
  return (
    <LegalLayout title="Disclaimer" lastUpdated="August 26, 2026">
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-900 font-medium">
          Please read this disclaimer carefully before relying on any information in BusinessSetup.
        </p>
      </div>

      <H2>What BusinessSetup is</H2>
      <P>
        BusinessSetup is an independent information platform that provides general guidance to help you
        understand the kinds of registrations, licences, permits and requirements involved in starting a
        business.
      </P>

      <H2>What BusinessSetup is not</H2>
      <UL>
        <li><strong>BusinessSetup is not a government agency.</strong> We are not affiliated with any government or statutory body.</li>
        <li><strong>BusinessSetup is not a law firm</strong> and does not provide legal advice.</li>
        <li><strong>BusinessSetup is not a tax adviser</strong> and does not provide tax advice.</li>
        <li><strong>BusinessSetup does not provide legal, regulatory or professional advice</strong> of any kind.</li>
      </UL>

      <H2>General informational guidance only</H2>
      <P>
        All content in BusinessSetup is provided as general informational guidance only. It is not a
        substitute for professional advice or for the official requirements that apply to your specific
        situation.
      </P>

      <H2>You must verify with official authorities</H2>
      <P>
        Requirements, costs, processing times and renewal periods can change. You should always verify
        the current requirements directly with the relevant official authority before taking any action or
        making any decision.
      </P>

      <H2>No liability</H2>
      <P>
        BusinessSetup is not responsible for any decisions made based on the information provided. Your
        use of the application is at your own risk.
      </P>
    </LegalLayout>
  );
}