/* モーダル
-------------------------------------------- */
import { useBookStore } from '../stores/bookStore';
import { ref, watch } from 'vue';
import type { BookWithId } from '../types';

export function useModal() {
  const bookStore = useBookStore();
  const showDetailModal = ref(false);
  const detailTargetBook = ref<BookWithId | null>(null);
  const modalMode = ref<'detail' | 'edit' | 'confirm-delete'>('detail');

  // 詳細モーダル開く
  function openDetailModal(book: BookWithId){
    detailTargetBook.value = book;
    modalMode.value = 'detail';
    showDetailModal.value = true;
  }

  // 編集モード切替
  function switchToEdit() {
    modalMode.value = 'edit';
  }

  // 削除モード切替
  function switchToConfirmDelete() {
    modalMode.value = 'confirm-delete';
  }

  // モーダル閉じる
  function closeModal(){
    detailTargetBook.value = null;
    modalMode.value = 'detail';
    showDetailModal.value = false;
  }

  // 書籍更新
  function updateBook(updatedBook: BookWithId) {
    bookStore.updateBook(updatedBook);
    closeModal();
  }

  // 書籍削除
  function deleteBook() {
    if (detailTargetBook.value) {
      bookStore.deleteBook(detailTargetBook.value.id);
    }
    closeModal();
  }

  // モーダル制御
  watch(showDetailModal, (val) => {
    if (val) {
      document.body.classList.add('is-modal');
    } else {
      document.body.classList.remove('is-modal');
    }
  });

  // 編集モーダル開く
  function openEditModal(book: BookWithId) {
    detailTargetBook.value = { ...book };
    modalMode.value = 'edit';
    showDetailModal.value = true;
  }

  // 確認モーダル開く
  function openDeleteModal(book: BookWithId) {
    detailTargetBook.value = book;
    modalMode.value = 'confirm-delete';
    showDetailModal.value = true;
  }

  return {
    showDetailModal,
    detailTargetBook,
    modalMode,
    openDetailModal,
    switchToEdit,
    switchToConfirmDelete,
    closeModal,
    updateBook,
    deleteBook,
    openEditModal,
    openDeleteModal,
  };
}