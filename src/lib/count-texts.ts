/** Texts for 0…n for CountUp, each with its own plural form (e.g. "1 služba", "3 služby", "6 služeb"). */
export function countTexts(n: number, format: (count: number) => string = String): string[] {
  return Array.from({ length: n + 1 }, (_, i) => format(i));
}
