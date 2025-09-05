<!-- src/views/BookAddView.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useBookStore } from '../stores/bookStore';
import { BookPlus } from 'lucide-vue-next';
import AddBookForm from '../components/AddBookForm.vue';
import IsbnSearchForm from '../components/IsbnSearchForm.vue';
import SearchBookForm from '../components/SearchBookForm.vue';
import type { BookData } from '../types';

/* constant
---------------------------------- */
const bookStore = useBookStore();

/* reactivity
---------------------------------- */
const selected = ref('search');

/* computed
---------------------------------- */
// ストレージの書籍リストを読み込む
onMounted(() => {
  bookStore.loadFromStorage();
});

/* function
---------------------------------- */
// 書籍を追加
function addBook(formData: BookData) {
  bookStore.addBook({
    id: bookStore.nextId,
    ...formData,
  });
}

// 検索結果を追加
function addSearchBooks(bookList: BookData[]) {
  bookStore.addSearchBooks(bookList);
}
</script>

<template>
  <h2 class="u-mb1 u-txtC"><BookPlus :size="28" style="vertical-align: sub;" />書籍を追加</h2>
  <div class="tabNavi u-mb1">
    <label v-bind:class="{ 'is-active': selected === 'search' }"><input v-model="selected" type="radio" value="search">作品名・著者名検索</label>
    <label v-bind:class="{ 'is-active': selected === 'isbn' }"><input v-model="selected" type="radio" value="isbn">ISBN検索</label>
    <label v-bind:class="{ 'is-active': selected === 'manual' }"><input v-model="selected" type="radio" value="manual">手入力</label>
  </div>

  <SearchBookForm v-if="selected === 'search'" v-bind:reg-books="bookStore.books" v-on:books-added="addSearchBooks" />
  <IsbnSearchForm v-else-if="selected === 'isbn'" v-bind:reg-books="bookStore.books" v-on:book-added="addBook" v-on:scanned-books-added="addSearchBooks" />
  <AddBookForm v-else v-bind:reg-books="bookStore.books" v-on:book-added="addBook" />
</template>

<style lang="scss" scoped>
.tabNavi {
  display: flex;
  gap: 10px;
  @media screen and (min-width: 540px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 0 auto;
    padding: 5px;
    border: 2px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
    user-select: none;
    transition: border-color .3s, background-color .3s;
  }
  .is-active {
    border-color: $subColor;
    background-color: $subColor;
    color: white;
  }
  input[type='radio'] {
    display: none;
  }
}
</style>