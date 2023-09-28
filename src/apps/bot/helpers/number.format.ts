export function numberFormat(num: any) {
  return new Intl.NumberFormat().format(num);
}

export function getNumberPad(num: number): number {
  switch (true) {
    case num >= 10_000:
      return 6;

    case num >= 1_000:
      return 6;

    case num >= 100:
      return 4;

    case num >= 10:
      return 5;

    default:
      return 6;
  }
}
