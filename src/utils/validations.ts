/* バリデーション関数
-------------------------------------------- */
import type { BookData } from '../types';

interface errors {
  isbn?: string,
  image?: string,
  book?: string,
  title?: string,
  date?: string,
}

export function validate(form: BookData, errors: errors) {
  let isValid = true;

  // 書籍名（必須）
  if (!form.title.trim()) {
    errors.title = '書籍名は必須です。';
    isValid = false;
  } else {
    errors.title = '';
  }

  // 発売日（形式チェック）
  if (form.date && !/^\d{4}(\d{2})?(\d{2})?$/.test(form.date)) {
    errors.date = '日付は「20250101」の形式で入力してください。';
    isValid = false;
  } else {
    errors.date = '';
  }

  return isValid;
}