import React from "react";

function Hero() {
  return (
    <div className="relative min-h-[60vh] w-full flex items-center pt-20 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating circles */}
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-secondary/5 rounded-full animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-16 h-16 bg-primary/3 rounded-full animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        ></div>

        {/* Small floating dots */}
        <div
          className="absolute top-1/3 left-1/3 w-2 h-2 bg-primary/20 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-secondary/30 rounded-full animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-2/3 left-1/2 w-1 h-1 bg-primary/40 rounded-full animate-bounce"
          style={{ animationDuration: "2.5s", animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-secondary/25 rounded-full animate-bounce"
          style={{ animationDuration: "3.5s", animationDelay: "1s" }}
        ></div>

        {/* Geometric shapes */}
        <div
          className="absolute top-1/4 right-1/4 w-8 h-8 border border-primary/10 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-6 h-6 border border-secondary/15 rotate-45 animate-spin"
          style={{ animationDuration: "25s", animationDirection: "reverse" }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-4xl">
          {/* Main heading with enhanced animation */}
          <div className="relative">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-primary/80 bg-clip-text text-transparent animate-in slide-in-from-bottom-8 duration-1200">
              Advance Your Knowledge
            </h1>
            <h1 className="text-4xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary/80 via-primary to-foreground bg-clip-text text-transparent animate-in slide-in-from-bottom-8 duration-1200 delay-200">
              with Fermi
            </h1>

            {/* Decorative accent line */}
            <div className="w-32 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-transparent rounded-full animate-in slide-in-from-left-8 duration-1000 delay-400 mb-6"></div>
          </div>

          {/* Enhanced description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-in slide-in-from-bottom-6 duration-1000 delay-500 leading-relaxed max-w-3xl">
            Explore expert-led courses in{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-semibold">
              Quantum Computing
            </span>
            ,{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-semibold">
              Machine Learning
            </span>
            ,{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-semibold">
              Software Engineering
            </span>
            , and{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-semibold">
              Computer Science
            </span>{" "}
            designed to accelerate your learning and career.
          </p>

          {/* Call to action with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-4 duration-1000 delay-700">
            <button className="px-8 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-semibold rounded-lg hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Explore Courses
            </button>
            <button className="px-8 py-3 border border-primary/30 text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Floating tech icons with enhanced positioning and animations */}
      {/* Computer Icon */}
      <div
        className="absolute opacity-15 animate-float"
        style={{
          bottom: "15%",
          left: "12%",
          animationDuration: "8s",
          filter: "blur(0.5px)",
        }}
      >
        <svg
          className="w-12 h-12 text-primary/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="4" width="18" height="14" rx="2" strokeWidth="1.5" />
          <path d="M8 20h8M12 16v4" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Database Icon */}
      <div
        className="absolute opacity-15 animate-float"
        style={{
          top: "20%",
          right: "15%",
          animationDuration: "9s",
          animationDelay: "1s",
          filter: "blur(0.5px)",
        }}
      >
        <svg
          className="w-10 h-10 text-primary/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <ellipse cx="12" cy="7" rx="8" ry="3.5" strokeWidth="1.5" />
          <path
            d="M4 7v7c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5V7"
            strokeWidth="1.5"
          />
          <path
            d="M4 14c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Qubit Icon */}
      <div
        className="absolute opacity-15 animate-float"
        style={{
          top: "35%",
          right: "25%",
          animationDuration: "7s",
          animationDelay: "0.5s",
          filter: "blur(0.5px)",
        }}
      >
        <svg
          className="w-9 h-9 text-primary/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="7" strokeWidth="1.5" />
          <path d="M12 5v14M5 12h14" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* Machine Learning Icon */}
      <div
        className="absolute opacity-15 animate-float"
        style={{
          bottom: "25%",
          right: "30%",
          animationDuration: "10s",
          animationDelay: "0.8s",
          filter: "blur(0.5px)",
        }}
      >
        <svg
          className="w-9 h-9 text-primary/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="5" y="13" width="2.5" height="6" rx="1" strokeWidth="1.5" />
          <rect
            x="10.75"
            y="9"
            width="2.5"
            height="10"
            rx="1"
            strokeWidth="1.5"
          />
          <rect
            x="16.5"
            y="5"
            width="2.5"
            height="14"
            rx="1"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}

export default Hero;
