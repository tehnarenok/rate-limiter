export type Rate = {
    rate: number;
    window: number;
}

export type Time = {
    hours: number;
    minutes?: number;
    seconds?: number;
}

export type TimeRate = {
    time: [Time, Time],
    rate: number;
}

enum CompareResult {
    MORE = 1,
    LESS = -1,
    EQUAL = 0
}

const END_DAY_TIME: Time = {
    hours: 23,
    minutes: 59,
    seconds: 59
};

const START_DAY_TIME: Time = {
    hours: 0,
    minutes: 0,
    seconds: 0
};

const checkForInteger = (name: string, value: unknown) => {
    if (typeof value !== 'number') {
        throw new Error(`Field "${name}" must be a number`);
    } else if (Math.floor(value) !== value) {
        throw new Error(`Field "${name}" must be a integer`);
    }
};

const checkForIntervals = (name: string, value: number, interval: [number, number]) => {
    if (value < interval[0] || value > interval[1]) {
        throw new Error(`Field "${name}" should be between ${interval[0]} and ${interval[1]}`);
    }
};

export class RateConfig {
    private _default: Rate;
    private _byTime: Array<TimeRate> = [];

    constructor(rate: number, window: number) {
        this._validateRate({ rate, window });

        this._default = { rate, window };
    }

    addTime(rate: number, time: [Time, Time]): void {
        this._validateRate({ rate, window: this._default.window });
        this._validateInterval(...time);

        this._byTime.push({
            time,
            rate
        });
    }

    addTimes(rates: Array<TimeRate>): void {
        rates.forEach(({ rate, time }) => this.addTime(rate, time));
    }

    private _validateInterval(time0: Time, time1: Time): void {
        this._validateTime(time0);
        this._validateTime(time1);

        if (this._compareTimes(time0, time1) === CompareResult.EQUAL) {
            throw new Error('Times in interval must be different');
        }
    }

    private _validateTime(time: Time): void {
        const {
            hours,
            minutes = 0,
            seconds = 0
        } = time;

        checkForInteger('hours', hours);
        checkForInteger('minutes', minutes);
        checkForInteger('seconds', seconds);

        checkForIntervals('hours', hours, [0, 23]);
        checkForIntervals('minutes', minutes, [0, 59]);
        checkForIntervals('seconds', seconds, [0, 59]);
    }

    private _validateRate(rate: Rate): void {
        checkForInteger('window', rate.window);
        checkForInteger('rate', rate.rate);

        checkForIntervals('window', rate.window, [1000, NaN]);
        checkForIntervals('rate', rate.rate, [1, NaN]);
    }

    private _compareTimes(aTime: Time, bTime: Time): CompareResult {
        const {
            hours: aHours,
            minutes: aMinutes = 0,
            seconds: aSeconds = 0
        } = aTime;

        const {
            hours: bHours,
            minutes: bMinutes = 0,
            seconds: bSeconds = 0
        } = bTime;

        const pairs = [
            [aHours, bHours],
            [aMinutes, bMinutes],
            [aSeconds, bSeconds]
        ];

        for (const pair of pairs) {
            if (pair[0] > pair[1]) {
                return CompareResult.MORE;
            }

            if (pair[0] < pair[1]) {
                return CompareResult.LESS;
            }
        }

        return CompareResult.EQUAL;
    }

    private _isTimeInInterval(time: Time, interval: [Time, Time], notSplit = false): boolean {
        // случай когда интервал 23:00:00 - 9:00:00
        // в этом случае разбиваем интервал на два и проверяем что time есть в одном
        // notSplit - защита от рекурсий
        if (this._compareTimes(interval[0], interval[1]) === CompareResult.MORE) {
            if (notSplit) {
                return false;
            }

            const inFirstInterval = this._isTimeInInterval(
                time,
                [interval[0], END_DAY_TIME],
                true
            );

            const inSecondInterval = this._isTimeInInterval(
                time,
                [START_DAY_TIME, interval[1]],
                true
            );

            return inFirstInterval || inSecondInterval;
        }

        const isMoreOrEqualThanFirst = this._compareTimes(time, interval[0]) !== CompareResult.LESS;
        const isLessOrEqualThanSecond = this._compareTimes(time, interval[1]) !== CompareResult.MORE;

        return isMoreOrEqualThanFirst && isLessOrEqualThanSecond;
    }

    private _getCurrentTime(): Time {
        const date = new Date();

        return {
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds()
        };
    }

    private _findRateByTime(time?: Time): Rate {
        const currentTime = time || this._getCurrentTime();

        const timeConfig = this._byTime.find(timeConfig => {
            return this._isTimeInInterval(
                currentTime,
                timeConfig.time
            );
        });

        return timeConfig?.rate ? { ...this._default, rate: timeConfig.rate } : this._default;
    }

    getCurrentRate(): Rate {
        return this._findRateByTime();
    }

    getWindow(): number {
        return this._default.window;
    }

    getDefaultRate(): Rate {
        return { ...this._default };
    }
}
