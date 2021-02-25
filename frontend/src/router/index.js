import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login.vue"
import Signup from "../views/Signup.vue"
import Home from "../views/Home.vue"
import Profile from "../views/Profile.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
]

const router = new VueRouter({
  routes,
  mode: "history"
})

export default router
