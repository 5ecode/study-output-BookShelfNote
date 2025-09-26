<!-- src/views/BookListView.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBookStore } from '../stores/bookStore';
import { useUiStore } from '../stores/uiStore';
import { useModal } from '../composables/useModal';
import { LibraryBig, Search } from 'lucide-vue-next';
import BookDetailModal from '../components/BookDetailModal.vue';
import BookItem from '../components/BookItem.vue';

/* constant
---------------------------------- */
const uiStore = useUiStore();
const bookStore = useBookStore();

/* reactivity
---------------------------------- */
const filterMode = ref<'all' | 'lent' | 'returned' | 'search'>('all');
const searchQuery = ref('');

/* computed
---------------------------------- */
// 表示フィルター
const filteredBooks = computed(() => {
  switch (filterMode.value) {
  case 'lent':
    return bookStore.books.filter(book => book.lentStatus === 'lent');
  case 'returned':
    return bookStore.books.filter(book => book.lentStatus === 'returned');
  case 'search':
    return bookStore.books.filter(book => {
      const query = searchQuery.value.toLowerCase();
      return (
        book.title.toLowerCase().includes(query) ||
          book.authors.some(author => author.toLowerCase().includes(query))
      );
    });
  default:
    return bookStore.books;
  }
});

/* lifecycle hooks
---------------------------------- */
// ストレージの書籍リストを読み込む
onMounted(() => {
  bookStore.loadFromStorage();
});

/* function
---------------------------------- */
// リセット
function reset() {
  const userConfirm = confirm('登録しているすべての書籍を削除します。このデータは復元できません。本当に削除してよろしいですか？');
  if (userConfirm) {
    bookStore.reset();
  }
}

// モーダルロジック
const {
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
} = useModal();
</script>

<template>
  <div class="listArea">
    <div class="listArea_header u-mb2">
      <h2 class="u-txtC"><LibraryBig :size="28" style="vertical-align: sub;" />書籍リスト</h2>
      <select v-model="filterMode" class="c-select">
        <option value="all">全ての書籍</option>
        <option value="lent">貸出中</option>
        <option value="returned">貸出済</option>
        <option value="search">検索</option>
      </select>
      <div v-if="filterMode === 'search'" class="inputIcoWrap u-txtC">
        <Search /><input v-model="searchQuery" type="text" placeholder="タイトルや著者名で検索" class="inputFilterTxt">
      </div>
    </div>

    <BookItem v-bind:books="filteredBooks" v-bind:list-mode="uiStore.listMode" v-on:detail-opened="openDetailModal" v-on:edit-opened="openEditModal" v-on:confirm-delete-opened="openDeleteModal" />

    <div v-if="filteredBooks.length === 0" class="noBooks u-txtC">
      <p class="u-mb1">該当する書籍が見つかりませんでした。</p>
      <!-- Rakuten Web Services Attribution Snippet FROM HERE -->
      <p><a href="https://developers.rakuten.com/" target="_blank">Supported by Rakuten Developers</a></p>
      <!-- Rakuten Web Services Attribution Snippet TO HERE -->
    </div>
  </div>

  <div v-if="uiStore.listMode === 'delete' && filteredBooks.length > 0" class="reset u-txtC">
    <button class="c-btn c-btn--secondary" v-on:click="reset">リストを削除</button>
  </div>

  <BookDetailModal v-bind:is-show="showDetailModal" v-bind:book="detailTargetBook" v-bind:modal-mode="modalMode" v-on:modal-closed="closeModal" v-on:edit-opened="switchToEdit" v-on:confirm-delete-opened="switchToConfirmDelete" v-on:book-updated="updateBook" v-on:book-deleted="deleteBook" />
</template>

<style lang="scss" scoped>
.listArea_header {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 15px;
}

.inputIcoWrap {
  position: relative;
  .lucide {
    position: absolute;
    z-index: 1;
    inset-block: 50%;
    translate: 0 -50%;
    color: $subColor;
    opacity: .7;
  }
}

.inputFilterTxt {
  padding-left: 25px;
  border-width: 0 0 1px;
  border-radius: 0;
  border-color: rgba(153, 153, 153, 1);
}

.reset {
  margin-top: 40px;
}

.noBooks {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}
</style>
