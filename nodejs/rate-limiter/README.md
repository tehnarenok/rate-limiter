# Node js abstract rate-limiter

This is abstract simple rate limiter for outgoing requests. Over this class you can build your implementation.

## Implementations

You can create your rate-limit which is inherited from `RateLimier` and you should create class which is inherited from LockClient.
You can see examples.

Ready implementations:

- [with redis](https://www.npmjs.com/package/@tehdev/rate-limiter-redis)

## Rates config

You can create configuration rate-limiter with default `rps` or with `rps` by time
  
Example:
```typescript
const rate = new RateConfig(10, 1000);

rate.addTime(20, [
    { hours: 9 },
    { hours: 11 }
]);
```
Default rps is `10` but from 9 AM to 11 AM rps is `20`

## LockClient example \[local\]

This is local impl for `LockClient`

```typescript
import { LockClient } from '@tehdev/rate-limiter';

let currentId: string | undefined;

export class LocalLockClient extends LockClient {
    private _id: string;
    private _timeoutId?: NodeJS.Timeout;

    constructor() {
        super();

        this._id = new Date().toString();
    }

    _lock(time: number): boolean {
        if (!currentId) {
            currentId = this._id;

            this._timeoutId = setTimeout(
                () => this.unlock(),
                time
            );

            return true;
        }

        return false;
    }

    _unlock(): void {
        if (currentId === this._id) {
            currentId = undefined;
            this._timeoutId && clearTimeout(this._timeoutId);
        }
    }

    _extend(time: number): boolean {
        this._timeoutId && clearTimeout(this._timeoutId);

        this._timeoutId = setTimeout(
            () => this.unlock(),
            time
        );

        return true;
    }
}

```

## RateLimiter example \[local\]

You need create `LockClient` implementation

```typescript
import {
  Context,
  LockClient,
  RateConfig,
  RateLimier,
} from "@tehdev/rate-limiter";

import { LocalLockClient } from "./localLockClient";

export class LocalRateLimiter extends RateLimier {
  private _tokens: Record<string, string[]>;

  _lockClient: LockClient = new LocalLockClient();

  constructor(clients: Record<string, RateConfig>) {
    super(clients, {
      switchMasterDelay: 0,
    });

    this._tokens = Object.fromEntries<string[]>(
      Object.keys(clients).map((client) => [client, []])
    );
  }

  _getToken(client: string): boolean {
    return Boolean(this._tokens[client]?.pop());
  }

  _getTokensCount(client: string): number {
    return this._tokens[client]?.length || 0;
  }

  _handleErrors(context: Context, err: unknown): void {
    throw err;
  }

  _pushTokens(client: string, count: number): void {
    this._tokens[client]?.push(...new Array(count).fill("0"));
  }
}
```

## How use it

Create instance of `LocalRateLimiter`

```typescript
import { RateConfig } from "@tehdev/rate-limiter";

const rateLimiter = new LocalRateLimiter({
  telegram: new RateConfig(20, 1000),
});

rateLimiter.run(); // start putting quota
```

Example use this rate limiter

```typescript
import axios form 'axios';

axios.interceptors.request.use(async config => {
	const isHasQuota = await rateLimiter.wait('telegram');

	if (!isHasQuota) {
		throw new Error('No free quota for request');
	}

	return config
});
```
