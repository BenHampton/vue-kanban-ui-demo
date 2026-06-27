import { createRouter, createWebHistory } from 'vue-router'
import BoardView from '@/views/BoardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'board',
      component: BoardView,
    },
    {
      path: '/tasks/:id',
      name: 'task',
      // lazy-loaded: separate chunk fetched when a task is opened
      component: () => import('@/views/TaskDetailView.vue'),
    },
  ],
})

export default router
