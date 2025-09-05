<!-- src/components/DeleteConfirmModal.vue -->
<script setup lang="ts">
import BaseModal from './BaseModal.vue';
import BookEditForm from './BookEditForm.vue';
import type { BookWithId } from '../types';

/* props
---------------------------------- */
const props = defineProps<{
  isShow: boolean;
  modalMode: 'detail' | 'edit' | 'confirm-delete';
  book: BookWithId | null;
}>();

/* emit
---------------------------------- */
const emit = defineEmits<{
  (e: 'confirm-delete-opened'): void;
  (e: 'edit-opened'): void;
  (e: 'modal-closed'): void;
  (e: 'book-updated', updatedBook: BookWithId): void;
  (e: 'book-deleted', book: BookWithId): void;
}>();

/* function
---------------------------------- */
// モーダルのタイトル分岐
function modalTitle(){
  if(props.modalMode === 'detail'){
    return ['書籍の詳細'];
  } else if(props.modalMode === 'edit'){
    return ['書籍を編集'];
  } else if(props.modalMode === 'confirm-delete'){
    return ['本当に削除しますか？', '#d32f2f'];
  } else{
    return '';
  }
}

// 日付形式変換
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) {
    return '';
  }

  if(dateStr.length == 8){
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
  } else if(dateStr.length == 6){
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}`;
  } else if(dateStr.length == 4){
    return `${dateStr.slice(0, 4)}`;
  }

  return '';
}

// モーダルを閉じる
function emitClose() {
  emit('modal-closed');
}

// 編集モーダルからの更新データを送る
function emitUpdate(updatedBook: BookWithId) {
  emit('book-updated', updatedBook);
}

// 削除実行イベントを送る
function emitDelete(){
  if(props.book){
    emit('book-deleted', props.book);
  }
}
</script>

<template>
  <BaseModal v-bind:is-show="isShow" v-bind:title="modalTitle()" v-bind:show-close-button="true" class="u-mb1" v-on:modal-closed="emitClose">
    <template v-if="(modalMode === 'detail' || modalMode === 'confirm-delete') && book">
      <div v-bind:class="{'is-lent':book.lentStatus === 'lent' , 'is-returned':book.lentStatus === 'returned'}" class="bookPreview">
        <p class="bookCover"><img v-if="book.image" v-bind:src="book.image" alt="書影"></p>
        <p class="bookName"><strong>{{ book.title }}</strong></p>
        <p v-if="book.seriesName">
        <strong>シリーズ：</strong><router-link :to="`/series/${book.seriesName}`" class="c-txtLink" v-on:click.prevent="emitClose">{{ book.seriesName }}</router-link></p>
        <p>
          <strong>著者：</strong>
          <template v-if="book.authors && book.authors.length > 0">
            <router-link v-for="author in book.authors" v-bind:key="author" :to="`/author/${author}`" class="authorTxt c-txtLink" v-on:click.prevent="emitClose">{{ author }}</router-link>
          </template>
          <template v-else>不明</template>
        </p>

        <p><strong>発売日：</strong>{{ book.date? formatDate(book.date) : '不明' }}</p>
        <p>
          <strong>貸出状況：</strong>
          <span v-if="book.lentStatus === 'none'">記録なし</span>
          <span v-else-if="book.lentStatus === 'lent'">貸出中</span>
          <span v-else>貸出済</span>
        </p>
      </div>
    </template>

    <template v-if="modalMode === 'edit' && book">
      <BookEditForm v-bind:book="book" v-on:book-updated="emitUpdate" />
    </template>

    <template #actions>
      <template v-if="modalMode === 'detail'">
        <button class="c-btn c-btn--primary" v-on:click="$emit('edit-opened')">編集</button>
        <button class="c-btn c-btn--primary" v-on:click="$emit('confirm-delete-opened')">削除</button>
      </template>
      <template v-if="modalMode === 'edit'">
        <button class="c-btn c-btn--secondary" v-on:click="emitClose">キャンセル</button>
        <button type="submit" form="baseForm" class="c-btn c-btn--primary">保存</button>
      </template>
      <template v-else-if="modalMode === 'confirm-delete'">
        <button class="c-btn c-btn--secondary" v-on:click="emitClose">キャンセル</button>
        <button class="c-btn c-btn--primary" v-on:click="emitDelete">削除</button>
      </template>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
.bookCover{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 150px;
  aspect-ratio: 1 / 1.414;
  margin: 0 auto .5em;
  border: 1px solid #ccc;
  &::after{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: rem(18);
    white-space: nowrap;
    content: 'no Image';
  }
  img{
    display: block;
    position: relative;
    z-index: 1;
    object-fit: contain;
  }
  &::before{
    display: inline-block;
    position: absolute;
    bottom: -1px;
    left: 0;
    z-index: 2;
    padding: 3px 7px;
    font-size: rem(12);
    color: #fff;
    line-height: 1;
  }
}
.bookName{
  font-size: rem(18);
}
.authorTxt{
  + .authorTxt{
    position: relative;
    margin-left: .5em;
    &::before{
      display: inline-block;
      position: absolute;
      left: -.5em;
      content: ", ";
      color: $baseColor;
    }
  }
}
</style>