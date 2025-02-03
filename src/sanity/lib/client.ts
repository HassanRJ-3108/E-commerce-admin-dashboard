import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export function getClient(token?: string) {
  if (token) {
    return client.withConfig({ token })
  }
  return client
}