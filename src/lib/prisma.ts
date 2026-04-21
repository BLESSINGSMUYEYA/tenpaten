/// <reference types="node" />
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  console.log('Creating new PrismaClient instance');
  return new PrismaClient({
    log: ['error', 'warn'],
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export default prisma
