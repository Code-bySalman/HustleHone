import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
}

export default function Page() {
  return (
    <main className="mx-auto max-w-prose space-y-6 p-6">
      <h1 className="text-center text-2xl font-bold">Terms of Service</h1>
      <p className="text-center text-sm text-muted-foreground">
        Effective Date: Aug 8, 2025
      </p>

      <p>
        Welcome to HustleHone. These Terms of Service (“Terms”) govern your use
        of our website and services, including any paid subscription plans. By
        accessing or using HustleHone (“the Service”), you agree to be bound by
        these Terms. If you do not agree to these Terms, do not use the Service.
      </p>

      <h2 className="text-xl font-semibold">1. Overview</h2>
      <p>
        HustleHone is a SaaS platform that provides AI-powered resume-building
        tools, job application assistance, and smart content suggestions. We
        offer both a free tier and paid subscription plans (“Paid Plans”).
        Payments for Paid Plans are processed through Stripe, our third-party
        payment provider.
      </p>

      <h2 className="text-xl font-semibold">2. Eligibility</h2>
      <p>
        You must be at least 16 years old to use HustleHone. By using the
        Service, you represent and warrant that you meet this age requirement
        and have the legal capacity to enter into these Terms.
      </p>

      <h2 className="text-xl font-semibold">3. Account Registration</h2>
      <p>
        To access certain features, you must create an account using accurate
        and complete information. You are responsible for maintaining the
        confidentiality of your account credentials and for all activity under
        your account.
      </p>

      <h2 className="text-xl font-semibold">4. Subscription & Billing</h2>
      <p>
        Paid Plans are billed in advance on a monthly or annual basis,
        depending on your selection. Subscriptions will automatically renew
        unless canceled before the next billing cycle. All payments are
        non-refundable except where required by law.
      </p>

      <h2 className="text-xl font-semibold">5. Acceptable Use</h2>
      <p>
        You agree not to misuse the Service or assist others in doing so.
        Prohibited activities include violating applicable laws, interfering
        with Service operations, or attempting to gain unauthorized access to
        systems or accounts.
      </p>

      <h2 className="text-xl font-semibold">6. AI-Generated Content</h2>
      <p>
        HustleHone uses artificial intelligence to assist in resume creation
        and job application processes. You are solely responsible for reviewing
        and verifying the accuracy of AI-generated content before use.
      </p>

      <h2 className="text-xl font-semibold">7. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your account if you
        violate these Terms or engage in fraudulent, abusive, or unlawful
        activities.
      </p>

      <h2 className="text-xl font-semibold">8. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. The latest version will
        always be available on our website. Continued use of the Service after
        changes are posted constitutes your acceptance of the new Terms.
      </p>

      <h2 className="text-xl font-semibold">9. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at
        support@hustlehone.com.
      </p>
    </main>
  )
}
