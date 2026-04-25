import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'performanceMetric',
  title: 'Performance Metric',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'loadTime',
      title: 'Load Time (ms)',
      type: 'number',
      validation: Rule => Rule.required().positive(),
    }),
    defineField({
      name: 'firstContentfulPaint',
      title: 'First Contentful Paint (ms)',
      type: 'number',
      validation: Rule => Rule.required().positive(),
    }),
    defineField({
      name: 'largestContentfulPaint',
      title: 'Largest Contentful Paint (ms)',
      type: 'number',
      validation: Rule => Rule.required().positive(),
    }),
    defineField({
      name: 'cumulativeLayoutShift',
      title: 'Cumulative Layout Shift',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'firstInputDelay',
      title: 'First Input Delay (ms)',
      type: 'number',
      validation: Rule => Rule.required().positive(),
    }),
    defineField({
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
    }),
    defineField({
      name: 'deviceType',
      title: 'Device Type',
      type: 'string',
      options: {
        list: [
          { title: 'Desktop', value: 'desktop' },
          { title: 'Mobile', value: 'mobile' },
          { title: 'Tablet', value: 'tablet' },
        ],
      },
    }),
    defineField({
      name: 'browser',
      title: 'Browser',
      type: 'string',
    }),
    defineField({
      name: 'performanceScore',
      title: 'Performance Score',
      type: 'number',
      validation: Rule => Rule.required().min(0).max(100),
    }),
  ],
  preview: {
    select: {
      title: 'url',
      subtitle: 'timestamp',
      loadTime: 'loadTime',
      performanceScore: 'performanceScore',
    },
    prepare(value) {
      const { title, subtitle, loadTime, performanceScore } = value;
      return {
        title: title || 'Unknown URL',
        subtitle: `${new Date(subtitle).toLocaleString()} - ${loadTime}ms (Score: ${performanceScore})`,
      };
    },
  },
});
