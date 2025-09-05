// src/stores/bookStore.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { BookData, BookWithId } from '../types';

export const useBookStore = defineStore('book', () => {
  const books = ref<BookWithId[]>([]);
  const filter = ref<'all' | 'paper' | 'ebook' | 'lent' | 'returned'>('all');
  const storageKey = 'book-list';

  // リストID
  const nextId = computed((): number => {
    if (books.value.length === 0) return 1;
    return Math.max(...books.value.map(book => book.id)) + 1;
  });

  // 書籍を追加
  function addBook(book: BookWithId) {
    const newBook: BookWithId = {
      ...book,
      id: nextId.value,
    };
    books.value.unshift(newBook);
    saveToStorage();
  }

  // 選択した書籍を追加
  function addSelectedBooks(bookList: BookData[]) {
    for (const book of bookList) {
      books.value.unshift({
        id: nextId.value,
        title: book.title,
        authors: book.authors,
        date: book.date,
        image: book.image,
        lentStatus: book.lentStatus,
        isbn: book.isbn,
        seriesName: book.seriesName,
      });
    }
    saveToStorage();
  }

  // ローカルストレージから書籍データを読み込む
  function loadFromStorage() {
    const data = localStorage.getItem(storageKey);
    if (data) {
      books.value = JSON.parse(data);
    }
  }

  // ローカルストレージ更新
  function saveToStorage() {
    localStorage.setItem(storageKey, JSON.stringify(books.value));
  }

  // 書籍データ更新
  function updateBook(updatedBook: BookWithId) {
    const index = books.value.findIndex(book => book.id === updatedBook.id);
    if (index !== -1) {
      books.value[index] = { ...books.value[index], ...updatedBook };
      saveToStorage();
    }
  }

  // 書籍データ削除
  function deleteBook(id: number) {
    books.value = books.value.filter(book => book.id !== id);
    saveToStorage();
  }

  // シリーズ名を一括更新
  function updateSeriesName(oldSeries: string, newSeries: string) {
    books.value.forEach(book => {
      if (book.seriesName === oldSeries) {
        book.seriesName = newSeries;
      }
    });
    saveToStorage();
  }

  // 著者名を一括更新
  function updateAuthor(oldAuthor: string, newAuthor: string) {
    books.value = books.value.map(book => {
      const targetAuthor = book.authors.map(author => {
        if (author === oldAuthor) {
          return newAuthor;
        }
        return author;
      });
      return { ...book, authors: targetAuthor };
    });
    saveToStorage();
  }

  function reset() {
    localStorage.removeItem(storageKey);
    location.reload();
  }

  return {
    books,
    filter,
    storageKey,
    nextId,
    addBook,
    addSelectedBooks,
    loadFromStorage,
    saveToStorage,
    updateBook,
    deleteBook,
    updateSeriesName,
    updateAuthor,
    reset,
  };
});
