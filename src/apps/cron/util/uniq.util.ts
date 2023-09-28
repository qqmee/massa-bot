export function uniq<T>(keyCb: (item: T) => string, ...arr: T[][]) {
  const map = new Map();

  for (const item of arr.flat()) {
    const key = keyCb(item);

    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  return [...map.values()];
}
