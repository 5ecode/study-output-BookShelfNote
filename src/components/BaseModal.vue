<!-- src/components/BaseModal.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';

/* props
---------------------------------- */
const props= defineProps<{
  title?: string[] | '';
  isShow: boolean;
  showCloseButton?: boolean;
}>();

/* emit
---------------------------------- */
// イベント定義
defineEmits<{
  (e: 'modal-closed'): void;
}>();

/* constant
---------------------------------- */
const allowedColors = ['#d32f2f'];

/* reactivity
---------------------------------- */
const modalRef = ref<HTMLDivElement | null>(null);

/* computed
---------------------------------- */
const titleColor = computed(() => {
  if(!props.title) return '';
  return allowedColors.includes(props.title[1] || '')
    ? props.title[1]
    : '#2c3e50'; // デフォルト値
});

/* watch
---------------------------------- */
// slot内のbutton要素にフォーカスを移す
watch(() => props.isShow, (val) => {
  if (val) {
    setTimeout(() => {
      if (modalRef.value) {
        const focusable = getFocusableElements(modalRef.value);
        focusable[0].focus();
      }
    }, 0);
  }
});

/* function
---------------------------------- */
// モーダル内のフォーカス対象取得
function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

// モーダル内でフォーカスをループ
function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') return;

  if (props.isShow) {
    const focusable = getFocusableElements(modalRef.value);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
</script>

<template>
  <div v-if="isShow" class="modalOverlay" v-on:click.self="$emit('modal-closed')" v-on:keydown="trapFocus">
    <div ref="modalRef" class="modalContent">
      <template v-if="title">
        <header class="modalHeader">
          <h3 v-bind:style="{ color: titleColor }">{{ title[0] }}</h3>
          <button v-if="showCloseButton" class="closeBtn" v-on:click="$emit('modal-closed')">×</button>
        </header>
      </template>
      <template v-else>
        <div class="u-txtR">
          <button v-if="showCloseButton" class="closeBtn" v-on:click="$emit('modal-closed')">×</button>
        </div>
      </template>
      <div class="modalBody">
        <slot></slot>
      </div>
      <div class="modalButtons">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
body.is-modal{
  overflow: hidden;
}

.modalOverlay{
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background: rgba(83, 192, 211, .8);
}

.modalContent{
  overflow-y: auto;
  width: 100%;
  max-width: 450px;
  min-width: 340px;
  height: 100%;
  padding: 20px;
  background: #fff;
  @include mq(sm){
  }
  @media screen and (min-width: 430px){
    width: 95%;
    max-width: 500px;
    height: auto;
    max-height: 75%;
    border-radius: 5px;
  }
}

.modalHeader{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.modalBody{
  padding: 10px 0;
}

.modalButtons{
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.closeBtn{
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
