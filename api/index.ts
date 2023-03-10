import { ApolloServer } from 'apollo-server'
import { context } from './context'
import { schema } from './schema'

const server = new ApolloServer({
  schema,
  context,
  persistedQueries: false,
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
