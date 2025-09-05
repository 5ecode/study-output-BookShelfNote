import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import BookListView from '../views/BookListView.vue';
import BookAddView from '../views/BookAddView.vue';
import SeriesView from '../views/SeriesView.vue';
import AuthorView from '../views/AuthorView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'BookList',
    component: BookListView,
  },
  {
    path: '/add',
    name: 'BookAdd',
    component: BookAddView,
  },
  { path: '/series/:series',
    name: 'Series',
    component: SeriesView,
    props: true,
  },
  { path: '/author/:author',
    name: 'Author',
    component: AuthorView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

