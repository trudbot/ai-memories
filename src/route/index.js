import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../components/Home/index.vue'
import WorkspaceView from '../components/Workspace/index.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/workspace', component: WorkspaceView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
});