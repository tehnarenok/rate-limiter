import { sleep } from './sleep';
import { LockClient } from './lockClient';
import { RateConfig } from './rateConfig';

export type OnChangeMaster = (isMaster: boolean) => void;

export type Options = {
    readonly lockDuration: number;
    readonly checkDelay: number;
    readonly switchMasterDelay: number;
}

export type RunOptions = {
    onChangeMaster: OnChangeMaster;
}

export type WaitOptions = {
    timeout: number;
    stepBase: number;
    maxStepPow: number;
    expBase: number;
    startExpPow: number;
}

export enum Context {
    ADD_TOKENS,
    TRY_LOCK,
    RE_LOCK
}

const DEFAULT_OPTIONS: Options = {
    lockDuration: 1000,
    checkDelay: 1000,
    switchMasterDelay: 1000
};

export abstract class RateLimier {
    abstract _lockClient: LockClient;

    protected readonly _options: Options;

    private _intervalsIds: Record<string, NodeJS.Timer> = {};
    private _tryLockInterval?: NodeJS.Timer;
    private _clients: Record<string, RateConfig>;
    private _onChangeMaster?: OnChangeMaster;

    constructor(clients: Record<string, RateConfig>, options: Partial<Options> = {}) {
        this._clients = clients;

        this._options = {
            ...DEFAULT_OPTIONS,
            ...options
        };
    }

    abstract _handleErrors(context: Context, err: unknown): void;
    abstract _getToken(client: string): Promise<boolean> | boolean;
    abstract _getTokensCount(client: string): Promise<number> | number;
    abstract _pushTokens(client: string, count: number): Promise<void> | void;

    /**
     * Handle change master
     * @param isMaster "true" when this instance is master now
     */
    private _changeMaster(isMaster: boolean): void {
        this._onChangeMaster?.(isMaster);

        if (isMaster) {
            setTimeout(
                () => {
                    if (this._lockClient.isLocked()) {
                        this._registerClients();
                    }
                },
                this._options.switchMasterDelay
            );
        } else {
            this._unRegisterClients();
        }
    }

    /**
     * Try setting master for this instance
     * @returns "true" if this instance is master
     */
    private async _tryLock(): Promise<boolean> {
        if (this._lockClient.isLocked()) {
            return true;
        }

        try {
            const isLocked = await this._lockClient.acquire(this._options.lockDuration);

            if (!isLocked) {
                return false;
            }

            this._changeMaster(true);

            const intervalId = setInterval(
                async () => {
                    try {
                        const isLocked = await this._lockClient.extend(this._options.lockDuration);

                        if (!isLocked) {
                            clearInterval(intervalId);
                            this._changeMaster(false);
                        }
                    } catch (err) {
                        clearInterval(intervalId);
                        this._changeMaster(false);

                        this._handleErrors(Context.RE_LOCK, err);
                    }
                }
            );

            return true;
        } catch (err) {
            this._handleErrors(Context.TRY_LOCK, err);
            return false;
        }
    }

    /**
     * Add tokens for bucket per client
     * @param client client name
     * @param count count of requested quota
     */
    private async _addTokens(client: string, count = 0): Promise<void> {
        if (!(this._lockClient.isLocked() && this._clients[client])) {
            return;
        }

        try {
            const lenght = await this._getTokensCount(client);
            const currentRate = this._clients[client].getCurrentRate().rate;

            const maxCountForAdd = Math.max(currentRate - lenght, 0);
            const countForAdd = count ? Math.min(maxCountForAdd, count) : maxCountForAdd;

            await this._pushTokens(client, countForAdd);
        } catch (err) {
            this._handleErrors(Context.ADD_TOKENS, err);
        }
    }

    /**
     * Putting quota per client
     * @param client client name
     */
    private _registerClient(client: string): void {
        if (!this._clients[client]) {
            return;
        }

        this._intervalsIds[client] = setInterval(
            () => this._addTokens(client),
            this._clients[client].getWindow()
        );
    }

    /**
     * Register functions that putting quota per client
     */
    private _registerClients(): void {
        Object.keys(this._clients).forEach(client => this._registerClient(client));
    }

    /**
     * Clear intervals that putting quota per client
     */
    private _unRegisterClients(): void {
        Object.keys(this._clients).forEach(
            client => this._intervalsIds[client] && clearInterval(this._intervalsIds[client])
        );
    }

    /**
     * Unlock lock if this instance master
     */
    async unLock(): Promise<void> {
        await this._lockClient.unlock();
    }

    /**
     * Run rate limiter server (this server put quota per clients)
     * @param options.onChangeMaster callback when master changed
     */
    async run(options: Partial<RunOptions> = {}): Promise<void> {
        if (this._tryLockInterval) {
            return;
        }

        this._onChangeMaster = options.onChangeMaster;

        await this._tryLock();

        this._tryLockInterval = setInterval(() => this._tryLock(), this._options.checkDelay);
    }

    /**
     * Stop rate-limiter server
     */
    async stop(): Promise<void> {
        this._tryLockInterval && clearInterval(this._tryLockInterval);

        this._unRegisterClients();
        await this._lockClient.unlock();
    }

    /**
     * Not blocking waiting for quota
     * @param client client name for quota
     * @param options options for calculate sleep time
     * Next sleep time = expBase ** (currentPow + 1) * stepBase
     * After every cycle currentPow incerementing
     * @returns "true" when has quota per 1 request or "false"
     */
    async wait(client: string, options: Partial<WaitOptions> = {}): Promise<boolean> {
        const {
            timeout = 0,
            stepBase = 10,
            maxStepPow,
            expBase = 2,
            startExpPow = 6
        } = options;

        const startTime = Date.now();

        let expPow = startExpPow;

        do {
            try {
                const hasToken = await this._getToken(client);

                if (hasToken) {
                    return true;
                }
            } catch {
                return false;
            }

            await sleep(Math.pow(expBase, expPow) * stepBase);

            if (maxStepPow && expPow + 1 <= maxStepPow) {
                expPow += maxStepPow;
            }
        // eslint-disable-next-line no-unmodified-loop-condition
        } while (!timeout || Date.now() - startTime < timeout);

        return false;
    }

    /**
     * Check for free quota and if exists use this quota (1 request)
     * @param client client name for quota
     * @returns "true" when has quota per 1 request or "false"
     */
    async get(client: string): Promise<boolean> {
        const result = await this._getToken(client);

        return result;
    }
}

export { RateConfig };
export { LockClient };
