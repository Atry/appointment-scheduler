import { makeSchema } from 'nexus'
import * as path from 'path'
import * as types from './graphql'

export const schema = makeSchema({
  types,
  outputs: {
    typegen: path.join(__dirname, '..', 'nexus-typegen.ts'),
    schema: path.join(__dirname, '..', 'schema.graphql'),
  },
  sourceTypes: {
    modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
  },
  contextType: {
    module: path.join(__dirname, 'context.ts'),
    export: 'Context',
  },
})
