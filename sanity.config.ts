'use client';

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schema } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({
      structure,
      // Prevent deep nesting issues
      defaultDocumentNode: (S, { schemaType }) => {
        // Use a simple document form for all types to prevent complex navigation
        return S.document().schemaType(schemaType);
      },
    }),
    presentationTool({
      previewUrl: {
        // initial: "localhost:3000",
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      allowOrigins: ['http://localhost:3000'],
    }),

    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  // Improve performance and prevent URL issues
  document: {
    // Prevent complex nested editing that can cause URL issues
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter(option => option.templateId !== 'course');
      }
      return prev;
    },
  },

  beta: {
    create: {
      startInCreateEnabled: true,
      fallbackStudioOrigin: 'fermi.sanity.studio',
    },
  },
});
