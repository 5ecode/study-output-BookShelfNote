// src/stores/uiStore.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ListMode } from '../types';

export const useUiStore = defineStore('ui', () => {
  const listMode = ref<ListMode>('view');
  const searchSeries = ref<string | null>(null);
  const searchAuthor = ref<string | null>(null);

  function setListMode(mode: ListMode) {
    listMode.value = mode;
  }

  function setSearchSeries(series: string) {
    searchSeries.value = series;
  }

  function clearSearchSeries() {
    searchSeries.value = null;
  }
  function setSearchAuthor(author: string) {
    searchAuthor.value = author;
  }

  function clearSearchAuthor() {
    searchAuthor.value = null;
  }

  return {
    listMode,
    setListMode,
    searchSeries,
    setSearchSeries,
    clearSearchSeries,
    searchAuthor,
    setSearchAuthor,
    clearSearchAuthor,
  };
});