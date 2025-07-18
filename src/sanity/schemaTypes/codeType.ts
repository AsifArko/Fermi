import { defineType, defineField } from "sanity";

export const codeType = defineType({
  name: "code",
  title: "Code",
  type: "object",
  fields: [
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "JavaScript", value: "javascript" },
          { title: "TypeScript", value: "typescript" },
          { title: "Python", value: "python" },
          { title: "Java", value: "java" },
          { title: "C++", value: "cpp" },
          { title: "C#", value: "csharp" },
          { title: "PHP", value: "php" },
          { title: "Ruby", value: "ruby" },
          { title: "Go", value: "go" },
          { title: "Rust", value: "rust" },
          { title: "Swift", value: "swift" },
          { title: "Kotlin", value: "kotlin" },
          { title: "HTML", value: "html" },
          { title: "CSS", value: "css" },
          { title: "SQL", value: "sql" },
          { title: "JSON", value: "json" },
          { title: "YAML", value: "yaml" },
          { title: "Markdown", value: "markdown" },
          { title: "Shell", value: "shell" },
          { title: "Plain Text", value: "text" },
        ],
      },
      initialValue: "javascript",
    }),
  ],
  preview: {
    select: {
      code: "code",
      language: "language",
    },
    prepare({ code, language }) {
      const firstLine = code?.split("\n")[0] || "";
      return {
        title: `${language || "text"}: ${firstLine.substring(0, 50)}${firstLine.length > 50 ? "..." : ""}`,
        subtitle:
          code?.split("\n").length > 1
            ? `${code.split("\n").length} lines`
            : "1 line",
      };
    },
  },
});
