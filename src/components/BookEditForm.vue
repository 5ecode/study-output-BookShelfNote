<!-- src/components/BookEditForm.vue -->
<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue';
import { useBookStore } from '../stores/bookStore';
import { useBookCover } from '../composables/useBookCover';
import BaseForm from './BaseForm.vue';
import type { LentStatus, BookWithId } from '../types';

/* props
---------------------------------- */
const props = defineProps<{
  book: BookWithId | null
}>();

/* emit
---------------------------------- */
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'book-updated', book: BookWithId): void
}>();

/* constant
---------------------------------- */
const bookStore = useBookStore();

/* reactivity
---------------------------------- */
const authorText = ref('');

// フォーム値
const form = reactive({
  id: 0,
  title: '',
  authors: [] as string[],
  date: '',
  image: '',
  lentStatus: 'none' as LentStatus,
  isbn: '',
  seriesName: '',
});

/* watch
---------------------------------- */
// 編集モーダルが開いたときにform初期化
watch(() => props.book, (book) => {
  if (book) {
    form.id = book.id;
    form.title = book.title;
    form.authors = book.authors ?? [];
    form.date = book.date ?? '';
    form.image = book.image ?? '';
    form.lentStatus = book.lentStatus;
    form.seriesName = book.seriesName ?? '';
    form.isbn = book.isbn ?? '';
    authorText.value = book.authors?.join(', ') ?? '';
  }
}, { immediate: true });

/* lifecycle hooks
---------------------------------- */
// ストレージの書籍リストを読み込む
onMounted(() => {
  bookStore.loadFromStorage();
});

/* function
---------------------------------- */
// 表紙画像取得ロジック
const {
  bookCoverUrl,
  errors,
  searchBookCover,
  removeCover,
} = useBookCover(bookStore.books, form.id);

// 書籍情報更新
function handleBookUpdated(upDateBook: BookWithId){
  emit('book-updated', upDateBook);
}
</script>

<template>
  <BaseForm ref="baseForm" v-bind:reg-books="bookStore.books" v-bind:book="book" v-bind:show-cover-actions="true" v-bind:book-cover="bookCoverUrl" v-bind:errors="errors" v-on:submitted="handleBookUpdated" v-on:cover-searched="searchBookCover" v-on:cover-removed="removeCover" />
</template>


