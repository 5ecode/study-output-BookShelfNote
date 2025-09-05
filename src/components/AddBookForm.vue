<!-- src/components/AddBookForm.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useBookCover } from '../composables/useBookCover';
import BaseForm from './BaseForm.vue';
import type { BookWithId } from '../types';

/* props
---------------------------------- */
const props = defineProps<{
  regBooks: BookWithId[]
}>();

/* emit
---------------------------------- */
const emit = defineEmits<{
  (e: 'book-added', formData: BookWithId): void
}>();

/* reactivity
---------------------------------- */
const formReset = ref(false);

/* function
---------------------------------- */
// 表紙画像取得ロジック
const {
  bookCoverUrl,
  errors,
  searchBookCover,
  removeCover,
} = useBookCover(props.regBooks);

// 登録済みメッセージ表示
function handleShowError(){
  errors.book = '登録済みの書籍です。';
}

// フォームリセット
function resetForm(){
  formReset.value = true;
  errors.isbn = '';
  errors.image = '';
  errors.book = '';
}

// 書籍追加
function handleAddBook(addBook: BookWithId){
  emit('book-added', addBook);
  errors.book = '';
}
</script>

<template>
  <BaseForm v-bind:is-manual-mode="true" v-bind:reg-books="regBooks" v-bind:show-cover-actions="true" v-bind:book-cover="bookCoverUrl" v-bind:errors="errors" v-bind:reset="formReset" v-bind:class="[errors.book? 'u-mb1':'u-mb2']" v-on:submitted="handleAddBook" v-on:duplicate-found="handleShowError" v-on:cover-searched="searchBookCover" v-on:cover-removed="removeCover" />

  <p v-if="errors.book" class="c-errorTxt u-txtC u-mb2">{{ errors.book }}</p>
  <div class="controlBtns">
    <button class="c-btn c-btn--secondary" v-on:click="resetForm">キャンセル</button>
    <button type="submit" form="baseForm" class="c-btn c-btn--primary">リストに追加する</button>
  </div>
</template>

<style lang="scss" scoped>
.controlBtns{
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>