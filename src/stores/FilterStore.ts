// src/stores/FilterStore.ts
import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import type { FilterMode } from '../types';

export const useFilterStore = defineStore('filter', () => {
  const storageKey = 'filterMode';

  // 網羅性チェック用マップ
  const FILTER_MAP: Record<FilterMode, true> = {
    'all': true,
    'author': true,
    'series': true,
    'lent': true,
    'returned': true,
    'search': true,
  };

  const filterMode = ref<FilterMode>(getInitialFilterMode());

  // filterMode が変わったタイミングでlocalStorageに登録
  watch(filterMode, (newValue) => {
    localStorage.setItem(storageKey, newValue);
  });

  // 型ガード
  function isFilterMode(value: unknown) {
    return typeof value === 'string' && Object.hasOwn(FILTER_MAP, value);
  }

  // フィルターの初期値
  function getInitialFilterMode() {
    const savedFilter = localStorage.getItem(storageKey);
    if (isFilterMode(savedFilter)) {
      if (savedFilter === 'author' || savedFilter === 'series') {
        return savedFilter;
      }
    }

    return 'all';
  }

  function setFilterMode(value: FilterMode) {
    filterMode.value = value;
  }

  return { filterMode, setFilterMode };
});
