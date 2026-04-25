import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'systemMetric',
  title: 'System Metric',
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
      name: 'metricType',
      title: 'Metric Type',
      type: 'string',
      options: {
        list: [
          { title: 'CPU', value: 'cpu' },
          { title: 'Memory', value: 'memory' },
          { title: 'Disk', value: 'disk' },
          { title: 'Network', value: 'network' },
          { title: 'Response Time', value: 'response_time' },
          { title: 'Error Rate', value: 'error_rate' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'number',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Normal', value: 'normal' },
          { title: 'Warning', value: 'warning' },
          { title: 'Critical', value: 'critical' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'thresholds',
      title: 'Thresholds',
      type: 'object',
      fields: [
        {
          name: 'warning',
          title: 'Warning Threshold',
          type: 'number',
        },
        {
          name: 'critical',
          title: 'Critical Threshold',
          type: 'number',
        },
      ],
    }),
    defineField({
      name: 'metadata',
      title: 'Additional Metadata',
      type: 'object',
      fields: [
        {
          name: 'hostname',
          title: 'Hostname',
          type: 'string',
        },
        {
          name: 'environment',
          title: 'Environment',
          type: 'string',
        },
        {
          name: 'version',
          title: 'Application Version',
          type: 'string',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'metricType',
      subtitle: 'timestamp',
      metricValue: 'value',
      unit: 'unit',
      status: 'status',
    },
    prepare(selection) {
      const { title, subtitle, metricValue, unit, status } = selection;
      return {
        title: `${title} - ${metricValue}${unit}`,
        subtitle: `${new Date(subtitle).toLocaleString()} - Status: ${status}`,
      };
    },
  },
});
