<!-- src/components/SearchList.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { BookData, CombinedBookData } from '../types';

/* props
---------------------------------- */
const props = defineProps<{
	books: CombinedBookData[];
  regBooks: {
    title: string;
    authors: string[];
    date: string | null;
    isbn: string | null;
  }[];
}>();

/* emit
---------------------------------- */
const emit = defineEmits<{
  (e: 'books-added', books: BookData[]): void;
	(e: 'search-reset'): void;
}>();

/* reactivity
---------------------------------- */
const selectedIds = ref<string[]>([]);
const notify = ref('');

/* computed
---------------------------------- */
// すべて選択/解除切替
const allSelected = computed({
  // 未登録リストの数と選択中の数が同じかどうか
  get(){
    const selectableBooks = props.books.filter(book => !isAlreadyAdded(book));
    return (
      selectableBooks.length > 0 &&
      selectedIds.value.length === selectableBooks.length
    );
  },
  // 未登録のリストの全選択or解除操作
  set(checked: boolean) {
    if (checked) {
      selectedIds.value = props.books
        .filter(book => !isAlreadyAdded(book))
        .map(book => book.isbn);
    } else {
      selectedIds.value = [];
    }
  },
});

/* function
---------------------------------- */
// 重複登録チェック
function isAlreadyAdded(book: CombinedBookData) {
  const bookAuthors = formatStringToArray(book.author) ?? [];
  const bookDate = formatSalesDate(book.salesDate);

  return props.regBooks.some(b =>
    (b.isbn
      ? b.isbn === book.isbn
      : b.title === book.title &&
        JSON.stringify(b.authors ?? []) === JSON.stringify(bookAuthors) &&
        b.date === bookDate
    ),
  );
}

// 著者表示調整
function adjustAuthors(authors:string){
  const author = formatStringToArray(authors);
  if(author.length >= 3){
    return `${author.slice(0, 2).join(', ')}, 他…`;
  } else {
    return author.join(', ');
  }
}

// 発売日形式変換
function formatSalesDate(salesDate: string) {
  const fullMatch = salesDate.match(/(\d{4})年(\d{2})月(\d{2})日/);
  if (fullMatch) {
    const [, year, month, day] = fullMatch;
    return `${year}${month}${day}`;
  }

  const partialMatch = salesDate.match(/(\d{4})年(\d{2})月/);
  if (partialMatch) {
    const [, year, month] = partialMatch;
    return `${year}${month}`;
  }

  return '';
}

// 文字列を配列に変換
function formatStringToArray(value: string | null) {
  if (typeof value !== 'string') {
    return [];
  }
  return value.replace(/\s+/g, '').split('/').map(value => value.trim()).filter(value => value.length > 0);
}

// 送るデータを成型
function convertToBookData(book: CombinedBookData): BookData {
  return {
    title: book.title,
    seriesName: book.seriesName,
    authors: formatStringToArray(book.author),
    date: formatSalesDate(book.salesDate),
    isbn: book.isbn,
    image: book.imageUrl,
    lentStatus: 'none',
  };
}

// 選択した書籍を追加
function addSelectedBooks(){
  if(!props.books) return false;
  const selectedBooks = props.books.filter(book =>
    selectedIds.value.includes(book.isbn),
  ).map(convertToBookData);
  emit('books-added', selectedBooks);
  selectedIds.value = [];
}

// 検索結果リセット
function resetSearch(){
  emit('search-reset');
  selectedIds.value = [];
  notify.value = '';
}
</script>

<template>
  <div class="u-mb2">
    <div class="stickyHolder u-txtC">
      <label><input v-model="allSelected" type="checkbox">すべて選択</label>
    </div>

    <ul class="searchList u-mb1">
      <li v-for="book in books" v-bind:id="book.isbn" v-bind:key="book.isbn" class="searchList_item" v-bind:class="isAlreadyAdded(book)? 'is-Registered': ''">
        <label class="itemLabel">
          <span class="itemLabel_input"><input v-model="selectedIds" type="checkbox" v-bind:value="book.isbn" v-bind:disabled="isAlreadyAdded(book)"></span>
          <span class="itemLabel_cover"><span class="bookCover"><img v-if="book.imageUrl" v-bind:src="book.imageUrl" alt="書影"></span></span>
          <span class="itemLabel_title"><b>{{ book.title }}</b></span>
          <span class="itemLabel_authors">{{ book.author ? adjustAuthors(book.author) : '著者不明' }}</span>
        </label>
      </li>
    </ul>

    <slot name="more"></slot>

    <div class="addControl">
      <div class="addControl_btns u-txtC">
        <button class="c-btn c-btn--secondary u-ml1" v-on:click="resetSearch">リセット</button>
        <button class="c-btn c-btn--primary" v-on:click="addSelectedBooks">選択した書籍を追加</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.searchList{
  @include mq(lg){
    max-width: 625px;
    margin: auto;
  }
  &_item{
    width: 100%;
    margin-bottom: 10px;
    &.is-Registered{
      position: relative;
      &::before{
        display: block;
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, .5);
        content: "";
      }
      &::after{
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translateY(-50%);
        z-index: 2;
        padding: 3px 5px 5px;
        border: 2px solid $alertColor;
        border-radius: 5px;
        background: #fff;
        color: $alertColor;
        font-weight: bold;
        line-height: 1;
        content: '登録済み';
        @include mq(lg){
          left: 36px;
        }
      }
    }
  }
}

.itemLabel{
  display: grid;
  grid-template-columns: 15px 70px auto;
  column-gap: 5px;
  line-height: 1.5;
  @media screen and (min-width: 540px){
    grid-template-columns: 15px 100px auto;
    column-gap: 10px;
  }
  &_input{
    display: flex;
    align-items: center;
    grid-row: 1 / 3;
    input[type="checkbox"]{
      margin: 0;
    }
  }
  &_cover{
    display: flex;
    align-items: center;
    grid-row: 1 / 3;
    grid-column: 2 / 3;
  }
  &_title{
    display: flex;
    align-items: end;
    grid-row: 1 / 2;
    font-size: rem(14);
    @media screen and (min-width: 540px){
      font-size: rem(16);
    }
  }
  &_authors{
    grid-row: 2 / 3;
    font-size: rem(12);
    @media screen and (min-width: 540px){
      font-size: rem(14);
    }
  }
}

.bookCover{
  display: block;
  overflow: hidden;
  position: relative;
  border: 1px solid #ccc;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1.414;
  font-size: rem(12);
  &::after{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    white-space: nowrap;
    content: 'no Image';
  }
  img{
    width: auto;
    height: 100%;
    margin: auto;
    object-fit: contain;
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

.stickyHolder{
  position: sticky;
  top: 40px;
  z-index: 10;
  width: 100%;
  margin-bottom: 20px;
  padding-block: 8px;
  background: #fff;
}
</style>
