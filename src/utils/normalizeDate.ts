/* 発売日の正規化
-------------------------------------------- */
export function normalizeDate(dateStr: string | undefined): number {
  if (!dateStr) return 0; // 発売日がないものは最も古い扱い（逆は 99999999）
  return Number(dateStr.padEnd(8, '0'));
}