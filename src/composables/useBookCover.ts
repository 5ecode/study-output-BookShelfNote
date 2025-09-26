/* 表紙画像取得
-------------------------------------------- */
import { ref, reactive } from 'vue';
import { fetchBookCover } from '../composables/useRakutenApi';
import type { BookWithId } from '../types';

export function useBookCover(registeredBooks: BookWithId[], editId: number | null = null) {
  const editbookId = editId; // 編集時のみ
  const isLoading = ref(false);
  const bookCoverUrl = ref('');

  // エラー表示
  const errors = reactive({
    isbn: '',
    image: '',
    book: '',
  });

  async function searchBookCover(inputIsbn: string) {
    const isbnNum = inputIsbn.trim().toString().length;
    if (!inputIsbn.trim() || isbnNum !== 13) {
      errors.isbn = '13桁のISBNを入力してください';
      return;
    }

    if (isAlreadyAdded(inputIsbn.trim())) {
      errors.isbn = 'ISBNが登録済みの書籍と重複しています。';
      isLoading.value = false;
      return;
    }

    errors.isbn = '';
    isLoading.value = true;

    try {
      const cover = await fetchBookCover(inputIsbn);
      if(cover){
        bookCoverUrl.value = cover;
      } else {
        errors.image = 'ISBNに紐づく画像が見つかりませんでした。';
      }
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  // ISBN重複チェック
  function isAlreadyAdded(isbn: string) {
    if(editbookId){
      return registeredBooks.some(book =>
        editbookId !== book.id && book.isbn === isbn,
      );
    } else {
      return registeredBooks.some(book =>
        book.isbn === isbn,
      );
    }
  }

  function removeCover(){
    bookCoverUrl.value = '';
  }

  return {
    isLoading,
    bookCoverUrl,
    errors,
    searchBookCover,
    isAlreadyAdded,
    removeCover,
  };
}