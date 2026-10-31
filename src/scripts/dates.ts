/** 2026-10-17 → 17.10.2026, as shown in both languages. */
export function displayDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}
