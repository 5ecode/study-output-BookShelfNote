<!-- src/components/GroupList.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import { BookCheck } from 'lucide-vue-next';
import { useModal } from '../composables/useModal';
import BookItem from '../components/BookItem.vue';
import BookDetailModal from '../components/BookDetailModal.vue';
import type { ListMode, BookWithId } from '../types';

/* props
---------------------------------- */
const props = defineProps<{
  books: BookWithId[]
  groupTitle: string
  listMode: ListMode;
  modelValue: 'new' | 'old'
}>();

/* emit
---------------------------------- */
const emit = defineEmits<{
  (e: 'title-saved', editTitle: string): void;
  (e: 'new-book-checked'): void;
  (e: 'update:modelValue', value: string): void;
  (e: 'list-mode-chenged', listMode: ListMode): void;
}>();

/* reactivity
---------------------------------- */
const editTitle = ref(props.groupTitle);

/* watch
---------------------------------- */
// props.groupTitle が変わったら入力欄も更新
watch(() => props.groupTitle, (newVal) => {
  editTitle.value = newVal;
});

/* function
---------------------------------- */
// モーダル用ロジック
const {
  showDetailModal,
  detailTargetBook,
  modalMode,
  openDetailModal,
  switchToEdit,
  switchToConfirmDelete,
  closeModal,
  updateBook,
  deleteBook,
  openEditModal,
  openDeleteModal } = useModal();

// 編集キャンセル
function cancelEditing() {
  editTitle.value = props.groupTitle;
  emit('list-mode-chenged', 'view');
}
</script>

<template>
  <div class="peagHead">
    <h2 v-if="listMode !== 'edit'" class="title">{{ groupTitle }}</h2>
    <div v-else class="editHolder">
      <input v-model="editTitle" class="c-input">
      <div class="editHolder_control u-txtR">
        <button class="c-btn c-btn--secondary" v-on:click="cancelEditing"> キャンセル </button>
        <button class="c-btn c-btn--primary" v-on:click="$emit('title-saved', editTitle)"> 保存 </button>
      </div>
    </div>
  </div>

  <div class="listHead u-mb1">
    <div class="sortNavi">
      <label><input type="radio" v-bind:checked="modelValue === 'new'" value="new" v-on:change="$emit('update:modelValue', 'new')">新しい順</label>
      <label><input type="radio" v-bind:checked="modelValue === 'old'" value="'old'" v-on:change="$emit('update:modelValue', 'old')">古い順</label>
    </div>
    <button class="icoBtn" v-on:click="$emit('new-book-checked')"><BookCheck />新刊CHECK</button>
  </div>

  <BookItem v-bind:books="books" v-bind:list-mode="listMode" v-on:detail-opened="openDetailModal" v-on:edit-opened="openEditModal" v-on:confirm-delete-opened="openDeleteModal" />

  <BookDetailModal v-bind:is-show="showDetailModal" v-bind:book="detailTargetBook" v-bind:modal-mode="modalMode" v-on:modal-closed="closeModal" v-on:edit-opened="switchToEdit" v-on:confirm-delete-opened="switchToConfirmDelete" v-on:book-updated="updateBook" v-on:book-deleted="deleteBook" />
</template>

<style lang="scss" scoped>
.title{
  font-size: rem(20);
}

.editHolder{
  display: grid;
  gap: 10px;
  margin-bottom: 10px;
  &_control{
    display: flex;
    justify-content: end;
    gap: 10px;
  }
}

.listHead{
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding-top: 10px;
  border-top: 1px solid $baseColor;
}

.sortNavi{
  display: flex;
  gap: 10px;
}

.icoBtn{
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px 4px 2px;
  border-radius: 3px;
  border: 2px solid $mainColor;
  font-size: rem(14);
  font-weight: bold;
  color: $mainColor;
  line-height: 1;
  &:hover{
    background: $mainColor;
    color: #fff;
  }
  &:focus-visible{
    outline-color: $mainColor;
    outline-offset: -2px;
  }
}
</style>