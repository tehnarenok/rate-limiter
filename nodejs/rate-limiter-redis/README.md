# Distributed redis rate limiter

This package is implementaion of an [abstract rate limiter](https://www.npmjs.com/package/@tehdev/rate-limiter)

## How use

1. Install package `npm i @tehdev/rate-limiter-redis`
2. Initialize rate limiter

```typescript
import { RateLimiterRedis, RateConfig } from "@tehdev/rate-limiter-redis";
import Redis from "ioredis";

const clients = {
  client_1: new RateConfig(10, 1000), // 10 rps for client_1
};

const redis = new Redis(redisOptions);

const rateLimiter = new RateLimiterRedis(clients, redis);
```

3. Start rate limiter server (create quota). When you run server on many instances from all instances rateLimiter will choose master node. Only this node will isue a quota to the all nodes.

```typescript
rateLimiter.run();
```

4. Use quota

```typescript
await rateLimiter.wait("client_1"); // return True when quota exists
```
