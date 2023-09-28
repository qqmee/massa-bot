export const createMap = <T, K extends string, R extends Record<K, T>>(
  rows: R[],
  mapKey: keyof R,
  valueKey: keyof R,
) => {
  // TODO: fix typing
  const map = new Map<string, R[typeof valueKey]>();

  for (const row of rows) {
    if (row.hasOwnProperty(mapKey)) {
      const value = row.hasOwnProperty(valueKey) ? row[valueKey] : null;
      map.set(row[mapKey] as string, value);
    }
  }

  return map;
};
