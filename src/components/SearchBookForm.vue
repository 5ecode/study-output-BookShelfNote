<!-- src/components/SearchBookForm.vue -->
<script setup lang="ts">
import { ref, reactive, computed,onMounted } from 'vue';
import { useUiStore } from '../stores/uiStore';
import { fetchRakutenRaw } from '../composables/useRakutenApi';
import SearchList from '../components/SearchList.vue';
import type { BookData, CombinedBookData } from '../types';

/* props
---------------------------------- */
defineProps<{
  regBooks: {
    title: string;
    authors: string[];
    date: string | null;
    isbn: string | null;
  }[]
}>();

/* emit
---------------------------------- */
const emit = defineEmits<{
  (e: 'books-added', books: BookData[]): void;
}>();

/* constant
---------------------------------- */
const uiStore = useUiStore();
const BOOK_SIZES = [
  { value: 0, label: 'すべて' },
  { value: 2, label: '文庫' },
  { value: 9, label: 'コミック' },
  { value: 3, label: '新書' },
  { value: 1, label: '単行本' },
] as const;

/* reactivity
---------------------------------- */
const title = ref(uiStore.searchSeries || '');
const author = ref(uiStore.searchAuthor || '');
const results = ref<CombinedBookData[]>([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalCount = ref(0);
const selectedIds = ref<string[]>([]);
const notify = ref('');
const bookSize = ref<'0' | '2' | '9' | '3' | '1'>('0');

// エラー表示
const errors = reactive({
  search: '',
});

/* computed
---------------------------------- */
// さらに表示するかの判定
const hasMore = computed(() => {
  return results.value.length < totalCount.value;
});

/* lifecycle hooks
---------------------------------- */
onMounted(() => {
  if (uiStore.searchSeries) {
    performSearch();
    uiStore.clearSearchSeries();
  }
  if (uiStore.searchAuthor) {
    performSearch();
    uiStore.clearSearchAuthor();
  }
});

/* function
---------------------------------- */
// 書籍を取得
async function getBooks() {
  isLoading.value = true;
  notify.value = '';

  try {
    const query: Record<string, string> = {
      sort: '-releaseDate',
      hits: '15',
      page: String(currentPage.value),
      size: bookSize.value,
    };

    if (title.value.trim() !== '') {
      query.title = title.value;
    }
    if (author.value.trim() !== '') {
      query.author = author.value;
    }

    const { books, totalCount: count } = await fetchRakutenRaw(query);

    totalCount.value = count;
    results.value = [...results.value, ...books];

    if (books.length === 0) {
      notify.value = '該当する書籍が見つかりませんでした。';
    }
  } catch (e) {
    console.error(e);
    notify.value = '検索中にエラーが発生しました。';
  } finally {
    isLoading.value = false;
  }
}

// 検索ボタンを押下したとき
function performSearch(){
  if (!title.value.trim() && !author.value.trim()) {
    errors.search = '書籍名、著者名のいずれか、または両方に入力してください';
    return;
  }

  resetSearch();
  getBooks();
}

// もっと見るを押下したとき
function fetchBooks() {
  currentPage.value++;
  getBooks();
}

// 検索結果リセット
function resetSearch(){
  results.value = [];
  currentPage.value = 1;
  errors.search = '';
  notify.value = '';
}

// 書籍を追加
function emitAddBooks(books:BookData[]){
  emit('books-added', books);
  selectedIds.value = [];
}
</script>

<template>
  <div class="sizeFilter u-txtC">
    <template v-for="item in BOOK_SIZES" v-bind:key="item.value">
      <label><input v-model="bookSize" type="radio" v-bind:value="item.value">{{ item.label }}</label>
    </template>
  </div>

  <div class="formUnit u-mb1">
    <label>書籍名で検索: <input v-model="title" type="text" name="searchTitle" placeholder="書籍名を入力" class="c-input"></label>
    <label>著者名で検索: <input v-model="author" type="text" name="searchAuthor" placeholder="著者名を入力" class="c-input"></label>
  </div>

  <div class="u-txtC u-mb2">
    <p v-if="errors.search" class="u-txtC u-mb1 c-errorTxt">{{ errors.search }}</p>
    <button class="c-btn c-btn--primary" v-on:click="performSearch">検索</button>
  </div>

  <p v-if="isLoading" class="u-txtC u-mb2">検索中...</p>
  <p v-if="results && results.length === 0" class="u-txtC u-mb2">{{ notify }}</p>

  <div v-if="results && results.length > 0" class="u-mb2">
    <SearchList v-bind:reg-books="regBooks" v-bind:books="results" v-on:books-added="emitAddBooks" v-on:search-reset="resetSearch">
      <template #more>
        <div v-if="hasMore" class="btnHolder">
          <button class="moreBtn" v-on:click="fetchBooks">Show more</button>
        </div>
      </template>
    </SearchList>
  </div>
</template>

<style lang="scss" scoped>
.sizeFilter{
  display: flex;
  flex-wrap: wrap;
  justify-content:space-between;
  max-width: 400px;
  margin: 0 auto 20px;
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

.btnHolder{
  border-top: 1px dotted $baseColor;
  text-align: center;
}

.moreBtn{
  padding-block: 10px;
  width: 100%;
  font-weight: bold;
  color: $baseColor;
  @include mq(lg){
    width: auto;
    @include hover{
      color: $successColor;
    }
  }
}
</style>
