import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../components/Home/index.vue'
import WorkspaceView from '../components/Workspace/index.vue'
import WorkspaceHome from '../components/Workspace/components/Home/index.vue'
import Chat from '../chat.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/chat', component: Chat},
  { 
    path: '/workspace', 
    component: WorkspaceView,
    children: [
      {
        path: '',
        component: WorkspaceHome,
      },
      {
        path: 'home',
        component: WorkspaceHome
      }
    ]
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});