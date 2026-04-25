import { createClient, ClientConfig } from 'next-sanity';

import baseUrl from '@/lib/baseUrl';

import { apiVersion, dataset, projectId } from '../env';

const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  stega: {
    studioUrl: `${baseUrl}/studio`,
  },
};

if (process.env.SANITY_API_ADMIN_TOKEN) {
  config.token = process.env.SANITY_API_ADMIN_TOKEN;
}

export const client = createClient(config);
