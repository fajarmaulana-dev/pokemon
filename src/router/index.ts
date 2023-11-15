import { createRouter, createWebHistory } from 'vue-router';
import routes from '~pages';

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    return savedPosition || { top: 0, left: 0 };
  },
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
