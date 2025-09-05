<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUiStore } from './stores/uiStore';
import { BookPlus, Library, LibraryBig, SquarePen, Trash2 } from 'lucide-vue-next';

/* reactive
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
        <button v-on:click="uiStore.setListMode('view')" class="navi_btn"><Library :size="28" />通常表示</button>
        <button v-on:click="uiStore.setListMode('edit')" class="navi_btn"><SquarePen :size="28" />編集モード</button>
        <button v-on:click="uiStore.setListMode('delete')" class="navi_btn"><Trash2 :size="28" />削除モード</button>
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
  width: 100%;
  z-index: 10;
  background: #4d7dc5;
  &_inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1100px;
    margin: auto;
    color: #fff;
    @include mq(lg) {
      display: grid;
      grid-template-columns: 1fr 321px 1fr;
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
    justify-content: end;
    border: 2px solid $subColor;
    width: auto;
    border-radius: 5px;
    padding-block: 2px;
    >*:not(:first-of-type) {
      &::before {
        width: 2px;
        height: 100%;
        background: $subColor;
        content: "";
      }
    }
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
    @include mq(lg) {
      flex-direction: row;
      gap: 5px;
    }
  }
}

.icoBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin-left: auto;
  color: #fff;
}
</style>