// src/types.ts

// 貸出ステータス
export type LentStatus = 'none' | 'lent' | 'returned';

// 表示モード
export type ListMode = 'view' | 'edit' | 'delete' | 'rent';

// 書籍データの共通型
export interface BookData {
  title: string;
  authors: string[];
  date: string | null;
  image: string | null;
  lentStatus: 'none' | 'lent' | 'returned';
  isbn: string | null;
  seriesName: string | null
}

// IDあり：編集や削除で使う
export interface BookWithId extends BookData {
  id: number;
}

export interface RakutenBook {
  title: string;
  author: string;
  imageUrl: string;
  isbn: string;
  salesDate: string;
}

export interface CombinedBookData extends RakutenBook {
  seriesName: string | null;
}
