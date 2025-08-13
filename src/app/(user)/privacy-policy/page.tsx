import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Fermi',
  description:
    'Read the privacy policy for Fermi, the online learning platform advancing knowledge in technology and science.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-7xl mx-auto min-h-screen relative z-10">
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative min-h-[60vh] w-full flex items-center pt-20 overflow-hidden">
          {/* Animated Lines */}
          <div className="absolute inset-0">
            <div
              className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse"
              style={{ animationDuration: '4s' }}
            ></div>
            <div
              className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent animate-pulse"
              style={{ animationDelay: '2s', animationDuration: '4s' }}
            ></div>
          </div>
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-6xl font-bold mb-4 bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000">
                Privacy Policy
              </h1>
              <p className="text-sm md:text-xl text-muted-foreground mb-6 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
                Your privacy is important to us. Learn how Fermi collects, uses,
                and protects your information.
              </p>
              {/* Animated Underline */}
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full animate-in slide-in-from-left-4 duration-1000 delay-500"></div>
            </div>
          </div>
          {/* Floating Tech Icons (optional, for extra polish) */}
          <div
            className="absolute top-1/4 right-1/4 opacity-10 animate-float"
            style={{ animationDuration: '6s' }}
          >
            {/* ...SVG icon from About page... */}
          </div>
          <div
            className="absolute bottom-1/4 left-1/4 opacity-10 animate-float"
            style={{ animationDelay: '3s', animationDuration: '8s' }}
          >
            {/* ...SVG icon from About page... */}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Introduction */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
                <span className="text-sm font-medium text-muted-foreground">
                  Introduction
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
              </div>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  This Privacy Policy explains how Fermi (&apos;we&apos;,
                  &apos;us&apos;, or &apos;our&apos;) collects, uses, discloses,
                  and safeguards your information when you use our platform. By
                  accessing or using Fermi, you agree to the terms of this
                  Privacy Policy.
                </p>
              </div>
            </section>

            {/* Information Collection */}
            <section className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Information We Collect
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-border rounded-lg bg-card">
                  <h3 className="text-lg font-semibold mb-2">
                    Personal Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    When you register, enroll in courses, or contact us, we may
                    collect information such as your name, email address,
                    payment details, and other identifiers.
                  </p>
                </div>
                <div className="p-6 border border-border rounded-lg bg-card">
                  <h3 className="text-lg font-semibold mb-2">Usage Data</h3>
                  <p className="text-sm text-muted-foreground">
                    We automatically collect information about your interactions
                    with our platform, such as pages visited, course progress,
                    device information, and IP address.
                  </p>
                </div>
              </div>
            </section>

            {/* Use of Information */}
            <section className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                How We Use Your Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-border rounded-lg bg-card">
                  <h3 className="text-lg font-semibold mb-2">
                    To Provide Services
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We use your information to operate, maintain, and improve
                    our platform, process enrollments, and deliver course
                    content.
                  </p>
                </div>
                <div className="p-6 border border-border rounded-lg bg-card">
                  <h3 className="text-lg font-semibold mb-2">To Communicate</h3>
                  <p className="text-sm text-muted-foreground">
                    We may send you updates, notifications, and respond to your
                    inquiries using your contact information.
                  </p>
                </div>
                <div className="p-6 border border-border rounded-lg bg-card">
                  <h3 className="text-lg font-semibold mb-2">For Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data helps us detect, prevent, and address technical
                    issues, fraud, and abuse.
                  </p>
                </div>
                <div className="p-6 border border-border rounded-lg bg-card">
                  <h3 className="text-lg font-semibold mb-2">
                    To Improve Fermi
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We analyze usage data to enhance our courses, features, and
                    user experience.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Cookies & Tracking Technologies
              </h2>
              <div className="p-6 border border-border rounded-lg bg-card">
                <p className="text-sm text-muted-foreground">
                  We use cookies and similar technologies to personalize your
                  experience, analyze usage, and deliver relevant content. You
                  can control cookies through your browser settings, but
                  disabling them may affect your experience.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Data Security
              </h2>
              <div className="p-6 border border-border rounded-lg bg-card">
                <p className="text-sm text-muted-foreground">
                  We implement industry-standard security measures to protect
                  your information. However, no method of transmission over the
                  Internet or electronic storage is 100% secure. We strive to
                  use commercially acceptable means to protect your data but
                  cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* Third-Party Services */}
            <section className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Third-Party Services
              </h2>
              <div className="p-6 border border-border rounded-lg bg-card">
                <p className="text-sm text-muted-foreground">
                  We may use third-party services (such as payment processors
                  and analytics providers) that collect, use, and disclose
                  information according to their own privacy policies. We
                  encourage you to review their policies.
                </p>
              </div>
            </section>

            {/* User Rights */}
            <section className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Your Rights & Choices
              </h2>
              <div className="p-6 border border-border rounded-lg bg-card">
                <p className="text-sm text-muted-foreground">
                  You have the right to access, update, or delete your personal
                  information. To exercise these rights, please contact us using
                  the information below. We will respond to your request in
                  accordance with applicable laws.
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Changes to This Policy
              </h2>
              <div className="p-6 border border-border rounded-lg bg-card">
                <p className="text-sm text-muted-foreground">
                  We may update this Privacy Policy from time to time. Changes
                  will be posted on this page with an updated effective date.
                  Your continued use of Fermi after changes are made constitutes
                  acceptance of the revised policy.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="text-center space-y-6 py-12 border border-border rounded-lg bg-card">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Contact Us
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                If you have any questions or concerns about this Privacy Policy
                or our data practices, please contact us at
                <br />
                <Link
                  href="/contact"
                  className="text-primary underline hover:text-primary/80 transition-colors"
                >
                  Contact Page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
