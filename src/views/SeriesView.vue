<!-- src/views/SeriesBookView.vue -->
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { UNREGISTERED_SERIES } from '../constants/book';
import { useBookStore } from '../stores/bookStore';
import { useFilterStore } from '../stores/FilterStore';
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
const filterStore = useFilterStore();

/* reactivity
---------------------------------- */
const sort = ref<'new' | 'old'>('new');

/* computed
---------------------------------- */
// 並び順
const filteredBooks = computed(() =>
  bookStore.books
    .filter((book) => book.seriesName === (props.series === UNREGISTERED_SERIES ? '' : props.series))
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
  filterStore.setFilterMode('series');
});

/* function
---------------------------------- */
// シリーズ名一括編集
function handleSaveSeries(editSeries: string) {
  const newSeries = editSeries.trim();

  if (newSeries === '' && props.series !== UNREGISTERED_SERIES) {
    const userConfirm = confirm('書籍情報からシリーズ名を削除します。\nよろしいですか？');
    if (!userConfirm) return;
  }

  // シリーズ名更新
  bookStore.updateSeriesName(props.series, newSeries);

  // パラメータを編集したものに差し替え
  if (newSeries !== '') {
    router.push({ name: 'Series', params: { series: newSeries } });
  } else {
    router.push({ name: 'Series', params: { series: UNREGISTERED_SERIES } });
  }

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
