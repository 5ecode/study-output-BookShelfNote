<!-- src/views/BarcodeScanner.vue -->
<script lang="ts" setup>
import { ref, reactive, onMounted, watch, onBeforeUnmount } from 'vue';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException } from '@zxing/library';
import type { IScannerControls } from '@zxing/browser';
import { fetchBookByIsbn } from '../composables/useRakutenApi';
import SearchList from '../components/SearchList.vue';
import type { BookData, BookWithId, CombinedBookData } from '../types';

/* props
---------------------------------- */
const props = defineProps<{
  method: string
  regBooks: BookWithId[]
}>();

/* emit
---------------------------------- */
const emit = defineEmits<{
  (e: 'scanned-books-added', books: BookData[]): void
}>();

/* constant
---------------------------------- */
let reader: BrowserMultiFormatReader | null = null;
let controls: IScannerControls | null = null;
let running = false; //スキャン可能かどうか

/* reactivity
---------------------------------- */
const video = ref<HTMLVideoElement | null>(null);
const isbn = ref('');
const scannedIsbns = ref<string[]>([]); // 検索済みISBNを記録
const isSearching = ref(false); //書籍情報検索中かどうか
const results = ref<CombinedBookData[]>([]);
const notify = ref('');

// エラー表示
const errors = reactive({
  search: '',
});

/* watch
---------------------------------- */
// methodの変更を監視してスキャンの開始停止切替
watch(() => props.method, (newVal) => {
  if (newVal === 'scanner') {
    startScanner();
  } else {
    stopScanner();
  }
});

// ISBN取得したら検索開始
watch(() => isbn.value, () => {
  if(!isSearching.value){
    searchBook();
  }
});

/* lifecycle hooks
---------------------------------- */
onMounted(() => {
  if (props.method === 'scanner') {
    startScanner();
  }
});

onBeforeUnmount(() => {
  stopScanner();
});

/* function
---------------------------------- */
// スキャナー開始
async function startScanner() {
  if (controls) return;

  if (!video.value) return;

  reader = new BrowserMultiFormatReader();
  running = true;

  try {
    controls = await reader.decodeFromVideoDevice(
      undefined,
      video.value,
      (result, error) => {
        if (!running) return;

        if (result) {
          const scannedIsbn = result.getText();

          if (scannedIsbns.value.includes(scannedIsbn)) {
            notify.value = '読み取り済みです';
            return;
          }

          if (isAlreadyAdded(scannedIsbn)) {
            notify.value = '該当する書籍は登録済みです';
            return;
          }

          running = false;

          isbn.value = scannedIsbn;
          scannedIsbns.value.push(scannedIsbn);
        } else if (error && !(error instanceof NotFoundException)) {
          console.error(error);
        }
      },
    );
  } catch (e) {
    console.error('startScanner エラー:', e);
    running = false;
  }
}

// スキャナー停止
function stopScanner() {
  running = false;
  controls?.stop();
  controls = null;

  const v = video.value;
  const stream = (v?.srcObject as MediaStream) ?? null;
  stream?.getTracks().forEach(t => t.stop());

  if (v) {
    v.srcObject = null;
    try { v.pause(); } catch {/*何もしない*/}
  }

  reader = null;
}

// ISBNで書籍を取得
async function searchBook() {
  errors.search = '';
  notify.value = '';

  isSearching.value = true;

  try {
    const book = await fetchBookByIsbn(isbn.value);
    if(book) {
      results.value.unshift(book);
    } else {
      notify.value = '該当する書籍が見つかりませんでした。';
    }
  } catch (e) {
    console.error(e);
    notify.value = '検索中にエラーが発生しました。';
  } finally {
    isSearching.value = false;
    running = true;
  }
}

// 重複登録チェック
function isAlreadyAdded(isbn: string) {
  if(props.regBooks)
    return props.regBooks.some(book =>
      book.isbn === isbn,
    );
}

// バーコードで読み取った書籍を追加
function handleAddScannedBooks(addBooks: BookData[]){
  emit('scanned-books-added', addBooks);
  errors.search = '';
  scannedIsbns.value = [];
}
</script>

<template>
  <div class="frame">
    <video ref="video" class="scanner" muted playsinline />
  </div>
  <p v-if="results && results.length === 0" class="u-txtC">{{ notify }}</p>

  <div v-if="results && results.length > 0" class="u-mb2">
    <SearchList v-bind:reg-books="regBooks" v-bind:books="results" v-on:books-added="handleAddScannedBooks" />
  </div>
</template>

<style lang="scss" scoped>
.frame{
  max-width: 100%;
}

.scanner{
  width: 100%;
  height: 150px;
  object-fit: cover;
  background: $baseColor;
  border-radius: 6px;
}
</style>

