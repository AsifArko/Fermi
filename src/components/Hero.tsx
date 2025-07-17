import React from "react";

function Hero() {
  return (
    <div className="relative min-h-[45vh] w-full flex items-center pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55 dark:from-white/15 dark:to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-6xl font-bold mb-4 bg-gradient-to-l from-foregound to-foreground/80 bg-clip-text text-transparent">
            Advance Your Knowledge with Fermi
          </h1>
          <p className="text-sm md:text-xl text-muted-foreground mb-6">
            Explore expert-led courses in <strong>Quantum Computing</strong>,{" "}
            <strong>Machine Learning</strong>,{" "}
            <strong>Software Engineering</strong>, and{" "}
            <strong>Computer Science</strong> designed to accelerate your
            learning and career.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
