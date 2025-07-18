import { PortableTextComponents } from "@portabletext/react";
import React from "react";

export const lessonPortableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-bold mt-8 mb-4 text-primary/90 tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-semibold mt-8 mb-4 text-primary/80 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-primary/70">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-4 mb-2 text-primary/60">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-relaxed text-foreground mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 text-base text-foreground mb-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 text-base text-foreground mb-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-1">{children}</li>,
    number: ({ children }) => <li className="ml-1">{children}</li>,
  },
  types: {
    code: ({ value }) => (
      <pre className="bg-muted rounded-lg p-4 my-4 overflow-x-auto border">
        <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
          <span className="font-medium">{value.language || "text"}</span>
        </div>
        <code className="text-sm font-mono text-primary/90 whitespace-pre">
          {value.code}
        </code>
      </pre>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-primary">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-primary/80">{children}</em>
    ),
    code: ({ children }) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary/90">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-primary hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    ),
  },
};

export default lessonPortableTextComponents;
