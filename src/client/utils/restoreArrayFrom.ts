// ServiceNow UI pages load Prototype.js, which replaces the native Array.from
// with its $A helper. $A ignores iterables (Set, Map, iterators) and the map
// callback, so libraries that rely on them (recharts, immer, redux toolkit)
// silently receive empty arrays — e.g. recharts builds an empty category axis
// and draws nothing. Put a spec-compliant Array.from back before the app runs.

type MapFn = (value: unknown, index: number) => unknown;

function arrayFrom(items: unknown, mapFn?: MapFn, thisArg?: unknown): unknown[] {
  if (items == null) {
    throw new TypeError('Array.from requires an array-like or iterable object');
  }
  const map = typeof mapFn === 'function';
  const result: unknown[] = [];
  const source = Object(items);

  // Walk the iterator by hand: a for...of loop may be down-levelled into a
  // helper that itself calls Array.from
  if (typeof source[Symbol.iterator] === 'function') {
    const iterator: Iterator<unknown> = source[Symbol.iterator]();
    let index = 0;
    for (let step = iterator.next(); !step.done; step = iterator.next()) {
      result.push(map ? mapFn!.call(thisArg, step.value, index) : step.value);
      index++;
    }
    return result;
  }

  const length = Math.max(0, Math.min(Math.floor(Number(source.length)) || 0, Number.MAX_SAFE_INTEGER));
  for (let index = 0; index < length; index++) {
    result.push(map ? mapFn!.call(thisArg, source[index], index) : source[index]);
  }
  return result;
}

const isBroken = (): boolean => {
  try {
    return Array.from(new Set([1])).length !== 1 || Array.from({ length: 1 }, () => 2)[0] !== 2;
  } catch {
    return true;
  }
};

if (isBroken()) {
  Object.defineProperty(Array, 'from', {
    value: arrayFrom,
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

export {};
