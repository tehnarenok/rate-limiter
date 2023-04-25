# Node js abstract rate-limiter

This is abstract simple rate limiter for outgoing requests. Over this class you can build your implementation.

## Implementations

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
