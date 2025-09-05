<!-- src/views/SeriesBookView.vue -->
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
  series: string
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
    .filter(book => book.seriesName === props.series)
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
// シリーズ名一括編集
function handleSaveSeries(editSeries: string) {
  if (editSeries.trim() === '') return;

  const newSeries = editSeries.trim();
  bookStore.updateSeriesName(props.series, newSeries);

  // パラメータを編集したものに差し替え
  router.push({ name: 'Series', params: { series: newSeries } });

  // 編集モード解除
  uiStore.listMode = 'view';
}

// 編集キャンセル
function handleCancel(listMode: ListMode) {
  uiStore.listMode = listMode;
}

// シリーズ名で書籍検索へ遷移
function handleGoToSearch() {
  uiStore.setSearchSeries(props.series);
  router.push({ name: 'BookAdd' });
  uiStore.listMode = 'view';
}
</script>

<template>
  <GroupList v-model="sort" v-bind:group-title="series" v-bind:books="filteredBooks" v-bind:list-mode="uiStore.listMode" v-on:title-saved="handleSaveSeries" v-on:new-book-checked="handleGoToSearch" v-on:list-mode-chenged="handleCancel"></GroupList>
</template>