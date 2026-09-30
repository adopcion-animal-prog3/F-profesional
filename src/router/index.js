import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import PetsView from '../views/PetsView.vue'
import PetDetailView from '../views/PetDetailView.vue'
import { isAuthenticated } from '../auth/session'

const publicRoutes = ['login', 'registro']

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/registro',
    name: 'registro',
    component: RegisterView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/mascotas',
    name: 'mascotas',
    component: PetsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/mascotas/:id',
    name: 'mascota-detalle',
    component: PetDetailView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: () => {
      return isAuthenticated() ? '/dashboard' : '/login'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const needsAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (needsAuth && !isAuthenticated()) {
    next({ name: 'login' })
    return
  }

  if (publicRoutes.includes(to.name) && isAuthenticated()) {
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router
