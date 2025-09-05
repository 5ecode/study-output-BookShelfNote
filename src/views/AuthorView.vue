<!-- src/views/AuthorView.vue -->
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBookStore } from '../stores/bookStore';
import { useUiStore } from '../stores/uiStore';
import { normalizeDate } from '../utils/normalizeDate';
import GroupList from '../components/GroupList.vue';
import type { ListMode } from '../types';

/* props
---------------------------------- */
const props = defineProps<{
  author: string
}>();

/* constant
---------------------------------- */
const uiStore = useUiStore();
const router = useRouter();
const bookStore = useBookStore();

/* reactivity
---------------------------------- */
const sort = ref<'new' | 'old'>('new');

/* computed
---------------------------------- */
// 並び順
const filteredBooks = computed(() =>
  bookStore.books
    .filter(book => book.authors.includes(props.author))
    .sort((a, b) => {
      const dateA = normalizeDate(a.date || '');
      const dateB = normalizeDate(b.date || '');
      return sort.value === 'new'
        ? dateB - dateA // 新しい順
        : dateA - dateB; // 古い順
    }),
);

/* lifecycle hooks
---------------------------------- */
onMounted(() => {
  bookStore.loadFromStorage();
});

/* function
---------------------------------- */
// 著者名一括編集
function handleSaveAuthor(editAuthor: string) {
  if (editAuthor.trim() === '') return;

  const newAuthor = editAuthor.trim();
  bookStore.updateAuthor(props.author, newAuthor);

  // パラメータを編集したものに差し替え
  router.push({ name: 'Author', params: { author: newAuthor } });

  // 編集モード解除
  uiStore.listMode = 'view';
}

// 編集キャンセル
function handleCancel(listMode: ListMode) {
  uiStore.listMode = listMode;
}

// 著者名で書籍検索へ遷移
function handleGoToSearch() {
  uiStore.setSearchAuthor(props.author);
  router.push({ name: 'BookAdd' });
  uiStore.listMode = 'view';
}
</script>

<template>
  <GroupList v-model="sort" v-bind:group-title="author" v-bind:books="filteredBooks" v-bind:list-mode="uiStore.listMode" v-on:title-saved="handleSaveAuthor" v-on:new-book-checked="handleGoToSearch" v-on:list-mode-chenged="handleCancel" />
</template>