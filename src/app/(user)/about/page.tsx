import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - Fermi",
  description:
    "Learn more about Fermi, the online learning platform advancing knowledge in technology and science.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] w-full flex items-center pt-20 overflow-hidden bg-gradient-to-tr from-background via-background to-primary/5">
        {/* Animated Background Elements */}
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Animated Lines */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent animate-pulse"
            style={{ animationDelay: "2s", animationDuration: "4s" }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-6xl font-bold mb-4 bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000">
              About Fermi
            </h1>
            <p className="text-sm md:text-xl text-muted-foreground mb-6 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
              Empowering learners worldwide with cutting-edge technology
              education and expert-led courses.
            </p>

            {/* Animated Underline */}
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full animate-in slide-in-from-left-4 duration-1000 delay-500"></div>
          </div>
        </div>

        {/* Floating Tech Icons */}
        <div
          className="absolute top-1/4 right-1/4 opacity-10 animate-float"
          style={{ animationDuration: "6s" }}
        >
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div
          className="absolute bottom-1/4 left-1/4 opacity-10 animate-float"
          style={{ animationDelay: "3s", animationDuration: "8s" }}
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Mission Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
              <span className="text-sm font-medium text-muted-foreground">
                Our Mission
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Fermi, we believe that knowledge should be accessible to
                everyone, everywhere. Our platform is dedicated to providing
                high-quality, expert-led courses in cutting-edge technologies
                that are shaping the future. From quantum computing to machine
                learning, we are committed to helping learners advance their
                skills and accelerate their careers.
              </p>
            </div>
          </section>

          {/* What We Offer Section */}
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              What We Offer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-2">
                  Module-Based Learning
                </h3>
                <p className="text-sm text-muted-foreground">
                  Structured courses organized into logical modules with
                  real-time progress tracking and lesson completion.
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-2">
                  Multi-Platform Video
                </h3>
                <p className="text-sm text-muted-foreground">
                  Support for YouTube, Vimeo, and Loom videos with seamless
                  integration and high-quality playback.
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Integrated Stripe payment processing with secure checkout and
                  reliable transaction handling.
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-2">
                  Mobile-First Design
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fully responsive design that works perfectly on all devices,
                  from mobile phones to desktop computers.
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-2">
                  Content Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Powerful Sanity CMS for easy course creation, management, and
                  content updates with flexible structure.
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-2">
                  User Authentication
                </h3>
                <p className="text-sm text-muted-foreground">
                  Secure user authentication and authorization powered by Clerk
                  with protected routes and user management.
                </p>
              </div>
            </div>
          </section>

          {/* Our Focus Areas */}
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              Our Focus Areas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-2">
                  Quantum Computing
                </h3>
                <p className="text-sm text-muted-foreground">
                  Explore the future of computing with courses on quantum
                  algorithms, quantum mechanics, and quantum programming.
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-2">Machine Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Master AI and ML techniques, from fundamentals to advanced
                  applications in real-world scenarios.
                </p>
              </div>

              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-2">
                  Software Engineering
                </h3>
                <p className="text-sm text-muted-foreground">
                  Learn modern software development practices, architecture
                  patterns, and best practices.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Fermi */}
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              Why Choose Fermi
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-3"></div>
                <div>
                  <h3 className="font-semibold mb-2">Quality Over Quantity</h3>
                  <p className="text-muted-foreground">
                    We focus on delivering high-quality, in-depth courses rather
                    than overwhelming you with superficial content.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-3"></div>
                <div>
                  <h3 className="font-semibold mb-2">Practical Application</h3>
                  <p className="text-muted-foreground">
                    Our courses emphasize practical skills and real-world
                    applications, not just theoretical knowledge.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-3"></div>
                <div>
                  <h3 className="font-semibold mb-2">Continuous Updates</h3>
                  <p className="text-muted-foreground">
                    Course content is regularly updated to reflect the latest
                    developments and industry best practices.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-3"></div>
                <div>
                  <h3 className="font-semibold mb-2">Expert Instructors</h3>
                  <p className="text-muted-foreground">
                    Learn from professionals who are actively working in the
                    field and understand current industry challenges.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center space-y-6 py-12 border border-border rounded-lg bg-card">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              Ready to Start Learning?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of learners who are already advancing their careers
              with Fermi. Explore our courses and take the first step towards
              mastering cutting-edge technologies.
            </p>
            <div className="flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
