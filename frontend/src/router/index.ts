import AuthPage from '@/pages/AuthPage.vue'
import HomePage from '@/pages/HomePage/index.vue'
import NotFound from '@/pages/NotFound.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path:"/",
      component: HomePage,
      name: "Home",
    },
    {
      path:"/auth/",
      component: AuthPage,
      name: "Auth"
    }
  ],
})

export default router
