import { defineType, defineField } from "sanity";

export const lessonType = defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "URL of the lesson video",
    }),
    defineField({
      name: "loomUrl",
      title: "Loom Share URL",
      type: "url",
      description: "URL of the Loom video for this lesson",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;

          try {
            const url = new URL(value);
            if (!url.hostname.endsWith("loom.com")) {
              return "Loom URL must be a valid Loom link";
            }

            if (!url.pathname.startsWith("/share/")) {
              return "Must be Loom Share URL";
            }
            const videoId = url.pathname.split("/share/")[1];
            if (!/^[a-f0-9]{32,36}/.test(videoId)) {
              return "Invalid Loom video ID in url";
            }
            return true;
          } catch (error) {
            throw error;
          }
        }),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }, { type: "code" }],
    }),
  ],
});
