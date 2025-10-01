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
function handleAddBook(formData: BookData) {
  bookStore.addBook({
    id: bookStore.nextId,
    ...formData,
  });
}

// 選択した書籍を追加
function handleAddSelectedBooks(bookList: BookData[]) {
  bookStore.addSelectedBooks(bookList);
}
</script>

<template>
  <h2 class="u-mb1 u-txtC"><BookPlus :size="28" style="vertical-align: sub;" />書籍を追加</h2>
  <div class="tabNavi u-mb1">
    <button v-bind:class="['tabBtn', { 'is-active': selected === 'search' }]" @click="selected = 'search'" v-bind:aria-pressed="selected === 'search'">作品名・著者名検索</button>

    <button v-bind:class="['tabBtn', { 'is-active': selected === 'isbn' }]" @click="selected = 'isbn'" v-bind:aria-pressed="selected === 'isbn'">ISBN検索</button>

    <button v-bind:class="['tabBtn', { 'is-active': selected === 'manual' }]" @click="selected = 'manual'" v-bind:aria-pressed="selected === 'manual'">手入力</button>
  </div>

  <SearchBookForm v-if="selected === 'search'" v-bind:reg-books="bookStore.books" v-on:books-added="handleAddSelectedBooks" />
  <IsbnSearchForm v-else-if="selected === 'isbn'" v-bind:reg-books="bookStore.books" v-on:book-added="handleAddBook" v-on:scanned-books-added="handleAddSelectedBooks" />
  <AddBookForm v-else v-bind:reg-books="bookStore.books" v-on:book-added="handleAddBook" />
</template>

<style lang="scss" scoped>
.tabNavi {
  display: flex;
  gap: 10px;
  @media screen and (min-width: 540px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
.tabBtn {
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
  &:hover,
  &.is-active {
    border-color: $subColor;
    background: $subColor;
    color: #fff;
  }
  &:focus-visible{
    outline-color: $mainColor;
  }
}
</style>