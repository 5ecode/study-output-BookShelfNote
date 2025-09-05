<!-- src/components/isbnSearchForm.vue -->
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { fetchBookByIsbn } from '../composables/useRakutenApi';
import BaseForm from './BaseForm.vue';
import BarcodeScanner from './BarcodeScanner.vue';
import type { BookData, BookWithId, CombinedBookData } from '../types';

/* props
---------------------------------- */
const props = defineProps<{
  regBooks: BookWithId[]
}>();

/* emit
---------------------------------- */
const emit = defineEmits<{
  (e: 'book-added', book: BookWithId): void;
  (e: 'scanned-books-added', books: BookData[]): void;
}>();

/* reactivity
---------------------------------- */
const isbn = ref('');
const results = ref<CombinedBookData[]>([]);
const isLoading = ref(false);
const notify = ref('');
const method = ref<'input' | 'scanner'>('input');

// エラー表示
const errors = reactive({
  search: '',
  title: '',
  date: '',
  image: '',
});

/* function
---------------------------------- */
// ISBNで書籍を取得
async function searchBook() {
  errors.search = '';
  notify.value = '';

  const isbnNum = isbn.value.trim().toString().length;
  if (!isbn.value.trim() || isbnNum !== 13) {
    errors.search = '13桁のISBNを入力してください';
    return;
  }

  if (isAlreadyAdded(isbn.value.trim())) {
    notify.value = '該当する書籍は登録済みです。';
    return;
  }

  isLoading.value = true;
  results.value = [];

  try {
    const book = await fetchBookByIsbn(isbn.value);
    if(book) {
      results.value.push(book);
    } else {
      notify.value = '該当する書籍が見つかりませんでした。';
    }
  } catch (e) {
    console.error(e);
    notify.value = '検索中にエラーが発生しました。';
  } finally {
    isLoading.value = false;
  }
}

// 重複登録チェック
function isAlreadyAdded(isbn: string) {
  if(props.regBooks)
    return props.regBooks.some(book =>
      book.isbn === isbn,
    );
}

// 検索結果リセット
function resetSearch(){
  isbn.value = '';
  results.value = [];
}

// ISBN入力した書籍追加
function handleAddBook(addBook: BookWithId){
  emit('book-added', addBook);
  resetSearch();
}

// バーコードで読み取った書籍追加
function handleAddScannedBooks(addBooks: BookData[]){
  emit('scanned-books-added', addBooks);
  resetSearch();
}
</script>

<template>
  <div class="methodFilter u-txtC">
    <label><input v-model="method" type="radio" value="input">ISBN入力</label>
    <label><input v-model="method" type="radio" value="scanner">バーコード読取</label>
  </div>

  <template v-if="method === 'input'">
    <div class="formUnit u-mb1"><label>ISBNで検索: <input v-model="isbn" type="text" inputmode="numeric" pattern="\d*" placeholder="13桁のISBNを入力" class="c-input" v-on:input="isbn = isbn.replace(/[^0-9]/g, '')"></label>
    </div>

    <div class="u-txtC u-mb2">
      <p v-if="errors.search" class="u-txtC u-mb1 c-errorTxt">{{ errors.search }}</p>
      <button class="c-btn c-btn--primary" v-on:click="searchBook">検索</button>
    </div>

    <p v-if="isLoading" class="u-txtC u-mb2">検索中...</p>
    <p v-if="results && results.length === 0" class="u-txtC u-mb2">{{ notify }}</p>

    <div v-if="results && results.length > 0" class="u-mb2">
      <BaseForm v-bind:reg-books="regBooks" v-bind:results-books="results" v-bind:show-cover-actions="false" v-bind:readonly-fields="{ isbn: true }" v-bind:errors="errors" v-on:submitted="handleAddBook" />

      <div class="addControl">
        <div class="addControl_btns u-txtC">
          <button class="c-btn c-btn--secondary u-ml1" v-on:click="resetSearch">リセット</button>
          <button type="submit" form="baseForm" class="c-btn c-btn--primary">この書籍を追加する </button>
        </div>
      </div>
    </div>
  </template>

  <template v-if="method === 'scanner'">
    <BarcodeScanner v-bind:method="method" v-bind:reg-books="regBooks" v-on:scanned-books-added="handleAddScannedBooks" />
  </template>
</template>

<style lang="scss" scoped>
.methodFilter{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 240px;
  margin: 0 auto 10px;
}
.formUnit{
  display: flex;
  flex-direction: column;
  gap: .6em;
  max-width: 600px;
  margin-inline: auto;
  label{
    line-height: 1.6;
  }
  input[type="text"]{
    display: block;
    width: 100%;
  }
}

.addControl{
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 100%;
  padding: 10px;
  border-top: 1px $subColor dotted;
  background: #fff;
  &_btns{
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}
</style>
