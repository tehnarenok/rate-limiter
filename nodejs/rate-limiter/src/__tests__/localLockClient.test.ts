import { sleep } from '../sleep';

import { LocalLockClient } from './localLockClient';

describe('Test lock client', () => {
    it('on create lock is not locked', () => {
        const lock = new LocalLockClient();

        expect(lock.isLocked()).toBe(false);
    });

    it('lock and unlock', async () => {
        const lock = new LocalLockClient();

        const isLocked = await await lock.acquire(10000);

        expect(isLocked).toBe(true);
        expect(lock.isLocked()).toBe(true);

        lock.unlock();

        expect(lock.isLocked()).toBe(false);
    });

    it('unlock after time', async () => {
        const lock = new LocalLockClient();

        await lock.acquire(100);

        expect(lock.isLocked()).toBe(true);

        await sleep(150);

        expect(lock.isLocked()).toBe(false);
    });

    it('extend lock', async () => {
        const lock = new LocalLockClient();

        await lock.acquire(500);

        expect(lock.isLocked()).toBe(true);

        await sleep(250);

        const isLocked = await lock.extend(500);

        expect(isLocked).toBe(true);
        expect(lock.isLocked()).toBe(true);

        await sleep(510);

        expect(lock.isLocked()).toBe(false);
    });

    it('unlock not locked', async () => {
        const lock = new LocalLockClient();

        await expect(lock.unlock()).resolves.not.toThrowError();
    });

    it('lock locked resource', async () => {
        const lock = new LocalLockClient();

        await lock.acquire(500);

        const secondLock = new LocalLockClient();

        const isLocked = await secondLock.acquire(500);

        expect(lock.isLocked()).toBe(true);
        expect(isLocked).toBe(false);
        expect(secondLock.isLocked()).toBe(false);
    });
});
