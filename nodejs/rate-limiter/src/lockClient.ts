export abstract class LockClient {
    protected _isLocked: boolean;

    constructor() {
        this._isLocked = false;
    }

    abstract _lock(time: number): Promise<boolean> | boolean;
    abstract _extend(time: number): Promise<boolean> | boolean;
    abstract _unlock(): Promise<void> | void;

    isLocked(): boolean {
        return this._isLocked;
    }

    async acquire(time: number): Promise<boolean> {
        if (this._isLocked) {
            return false;
        }

        this._isLocked = await this._lock(time);

        return this._isLocked;
    }

    async unlock(): Promise<void> {
        this._isLocked = false;
        await this._unlock();
    }

    async extend(time: number): Promise<boolean> {
        if (!this._isLocked) {
            return false;
        }

        this._isLocked = await this._extend(time);

        return this._isLocked;
    }
}
