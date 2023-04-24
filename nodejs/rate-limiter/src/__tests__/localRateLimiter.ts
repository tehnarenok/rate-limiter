import { Context, LockClient, RateConfig, RateLimier } from '..';

import { LocalLockClient } from './localLockClient';

export class LocalRateLimiter extends RateLimier {
    private _tokens: Record<string, string[]>;

    _lockClient: LockClient = new LocalLockClient();

    constructor(clients: Record<string, RateConfig>) {
        super(clients, {
            switchMasterDelay: 0
        });

        this._tokens = Object.fromEntries<string[]>(
            Object.keys(clients).map(client => (
                [client, []]
            ))
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
        this._tokens[client]?.push(...new Array(count).fill('0'));
    }
}
