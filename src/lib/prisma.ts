import { PrismaClient } from "@prisma/client";

const createRecursiveProxy = (): any => {
  const dummy = () => createRecursiveProxy();
  return new Proxy(dummy, {
    get: (target, prop) => {
      if (prop === 'then') return undefined;
      if (prop === 'constructor') return Object;
      // Ensure we don't crash on standard object methods
      if (typeof prop === 'string' && ['toString', 'valueOf', 'inspect'].includes(prop)) {
        return () => `[PrismaProxy ${prop}]`;
      }
      return createRecursiveProxy();
    },
    apply: (target, thisArg, argumentsList) => {
      // If it looks like a findMany or similar, return an empty array
      return Promise.resolve([]);
    }
  });
};

const prismaClientSingleton = () => {
  // Next.js build-time check
  if (typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.warn(">>> INVENTOR LOG: Build phase detected, using Proxy to prevent initialization crash <<<");
    return createRecursiveProxy();
  }

  // If DATABASE_URL is missing, we can't initialize anyway
  if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
    console.warn(">>> INVENTOR LOG: DATABASE_URL missing in production, using Proxy <<<");
    return createRecursiveProxy();
  }

  try {
    return new PrismaClient();
  } catch (e) {
    console.warn(">>> INVENTOR LOG: Prisma initialization failed, falling back to Proxy <<<");
    return createRecursiveProxy();
  }
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
export { prisma };
