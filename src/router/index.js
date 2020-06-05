import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Goods from '../components/goods/Goods.vue'
import Params from '../components/goods/Params.vue'
import AddGoods from '../components/goods/addGoods.vue'

Vue.use(VueRouter)


const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/categories', component: Categories},
      { path: '/goods', component: Goods , name: 'goods'},
      { path: '/params', component: Params},
      { path: '/goods/add', component: AddGoods, name:'add'}
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenstr = window.sessionStorage.getItem('token');
  if (!tokenstr) return next('/login');
  next();
})

export default router;