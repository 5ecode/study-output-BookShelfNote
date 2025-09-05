<!-- src/components/BaseForm.vue -->
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { DiamondPlus, ImageUp, X } from 'lucide-vue-next';
import { validate } from '../utils/validations';
import type { LentStatus, BookWithId, CombinedBookData } from '../types';

/* props
---------------------------------- */
const props = defineProps<{
  isManualMode? :boolean
  showCoverActions: boolean
  readonlyFields?: {
    isbn?: boolean
  }
  resultsBooks?: CombinedBookData[]
  book?: BookWithId | null
  bookCover?: string
  reset?: boolean
  errors: {
    title?: string,
    date?: string,
    isbn?: string,
    image?: string,
    book?: string,
  },
  regBooks: BookWithId[]
}>();

/* emit
---------------------------------- */
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submitted', book: BookWithId): void
  (e: 'duplicate-found'): void
  (e: 'cover-searched', isbn: string): void
  (e: 'cover-removed'): void
}>();

/* constant
---------------------------------- */
const authorText = ref('');

/* reactivity
---------------------------------- */
// フォームの値
const form = reactive({
  id: 0,
  title: '',
  seriesName: '',
  authors: [] as string[],
  date: '',
  isbn: '',
  image: '',
  lentStatus: 'none' as LentStatus,
});

/* watch
---------------------------------- */
// 編集モーダルが開いたときにform初期化
watch(() => props.book, (book) => {
  if (book) {
    form.id = book.id;
    form.title = book.title;
    form.seriesName = book.seriesName ?? '';
    form.date = book.date ?? '';
    form.isbn = book.isbn ?? '';
    form.image = book.image ?? '';
    form.lentStatus = book.lentStatus;
    authorText.value = book.authors?.join(', ') ?? '';
  }
}, { immediate: true });

// ISBNの検索結果を取得したときにform初期化
watch(() => props.resultsBooks, (book) => {
  if (book) {
    for (const item of book) {
      form.title = item.title;
      form.seriesName = item.seriesName ?? '';
      form.date = formatSalesDate(item.salesDate) ?? '';
      form.isbn = item.isbn ?? '';
      form.image = item.imageUrl ?? '';
      authorText.value = item.author.replace(/\//g, ', ') ?? '';
    }
  }
}, { immediate: true });

// 書影をISBNから取得
watch(() => props.bookCover, (img) => {
  if(img) form.image = img;
});

// フォームをリセット
watch(() => props.reset, (val) => {
  if(val){
    form.title = '';
    form.authors = [];
    form.date = '';
    form.image = '';
    form.seriesName = '';
    form.isbn = '';
    authorText.value = '';
  }
});

/* function
---------------------------------- */
// 発売日形式変換
function formatSalesDate(salesDate: string) {
  const fullMatch = salesDate.match(/(\d{4})年(\d{2})月(\d{2})日/);
  if (fullMatch) {
    const [, year, month, day] = fullMatch;
    return `${year}${month}${day}`;
  }

  const partialMatch = salesDate.match(/(\d{4})年(\d{2})月/);
  if (partialMatch) {
    const [, year, month] = partialMatch;
    return `${year}${month}`;
  }

  return '';
}

// 文字列を配列に変換
function formatStringToArray(value: string | null) {
  if (typeof value !== 'string') {
    return [];
  }
  return value
    .replace(/\s+/g, '')            // 空白削除
    .replace(/，/g, ',')            // 全角カンマ → 半角カンマ
    .split(',')                     // 半角カンマで分割
    .map(value => value.trim())
    .filter(value => value.length > 0);
}

// 画像選択処理
function handleImgUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    form.image = reader.result as string;
  };
  reader.readAsDataURL(file);
}

// 重複登録チェック
function isAlreadyAdded(book: typeof form) {
  let library = props.regBooks;

  if(book.id){
    library = props.regBooks.filter(function(val){
      return book.id !== val.id;
    });
  }
  return library.some(b =>
    b.isbn ? b.isbn === book.isbn : b.title === book.title &&
    JSON.stringify(b.authors ?? []) === JSON.stringify(form.authors ?? []) && b.date === book.date,
  );
}

function saveChanges() {
  if (!validate(form, props.errors)) return;

  // 文字列を配列に変換
  form.authors = formatStringToArray(authorText.value);

  // 重複チェック
  const existing = isAlreadyAdded({ ...form });

  if(existing){
    emit('duplicate-found');
  } else {
    emit('submitted', {
      id: form.id,
      title: form.title,
      authors: [...form.authors],
      date: form.date,
      image: form.image,
      lentStatus: form.lentStatus,
      isbn: form.isbn,
      seriesName: form.seriesName,
    });

    // フォームを初期化
    form.title = '';
    form.authors = [];
    form.date = '';
    form.image = '';
    form.seriesName = '';
    form.isbn = '';
    form.lentStatus = 'none';
    authorText.value = '';
  }
}

// 書影削除
function removeCover(){
  emit('cover-removed');
  form.image = '';
}
</script>

<template>
  <form id="baseForm" v-on:submit.prevent="saveChanges">
    <div class="formUnit">
      <label>書籍名:<input v-model="form.title" type="text" class="c-input"></label>
      <p v-if="errors.title" class="c-errorTxt">{{ errors.title }}</p>

      <label>シリーズ名:<input v-model="form.seriesName" type="text" placeholder="書籍のシリーズ名" class="c-input"></label>

      <label>著者名:<input v-model="authorText" type="text" placeholder="複数の場合はカンマ区切り" class="c-input"></label>

      <label>発売日:<input v-model="form.date" type="text" inputmode="numeric" pattern="\d*" maxlength="8" placeholder="例: 20240625" class="c-input" v-on:input="form.date = form.date.replace(/[^0-9]/g, '')"></label>
      <p v-if="errors.date" class="c-errorTxt">{{ errors.date }}</p>

      <label v-if="!isManualMode">ISBN:<input v-model="form.isbn" type="text" v-bind:readonly="readonlyFields?.isbn" inputmode="numeric" pattern="\d*" placeholder="13桁のISBNを入力" class="c-input" v-on:input="form.isbn = form.isbn.replace(/[^0-9]/g, '')"></label>
      <p v-if="errors.isbn" class="c-errorTxt">{{ errors.isbn }}</p>

      <dl>
        <dt>書影:</dt>
        <dd class="holder">
          <div class="bookCover">
            <img v-if="form.image" v-bind:src="form.image" alt="プレビュー">
            <button v-if="form.image && showCoverActions" class="cancelBtn" v-on:click="removeCover" v-on:click.prevent><X :size="30" /></button>
          </div>
          <div v-if="showCoverActions" class="holder_control">
            <button v-if="!isManualMode" class="icoBtn" v-on:click="$emit('cover-searched', form.isbn)" v-on:click.prevent><DiamondPlus :size="28" />ISBNから取得</button>
            <p v-if="errors.image" class="c-errorTxt">{{ errors.image }}</p>
            <label class="icoBtn"><ImageUp :size="28" /><input type="file" accept="image/*" v-on:change="handleImgUpload">アップロード</label>
          </div>
        </dd>
      </dl>

      <label>貸出ステータス:
        <select v-model="form.lentStatus" class="c-select">
          <option value="none">記録なし</option>
          <option value="lent">貸出中</option>
          <option value="returned">貸出済</option>
        </select>
      </label>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.formUnit{
  display: flex;
  flex-direction: column;
  gap: .6em;
  max-width: 600px;
  margin-inline: auto;
  line-height: 1.6;
  input[type="text"]{
    display: block;
    width: 100%;
  }
}

.bookCover{
  display: block;
  overflow: hidden;
  position: relative;
  border: 1px solid #ccc;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1.414;
  font-size: rem(16);
  &::after{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    content: 'no Image';
  }
  img{
    position: relative;
    z-index: 1;
    width: auto;
    height: 100%;
    margin: auto;
    object-fit: contain;
  }
}

.cancelBtn{
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 2;
  width: 30px;
  height: 30px;
  padding: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}

.holder{
  display: grid;
  grid-template-columns: 140px auto;
  gap: 12px;
  &_control{
    display: flex;
    flex-direction: column;
    gap: .6em;
  }
}

.icoBtn{
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  max-width: 150px;
  padding: 2px 8px 2px 2px;
  border-radius: 3px;
  border: 2px solid $mainColor;
  font-size: rem(14);
  font-weight: bold;
  color: $mainColor;
  line-height: 1;
}
input[type="file"]{
  display: none;
}
</style>