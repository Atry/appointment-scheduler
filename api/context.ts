import { PrismaClient } from '@prisma/client'

export type Context = {
  prisma: PrismaClient
}

export function context(): Context {
  return {
    prisma: new PrismaClient(),
  }
}
