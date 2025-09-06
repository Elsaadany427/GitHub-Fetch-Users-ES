import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import debounce from '../../utils/debounce.js';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('delays execution and keeps last call', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 200);

    debounced('a');
    debounced('b');
    debounced('c');

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(199);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });
});
