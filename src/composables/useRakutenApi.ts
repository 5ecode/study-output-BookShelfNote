// src/composable/useRakutenApi.ts
import type { RakutenBook, CombinedBookData } from '../types';

interface RakutenApiItem {
  title: string
  titleKana: string
  author: string
  largeImageUrl: string
  isbn: string
  salesDate: string
}

interface RakutenApiResponse {
  count: number
  page: number
  Items: { Item: RakutenApiItem }[]
}

const BASE_URL = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404';
const APP_ID = import.meta.env.VITE_RAKUTEN_APP_ID;

// データ取得
export async function fetchRakutenRaw(params: Record<string, string>): Promise<{ books: CombinedBookData[]; totalCount: number }> {
  const searchParams = new URLSearchParams({
    format: 'json',
    applicationId: APP_ID,
    outOfStockFlag: '1',
    ...params,
  });

  const res = await fetch(`${BASE_URL}?${searchParams.toString()}`);
  const data:RakutenApiResponse = await res.json();

  const searchBooks: RakutenBook[] = data.Items.map((entry) => {
    const item = entry.Item;
    return {
      title: item.title,
      titleKana: item.titleKana,
      author: item.author,
      imageUrl: item.largeImageUrl,
      isbn: item.isbn,
      salesDate: item.salesDate,
    };
  });

  const books = searchBooks.map(function(book){
    return { ...book, seriesName: addSeriesName(book.title) };
  });
  return { books, totalCount: data.count };
}

// ISBN から書籍1冊取得
export async function fetchBookByIsbn(isbn: string): Promise<CombinedBookData | null> {
  const { books } = await fetchRakutenRaw({ isbn });
  if (!books.length) return null;

  return { ...books[0] };
}

// ISBN から表紙画像だけ取得
export async function fetchBookCover(isbn: string): Promise<string | null> {
  const { books } = await fetchRakutenRaw({ isbn });
  return books[0]?.imageUrl ?? null;
}

// 書籍名からシリーズ名を生成して追加
function addSeriesName(title: string): string {
  return title.replace(/\s*(第?\d+巻|[（(]\d+[）)]|[①-⑳]|\d+)\s*$/, '').trim();
}