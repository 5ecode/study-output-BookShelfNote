<!-- src/components/BookItem.vue -->
<script setup lang="ts">
import type { ListMode, BookWithId } from '../types';

/* props
---------------------------------- */
const props = defineProps<{
  books: BookWithId[];
  listMode: ListMode;
}>();

/* emit
---------------------------------- */
const emit = defineEmits<{
  (e: 'detail-opened', book: BookWithId): void
  (e: 'confirm-delete-opened', book: BookWithId): void
  (e: 'edit-opened', book: BookWithId): void
  (e: 'rent-changed', book: BookWithId): void
}>();

/* function
---------------------------------- */
// 著者表示調整
function adjustAuthors(authors: string[]){
  if(authors.length >= 3){
    return `${authors.slice(0, 2).join(', ')}, 他…`;
  } else {
    return authors.join(', ');
  }
}

// 詳細モーダルを開く
function showDetail(book: BookWithId){
  if(props.listMode === 'view'){
    emit('detail-opened', book);
  }
}
</script>

<template>
  <ul v-if="books" class="bookList">
    <li v-for="book in books" v-bind:key="book.id" v-bind:class="{'is-lent':book.lentStatus === 'lent' , 'is-returned':book.lentStatus === 'returned', 'is-clickable': listMode === 'view'}" v-bind:title="book.title" class="bookList_item " v-on:click="showDetail(book)">
      <p class="bookCover"><img v-if="book.image" v-bind:src="book.image" alt="書影"></p>
      <div class="bookInfo">
        <div class="bookMeta">
          <p class="bookMeta_title"><strong>{{ book.title }}</strong></p>
          <p v-if="book.authors && book.authors.length > 0" class="bookMeta_authors">{{ adjustAuthors(book.authors) }}</p>
        </div>

        <div v-if="listMode !== 'view'" class="bookControl">
          <button v-if="listMode === 'delete'" class="c-btn c-btn--primary" v-on:click="$emit('confirm-delete-opened', book)" v-on:click.stop>削除</button>
          <button v-if="listMode === 'edit'" class="c-btn c-btn--primary" v-on:click="$emit('edit-opened', book)" v-on:click.stop>編集</button>
        </div>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.bookList{
  display: flex;
  flex-wrap: wrap;
  gap: 10px 0;
  &_item {
    display: grid;
    grid-template-columns: 82px auto;
    column-gap: 10px;
    width: 100%;
    line-height: 1.5;
    @media screen and (min-width: 540px) {
      display: block;
    }
  }
  @media screen and (min-width: 540px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  @media screen and (min-width: 653px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media screen and (min-width: 867px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
  }
}

.bookCover{
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  border: 1px solid #ccc;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1.414;
  @media screen and (min-width: 540px) {
    top: 0;
    transform: none;
    width: 100%;
    height: auto;
    margin-bottom: 5px;
    aspect-ratio: 102 / 101;
  }
  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    white-space: nowrap;
    content: 'no Image';
    @include mq(lg){
      font-size: rem(18);
    }
  }
  img{
    width: auto;
    height: 100%;
    margin: auto;
    object-fit: contain;
    @media screen and (min-width: 540px) {
      width: auto;
      height: 100%;
    }
  }
  &::before{
    display: inline-block;
    position: absolute;
    bottom: -1px;
    left: 0;
    padding: 3px 7px;
    font-size: rem(12);
    color: #fff;
    line-height: 1;
  }
  .is-lent &{
    &::before{
      content: "貸出中";
      background: #d35360;
    }
  }
  .is-returned &{
    &::before{
      content: "貸出済";
      background: #4aaab7;
    }
  }
}

.bookInfo{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  @media screen and (min-width: 540px){
    display: block;
  }
}

.bookMeta{
  &_title,
  &_authors{
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }
  &_title{
    -webkit-line-clamp: 2;
    @media screen and (min-width: 540px){
      -webkit-line-clamp: 1;
    }
  }
  &_authors{
    font-size: rem(14);
    -webkit-line-clamp: 1;
  }
}

.is-clickable{
  cursor: pointer;
  @include alpha(.8);
}

.bookControl{
  width: 100%;
  margin-top: auto;
  text-align: right;
  @media screen and (min-width: 540px){
    margin: auto;
    padding-top: 1em;
    text-align: center;
  }
}
</style>