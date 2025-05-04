import { createRouter, createWebHistory } from 'vue-router'
import AuthenticationService from '../services/AuthenticationService'

const Home = () => import('../components/Home.vue')
const Login = () => import('../components/Login.vue')  
const Register = () => import('../components/Register.vue')
const Profile = () => import('../components/profile/ProfileUser.vue')
const CategoryPage = () => import('../components/categorypage/CategoryPage.vue') 
const ShoppingCart = () => import('../components/shoppingcart/ShoppingCart.vue')
const Payment = () => import('../components/PaymentCallback.vue')
const OrderHistory = () => import('../components/historyorder/OrderHistoryPage.vue')
const ProductDetail = () => import('../components/ProductDetail/ProductDetailPage.vue')
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/category',
    name: 'category',
    component: CategoryPage
  },
  {
    path: '/cart',
    name: 'cart',
    component: ShoppingCart,
  },
  {
    path: '/payment/callback',
    name: 'PaymentCallback',
    component: Payment,
  },
  {
    path: '/my-orders',
    name: 'my-orders',
    component: OrderHistory,
    meta: { requiresAuth: true }
  },
  {
    path: '/productdetail',
    name: 'product-detail', 
    component: ProductDetail,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Middleware kiểm tra đăng nhập trước khi vào trang
router.beforeEach((to, from, next) => {
  const isLoggedIn = AuthenticationService.isLoggedIn()
  
  // Nếu trang yêu cầu đăng nhập và chưa đăng nhập
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } 
  // Nếu trang chỉ dành cho khách và đã đăng nhập
  else if (to.meta.guestOnly && isLoggedIn) {
    next({ name: 'home' })
  } 
  else {
    next()
  }
})

export default router