import { RateConfig } from '../rateConfig';
import { sleep } from '../sleep';

import { LocalRateLimiter } from './localRateLimiter';

const CLIENT = 'client';
const RATE = 10;

let rateLimiter = new LocalRateLimiter(
    { [CLIENT]: new RateConfig(RATE, 1000) }
);

describe('rate limiter', () => {
    beforeEach(async () => {
        rateLimiter = new LocalRateLimiter(
            { [CLIENT]: new RateConfig(RATE, 1000) }
        );

        rateLimiter.run();

        await sleep(1100);
    });

    afterEach(() => {
        rateLimiter.stop();
    });

    it('check run', async () => {
        const currentRps = await rateLimiter._getTokensCount(CLIENT);

        expect(currentRps).toBe(10);

        await rateLimiter.stop();
    });

    it('get all quota', async () => {
        for (let index = 0; index < RATE; index++) {
            const isFree = await rateLimiter.get(CLIENT);

            expect(isFree).toBe(true);
        }

        expect(await rateLimiter._getTokensCount(CLIENT)).toBe(0);

        await sleep(1100);

        expect(await rateLimiter._getTokensCount(CLIENT)).toBe(RATE);
    });

    it('adding to quota', async () => {
        await rateLimiter.get(CLIENT);

        expect(await rateLimiter._getTokensCount(CLIENT)).toBe(RATE - 1);

        await sleep(1100);

        expect(await rateLimiter._getTokensCount(CLIENT)).toBe(RATE);
    });

    it('wait for quota', async () => {
        for (let index = 0; index < RATE; index++) {
            const isFree = await rateLimiter.get(CLIENT);

            expect(isFree).toBe(true);
        }

        const isHasQuota = await rateLimiter.wait(CLIENT);

        expect(isHasQuota).toBe(true);
    });
});
