import { useToken } from '@/stores/token'
import { createRouter, createWebHashHistory } from "vue-router"

const router = createRouter({
  history: createWebHashHistory(),
  routes: []
})

router.beforeEach((to, from, next) => {
  const { token } = useToken()
  if ((to.name !== 'login') && token == '') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router