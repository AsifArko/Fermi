import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pageView',
  title: 'Page View',
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
      name: 'referrer',
      title: 'Referrer',
      type: 'string',
    }),
    defineField({
      name: 'userAgent',
      title: 'User Agent',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
      validation: Rule => Rule.required(),
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
      name: 'pageLoadTime',
      title: 'Page Load Time (ms)',
      type: 'number',
      validation: Rule => Rule.required().positive(),
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
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'browser',
      title: 'Browser',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'os',
      title: 'Operating System',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'isp',
      title: 'ISP',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'url',
      subtitle: 'timestamp',
      deviceType: 'deviceType',
      browser: 'browser',
    },
    prepare(value) {
      const { title, subtitle, deviceType, browser } = value;
      return {
        title: title || 'Unknown URL',
        subtitle: `${new Date(subtitle).toLocaleString()} - ${deviceType} (${browser})`,
      };
    },
  },
});
