<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUiStore } from './stores/uiStore';
import { BookPlus, Library, LibraryBig, SquarePen, Trash2 } from 'lucide-vue-next';

/* constant
---------------------------------- */
const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();

/* computed
---------------------------------- */
// 書籍追加ページかどうか
const isAddPage = computed(() => route.name === 'BookAdd');

// リストページかどうか
const isListPage = computed(() => route.name === 'BookList');

/* function
---------------------------------- */
// 書籍追加ページへ
function goAdd() {
  router.push({ name: 'BookAdd' });
}

// 書籍リストページへ
function goList() {
  router.push({ name: 'BookList' });
}
</script>

<template>
  <header class="header">
    <div class="header_inner">
      <h1 class="title">BookShelfNote</h1>

      <div v-bind:class="[isAddPage ? 'is-hidden' : '']" class="navi">
        <button v-bind:class="{ 'is-active': uiStore.listMode === 'view' }" v-on:click="uiStore.setListMode('view')" class="navi_btn"><Library :size="28" />通常表示</button>
        <button v-bind:class="{ 'is-active': uiStore.listMode === 'edit' }"  v-on:click="uiStore.setListMode('edit')" class="navi_btn"><SquarePen :size="28" />編集モード</button>
        <button v-bind:class="{ 'is-active': uiStore.listMode === 'delete' }"  v-on:click="uiStore.setListMode('delete')" class="navi_btn"><Trash2 :size="28" />削除モード</button>
      </div>

      <button v-if="isListPage" v-on:click="goAdd" class="icoBtn"><BookPlus :size="28" :stroke-width="1.75" /></button>
      <button v-if="!isListPage" v-on:click="goList" class="icoBtn"><LibraryBig :size="28" :stroke-width="1.75" /></button>
    </div>
  </header>

  <router-view />
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  padding-block: 4px;
  background: $subColor;
  &_inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1100px;
    margin: auto;
    color: #fff;
    @include mq(lg) {
      display: grid;
      grid-template-columns: 1fr 311px 1fr;
    }
  }
}

.title {
  padding-left: 8px;
  font-size: rem(18);
}

.navi {
  display: flex;
  justify-content: space-around;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  padding-top: 5px;
  background: #fff;
  @include mq(lg) {
    position: static;
    justify-content: space-between;
    border-radius: 5px;
    padding: 2px 1px;
  }
  &.is-hidden {
    visibility: hidden;
  }
  &_btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: rem(12);
    font-weight: bold;
    color: $subColor;
    transition: color .3s, background-color .3s;
    &.is-active,
    &:hover {
      position: relative;
      &::before{
        position: absolute;
        content: "";
        width: 34px;
        height: 34px;
        top: -2px;
        border-radius: 9999px;
        background: $subColor;
        z-index: -1;
      }
      svg {
        color: #fff;
      }
    }
    @include mq(lg) {
      flex-direction: row;
      gap: 5px;
      border: solid $subColor;
      border-width: 0 1px;
      &:first-of-type {
        border-radius: 5px 0 0 5px;
        border-left-color: #fff;
      }
      &:nth-of-type(2) {
        border-color: $subColor;
      }
      &:last-of-type {
        border-radius: 0 5px 5px 0;
        border-right-color: #fff;
      }
      &.is-active,
      &:hover{
        background: $subColor;
        color: #fff;
        &::before{
          display: none;
        }
      }
    }

  }
}

.icoBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  border: 2px solid $subColor;
  border-radius: 5px;
  color: #fff;
  @include alpha(.6);
}
</style>