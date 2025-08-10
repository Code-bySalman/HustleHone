import { PrismaClient } from '@prisma/client';

const createPrismaClient = () => new PrismaClient();

declare global {
  var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined;
}

const prisma = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;