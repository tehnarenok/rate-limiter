import { LockClient } from '../lockClient';

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
