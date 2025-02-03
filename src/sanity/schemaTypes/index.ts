import { type SchemaTypeDefinition } from 'sanity'
import user from './user'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user],
}
