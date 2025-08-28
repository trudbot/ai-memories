import { createWebHistory, createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../components/Home/index.vue'
import WorkspaceView from '../components/Workspace/index.vue'
import WorkspaceHome from '../components/Workspace/components/Home/index.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/chat', component: () => import('../chat.vue') },
  { path: '/tpl', component: () => import('../template/themes/dark/tpl3.vue') },
  { path: '/memories', component: () => import('../components/Memories/index.vue') },
  { 
    path: '/workspace', 
    component: WorkspaceView,
    children: [
      {
        path: '',
        component: WorkspaceHome
      },
      {
        path: 'home',
        component: WorkspaceHome
      },
      {
        path: 'memento',
        component: () => import('@/components/Workspace/components/MementoList/index.vue')
      },
      {
        path: 'myWorks',
        component: () => import('@/components/Workspace/components/MyWorks/index.vue')
      },
      {
        path: 'memento-chat/:id',
        component: () => import('@/components/Workspace/components/MementoChat/index.vue')
      },
      {
        path: 'memento-edit/:id',
        component: () => import('@/components/Workspace/components/MementoEdit/index.vue')
      }
    ]
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});