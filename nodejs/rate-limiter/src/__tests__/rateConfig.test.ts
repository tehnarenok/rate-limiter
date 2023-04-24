import { RateConfig } from '../rateConfig';

describe('rate config', () => {
    it('simple rate config', () => {
        const rate = new RateConfig(10, 1000);

        expect(rate.getWindow()).toBe(1000);

        expect(rate.getCurrentRate().rate).toBe(10);
        expect(rate.getCurrentRate().window).toBe(1000);

        expect(rate.getDefaultRate().rate).toBe(10);
        expect(rate.getDefaultRate().window).toBe(1000);
    });

    describe('rate by time', () => {
        beforeEach(() => {
            jest
                .useFakeTimers()
                .setSystemTime(new Date('2023-01-01T10:10:10'));
        });

        it('one range', () => {
            const rate = new RateConfig(10, 1000);

            rate.addTime(20, [
                { hours: 9 },
                { hours: 11 }
            ]);

            expect(rate.getCurrentRate().rate).toBe(20);
            expect(rate.getCurrentRate().window).toBe(1000);
        });

        it('range with 00:00', () => {
            jest
                .useFakeTimers()
                .setSystemTime(new Date('2023-01-01T23:00:00'));

            const rate = new RateConfig(10, 1000);

            rate.addTime(20, [
                { hours: 22 },
                { hours: 2 }
            ]);

            expect(rate.getCurrentRate().rate).toBe(20);

            jest
                .useFakeTimers()
                .setSystemTime(new Date('2023-01-01T01:00:00'));

            expect(rate.getCurrentRate().rate).toBe(20);

            jest
                .useFakeTimers()
                .setSystemTime(new Date('2023-01-01T03:00:00'));

            expect(rate.getCurrentRate().rate).toBe(10);
        });

        it('conflict range', () => {
            const rate = new RateConfig(10, 1000);

            rate.addTime(20, [
                { hours: 9 },
                { hours: 11 }
            ]);

            rate.addTime(30, [
                { hours: 8 },
                { hours: 12 }
            ]);

            expect(rate.getCurrentRate().rate).toBe(20);

            jest
                .useFakeTimers()
                .setSystemTime(new Date('2023-01-01T11:30:00'));

            expect(rate.getCurrentRate().rate).toBe(30);
        });
    });

    describe('time errors', () => {
        const rate = new RateConfig(10, 1000);

        describe('hours', () => {
            it('less 0', () => {
                expect(
                    () => rate.addTime(10, [{ hours: -1 }, { hours: 0 }])
                ).toThrow(new Error('Field "hours" should be between 0 and 23'));
            });

            it('more 23', () => {
                expect(
                    () => rate.addTime(10, [{ hours: 24 }, { hours: 0 }])
                ).toThrow(new Error('Field "hours" should be between 0 and 23'));
            });

            it('not interger', () => {
                expect(
                    () => rate.addTime(10, [{ hours: 10.3 }, { hours: 0 }])
                ).toThrow(new Error('Field "hours" must be a integer'));
            });
        });

        describe('minutes', () => {
            it('less 0', () => {
                expect(
                    () => rate.addTime(10, [{ hours: 0 }, { hours: 1, minutes: -1 }])
                ).toThrow(new Error('Field "minutes" should be between 0 and 59'));
            });

            it('more 59', () => {
                expect(
                    () => rate.addTime(10, [{ hours: 0 }, { hours: 1, minutes: 60 }])
                ).toThrow(new Error('Field "minutes" should be between 0 and 59'));
            });

            it('not interger', () => {
                expect(
                    () => rate.addTime(10, [{ hours: 0 }, { hours: 1, minutes: 10.4 }])
                ).toThrow(new Error('Field "minutes" must be a integer'));
            });
        });

        describe('seconds', () => {
            it('less 0', () => {
                expect(
                    () => rate.addTime(10, [{ hours: 0 }, { hours: 1, seconds: -1 }])
                ).toThrow(new Error('Field "seconds" should be between 0 and 59'));
            });

            it('more 59', () => {
                expect(
                    () => rate.addTime(10, [{ hours: 0 }, { hours: 1, seconds: 60 }])
                ).toThrow(new Error('Field "seconds" should be between 0 and 59'));
            });

            it('not interger', () => {
                expect(
                    () => rate.addTime(10, [{ hours: 0 }, { hours: 1, seconds: 10.4 }])
                ).toThrow(new Error('Field "seconds" must be a integer'));
            });
        });

        it('equal times', () => {
            expect(
                () => rate.addTime(10, [{ hours: 0 }, { hours: 0 }])
            ).toThrow(new Error('Times in interval must be different'));
        });
    });
});
