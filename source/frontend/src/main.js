// filepath: d:\Workspace\Software-engineering\project\BookVerse\source\frontend\src\main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

// Cấu hình cho toast
const toastOptions = {
    position: 'top-right',
    timeout: 1500,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
    containerClassName: "toast-container", // Thêm class để dễ styling
    toastClassName: "bookverse-toast", // Thêm class cho mỗi toast
    bodyClassName: "toast-body" // Class cho phần nội dung toast
}


app.use(router)
app.use(Toast, toastOptions)

// Mount ứng dụng
app.mount('#app')
