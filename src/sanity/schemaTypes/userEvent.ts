import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'userEvent',
  title: 'User Event',
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
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Page View', value: 'page_view' },
          { title: 'Button Click', value: 'button_click' },
          { title: 'Form Submit', value: 'form_submit' },
          { title: 'Download', value: 'download' },
          { title: 'Purchase', value: 'purchase' },
          { title: 'Error', value: 'error' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'eventName',
      title: 'Event Name',
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
      name: 'url',
      title: 'URL',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'metadata',
      title: 'Additional Metadata',
      type: 'object',
      fields: [
        {
          name: 'buttonId',
          title: 'Button ID',
          type: 'string',
        },
        {
          name: 'formName',
          title: 'Form Name',
          type: 'string',
        },
        {
          name: 'downloadType',
          title: 'Download Type',
          type: 'string',
        },
        {
          name: 'purchaseAmount',
          title: 'Purchase Amount',
          type: 'number',
        },
      ],
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'eventName',
      subtitle: 'timestamp',
      eventType: 'eventType',
      url: 'url',
    },
    prepare(value) {
      const { title, subtitle, eventType, url } = value;
      return {
        title: title || 'Unknown Event',
        subtitle: `${new Date(subtitle).toLocaleString()} - ${eventType} on ${url}`,
      };
    },
  },
});
