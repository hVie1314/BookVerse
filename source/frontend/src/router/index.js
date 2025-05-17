import { createRouter, createWebHistory } from 'vue-router'
import AuthenticationService from '../services/AuthenticationService'

const Home = () => import('../components/Home.vue')
const Login = () => import('../components/Login.vue')  
const Register = () => import('../components/Register.vue')
const Profile = () => import('../components/profile/ProfileUser.vue')
const CategoryPage = () => import('../components/categorypage/CategoryPage.vue') 
const ShoppingCart = () => import('../components/shoppingcart/ShoppingCart.vue')
const OrderHistory = () => import('../components/historyorder/OrderHistoryPage.vue')
const ProductDetail = () => import('../components/ProductDetail/ProductDetailPage.vue')
const PaymentCallback = () => import('../components/payment/PaymentCallback.vue')
const StaffPage = () => import('../components/staffpage/StaffLayout.vue')
const ProductManagement = () => import('../components/staffpage/ProductManagement.vue')
const StoreOverview = () => import('../components/staffpage/StoreOverview.vue')
const StaffInfo = () => import('../components/staffpage/StaffInfo.vue')

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
    path: '/my-orders',
    name: 'my-orders',
    component: OrderHistory,
    meta: { requiresAuth: true }
  },
  {
    path: '/productdetail/:id',
    name: 'product-detail', 
    component: ProductDetail,
    props: true
  },
  {
    path: '/payment/callback',
    name: 'payment-callback',
    component: PaymentCallback,
    meta: { requiresAuth: false }
  },
  {
    path: '/staff',
    component: StaffPage,
    meta: { requiresAuth: true, requiresStaff: true },
    children: [
      {
        path: '', 
        redirect: '/staff/overview'
      },
      {
        path: 'overview',
        name: 'staff-overview',
        component: StoreOverview
      },
      {
        path: 'products',
        name: 'staff-products',
        component: ProductManagement
      },
      {
        path: 'info',
        name: 'staff-info',
        component: StaffInfo
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Middleware kiểm tra đăng nhập trước khi vào trang
router.beforeEach((to, from, next) => {
  const isLoggedIn = AuthenticationService.isLoggedIn()
  const currentUser = AuthenticationService.getCurrentUser()
  
  // Nếu đang đi đến trang chủ và đã đăng nhập là staff
  if (to.path === '/' && isLoggedIn && currentUser && (currentUser.role === 'staff' || currentUser.role === 'admin')) {
    // Chuyển hướng đến trang staff
    next({ path: '/staff' })
  } else if (to.matched.some(record => record.meta.requiresStaff)) {
    // Nếu trang yêu cầu quyền Staff
    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff')) {
      // Nếu đã đăng nhập và có quyền staff/admin, cho phép truy cập
      next()
    } else {
      // Nếu đã đăng nhập nhưng không có quyền, chuyển hướng về trang chủ
      next({ name: 'home' })
    }
  }
  // Nếu trang yêu cầu đăng nhập và chưa đăng nhập
  else if (to.meta.requiresAuth && !isLoggedIn) {
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