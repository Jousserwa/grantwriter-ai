import { PrismaClient } from "@prisma/client";
import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Ensure BigInt is parsed as number for standard JSON serialization
if (types && types.setTypeParser) {
  types.setTypeParser(20, (val) => parseInt(val, 10));
}

/**
 * INVENTOR NOTE: Recursive Proxy to prevent build-time crashes and handle runtime outages.
 * Optimized with path-based caching and heuristic return types.
 */
const proxyCache = new Map<string, any>();

const createRecursiveProxy = (path: string = "prisma"): any => {
  if (proxyCache.has(path)) return proxyCache.get(path);

  const dummy = () => createRecursiveProxy(`${path}()`);
  const proxy = new Proxy(dummy, {
    get: (target, prop) => {
      if (prop === 'then') return undefined;
      if (prop === 'constructor') return Object;
      
      if (typeof prop === 'string' && ['toString', 'valueOf', 'inspect'].includes(prop)) {
        return () => `[PrismaProxy ${path}.${prop}]`;
      }

      return createRecursiveProxy(`${path}.${String(prop)}`);
    },
    apply: (target, thisArg, argumentsList) => {
      const parts = path.split('.');
      const lastMethod = parts[parts.length - 1] || "";
      
      // Default return values to prevent 'map of undefined' etc. in UI
      if (lastMethod.startsWith('findMany') || lastMethod === 'groupBy') {
        return Promise.resolve([]);
      }
      if (lastMethod.startsWith('find') || 
          ['create', 'update', 'upsert', 'delete', 'deleteMany', 'updateMany', '$transaction', '$queryRaw', '$executeRaw'].some(m => lastMethod.startsWith(m))) {
        return Promise.resolve(null);
      }
      if (lastMethod === 'count') {
        return Promise.resolve(0);
      }
      return Promise.resolve(null);
    }
  });

  proxyCache.set(path, proxy);
  return proxy;
};

let _realClient: PrismaClient | null = null;
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

const getPrismaClient = (): PrismaClient => {
  // 1. Singleton Return
  if (_realClient) return _realClient;

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;

  // 2. Build-Time Resilience
  // Only fallback to proxy during build if DATABASE_URL is missing.
  if (isBuildPhase && !dbUrl) {
    return createRecursiveProxy();
  }

  // 3. Environment Check
  if (!dbUrl) {
    if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
      console.warn(">>> INVENTOR WARNING: DATABASE_URL missing in production. Operating in Proxy mode. <<<");
    }
    return createRecursiveProxy();
  }

  // 4. Client Initialization
  try {
    const isPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');
    
    const clientConfig: any = {
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    };

    // OPTIMIZATION: Use PG Driver adapter for optimized connection pooling in serverless/Vercel
    if (isPostgres) {
      const pool = new Pool({ 
        connectionString: dbUrl,
        max: process.env.NODE_ENV === 'production' ? 10 : 2,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
      
      pool.on('error', (err) => {
        console.error('>>> INVENTOR: Unexpected error on idle PG pool client <<<', err);
      });

      clientConfig.adapter = new PrismaPg(pool);
    }

    _realClient = new PrismaClient(clientConfig);
    return _realClient;
  } catch (e) {
    console.error(">>> INVENTOR CRITICAL: PrismaClient initialization failed. <<<", e);
    return createRecursiveProxy();
  }
};

/**
 * EXPORTED SMART PROXY:
 * Lazily evaluates the client on every access.
 */
const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    // Optimization: Skip proxying for internal JS symbols or common properties
    if (typeof prop === 'symbol' || prop === '$$typeof') {
      return (target as any)[prop];
    }

    const client = getPrismaClient();
    return (client as any)[prop];
  }
});

// HMR Support for Development
if (process.env.NODE_ENV !== "production") {
  if (!(globalThis as any).prisma) {
    (globalThis as any).prisma = prisma;
  }
}

export default prisma;
export { prisma };
