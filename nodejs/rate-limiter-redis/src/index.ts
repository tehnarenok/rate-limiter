import Client, { RedisOptions, Redis } from 'ioredis';
import Redlock, { Lock, Options as RedLockOptions } from 'redlock';

import { LockClient, RateLimier, RateConfig, Context, Options } from '@tehdev/rate-limiter';

class LockClientRedis extends LockClient {
    private _redLock: Redlock;
    private _curerntLock?: Lock;

    private _master;

    constructor(
        redis: RedisOptions | Redis,
        masterResource: string,
        options: Partial<RedLockOptions> = {}
    ) {
        super();

        const redisClient = redis instanceof Client ? redis : new Client(redis);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this._redLock = new Redlock([redisClient], options);
        this._master = masterResource;
    }

    async _lock(time: number): Promise<boolean> {
        try {
            this._curerntLock = await this._redLock.acquire([this._master], time);

            if (this._curerntLock) {
                return true;
            }

            return false;
        } catch (err) {
            return false;
        }
    }

    async _extend(time: number): Promise<boolean> {
        if (!this._curerntLock) {
            return false;
        }

        try {
            this._curerntLock = await this._curerntLock.extend(time);

            if (!this._curerntLock) {
                return false;
            }

            return true;
        } catch (err) {
            return false;
        }
    }

    async _unlock(): Promise<void> {
        await this._curerntLock?.unlock();
    }
}

export type ExtendedOptions = {
    baseOptions: Partial<Options>;
    redLock: Partial<RedLockOptions>;
    masterResource: string;
    listPrefix: string;
}

export class RateLimiterRedis extends RateLimier {
    _lockClient: LockClient;

    private _redisClient: Redis;
    private _listPrefix: string;

    constructor(
        clients: Record<string, RateConfig>,
        redis: RedisOptions,
        options: Partial<ExtendedOptions> = {}
    ) {
        const {
            baseOptions,
            redLock: redLockOptions,
            masterResource = '__rate-limiter-master__',
            listPrefix = '__rate-limiter-list__'
        } = options;

        super(clients, baseOptions);

        this._lockClient = new LockClientRedis(redis, masterResource, redLockOptions);
        this._redisClient = new Client(redis);
        this._listPrefix = listPrefix;
    }

    async _getToken(client: string): Promise<boolean> {
        try {
            const value = await this._redisClient.lpop(this._listPrefix + client);

            return Boolean(value);
        } catch (err) {
            return false;
        }
    }

    async _getTokensCount(client: string): Promise<number> {
        try {
            const len = await this._redisClient.llen(this._listPrefix + client);

            return len;
        } catch (err) {
            return 0;
        }
    }

    _handleErrors(context: Context, err: unknown): void {
        // eslint-disable-next-line no-console
        console.error({
            context,
            err
        });
    }

    async _pushTokens(client: string, count: number): Promise<void> {
        await this._redisClient.rpush(this._listPrefix + client, ...new Array(count).fill('0'));
    }

    async blockWait(client: string, timeout = 0): Promise<boolean> {
        try {
            const data = await this._redisClient.blpop(this._listPrefix + client, timeout);

            return Boolean(data);
        } catch (err) {
            return false;
        }
    }
}

export { RateConfig };
export { Context };
export { Options };
