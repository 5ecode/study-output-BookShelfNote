import type { BookWithId } from '../types';

/* 発売日順にソート
-------------------------------------------- */
export function sortByReleaseDate(books: BookWithId[]) {
  return [...books].sort((a, b) => {
    // 8桁に揃える（足りない末尾を0で埋める）
    const dateA = (a.date ?? '').padEnd(8, '0');
    const dateB = (b.date ?? '').padEnd(8, '0');
    return dateB.localeCompare(dateA);
  });
}
