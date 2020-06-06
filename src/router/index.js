import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

// import Categories from '../components/goods/Categories.vue'
const Categories = () => import(/* webpackChunkName: "Categories_Goods_Params" */ '../components/goods/Categories.vue')
// import Goods from '../components/goods/Goods.vue'
const Goods = () => import(/* webpackChunkName: "Categories_Goods_Params" */ '../components/goods/Goods.vue')
// import Params from '../components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "Categories_Goods_Params" */ '../components/goods/Params.vue')
// import AddGoods from '../components/goods/addGoods.vue'
const AddGoods = () => import(/* webpackChunkName: "addGoods_Order_Report" */ '../components/goods/addGoods.vue')

// import Order from '../components/order/Order.vue'
const Order = () => import(/* webpackChunkName: "addGoods_Order_Report" */ '../components/order/Order.vue')
// import Report from '../components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "addGoods_Order_Report" */ '../components/report/Report.vue')

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
      { path: '/goods/add', component: AddGoods, name:'add'},
      { path: '/orders', component: Order},
      { path: '/reports', component: Report}
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