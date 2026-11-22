<!-- src/components/BookGroupList.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { BookWithId } from '../types';

/* props
---------------------------------- */
const props = defineProps<{
  books: Record<string, BookWithId[]>
  filterMode: 'author' | 'series'
}>();

/* constant
---------------------------------- */
const router = useRouter();

/* function
---------------------------------- */
function handleGoToIndex(key: string) {
  if (props.filterMode === 'author') {
    router.push({ name: 'Author', params: { author: key } });
  } else if (props.filterMode === 'series') {
    router.push({ name: 'Series', params: { series: key } });
  }
}
</script>

<template>
<ul class="bookGroupList">
  <li v-for="(value, key) in books" class="bookGroupList_item" v-on:click="handleGoToIndex(key)" v-on:keydown.enter="handleGoToIndex(key)">
    <p class="bookGroupList_name"><strong>{{ key }}</strong></p>
    <p class="bookGroupList_count">計<span class="bookGroupList_countNum">{{ value.length }}</span>冊</p>
    <p class="bookGroupList_cover"><img v-bind:src="value[0].image ?? ''" alt=""></p>
  </li>
</ul>
</template>

<style lang="scss" scoped>
.bookGroupList {
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  &_item {
    display: grid;
    grid-template-columns: 82px auto;
    column-gap: 10px;
    position: relative;
    cursor: pointer;
    @include alpha(.8);
  }

  &_cover {
    width: 100%;
    height: auto;
    border: 1px solid #ccc;
    order: 1;
    aspect-ratio: 1 / 1.414;

    img {
      width: auto;
      height: 100%;
      margin: auto;
      object-fit: contain;
    }
  }

  &_name {
    display: flex;
    align-items: center;
    order: 2;
    line-height: 1.5;
  }

  &_count {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 1;
    width: 82px;
    background: rgba(77, 125, 197, 0.8);
    color: #fff;
    text-align: center;
  }

  &_countNum {
    font-size: rem(20);
  }
}
</style>
