<template>
    <nav class="guest-menu">
        <div class="menu-container">
            <div class="close-button" @click="$emit('close')">
                <i class="fa-solid fa-xmark"></i>
            </div>

            <div class="menu-content">
                <transition name="divider-expand">
                    <hr class="menu-divider" />
                </transition>
                <div class="menu-items">
                    <transition-group name="item-appear">
                        <button key="catalog" class="menu-item" @click="goToCategory">Danh mục sản phẩm</button>
                        <button key="orders" class="menu-item menu-item-orders">Đơn hàng của tôi</button>
                    </transition-group>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'UserMenu',
    emits: ['close'],
    mounted() {
        // Thêm index cho animation tuần tự của menu items
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.style.setProperty('--index', index);
        });
    },
    methods: {
        goToCategory() {
            this.$router.push({ name: 'category' });
        },
    },
}
</script>
<style scoped>
    .guest-menu {
        margin-left: auto;
        margin-right: auto;
        width: 300px; /* Đủ rộng để hiển thị text */
        height: 100vh;
        font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
        font-size: 18px;
        color: #f2f2f2;
        font-weight: 400;
        text-align: right;
        line-height: 2;
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        z-index: 1000;
        display: flex;
        justify-content: center;
        background-color: rgba(36, 20, 0, 0.9);
    }

    .menu-container {
        display: flex;
        width: 80%;
        padding-top: 58px;
        padding-bottom: 50px;
        flex-direction: column;
        align-items: stretch;
    }

    .close-button {
        color: #f2f2f2;
        font-size: 24px;
        cursor: pointer;
        align-self: flex-end;
        text-align: left;
        margin-bottom: 15px;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        transition: transform 0.2s;
    }

    .close-button:hover {
        transform: rotate(90deg);
        color: #ff6b6b;
    }

    .menu-icon {
        aspect-ratio: 1.12;
        object-fit: contain;
        object-position: center;
        width: 18px;
        align-self: flex-end;
        margin-right: 20px;
    }

    .menu-content {
        display: flex;
        margin-top: 18px;
        margin-bottom: -650px;
        width: 100%;
        padding: 0 9px;
        flex-direction: column;
        align-items: stretch;
    }

    .menu-divider {
        border: 0;
        border-top: 1px solid rgba(105, 103, 100, 0.8);
        width: 290px;
        max-width: 100%;
        margin: 0;
    }

    .menu-items {
        align-self: flex-end;
        margin-top: 22px;
    }

    .menu-item {
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
        padding: 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    .menu-item-orders {
         margin-top: 17px;
    }

    .menu-item:hover {
        background-color: rgba(77, 41, 0, 0.1);
        color: #4d2900;
    }

    .menu-slide-enter-active {
        animation: slide-in 0.6s cubic-bezier(0.25, 0.1, 0.25, 1); /* Tăng từ 0.3s lên 0.6s */
    }
    .menu-slide-leave-active {
        animation: slide-in 0.5s reverse cubic-bezier(0.25, 0.1, 0.25, 1); /* Tăng từ 0.3s lên 0.5s */
    }
    @keyframes slide-in {
        0% {
            transform: translateX(100%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }

    /* Animation cho divider */
    .divider-expand-enter-active {
        animation: expand 0.8s ease-out forwards; /* Tăng từ 0.5s lên 0.8s */
        animation-delay: 0.4s; /* Tăng từ 0.2s lên 0.4s */
    }
    @keyframes expand {
        0% {
            width: 0;
            opacity: 0;
        }
        50% { /* Thêm mốc 50% để hiệu ứng rõ ràng hơn */
            width: 145px;
            opacity: 0.7;
        }
        100% {
            width: 290px;
            opacity: 1;
        }
    }

    /* Animation cho menu items */
    .item-appear-enter-active {
        transition: all 0.7s ease-out; /* Tăng từ 0.4s lên 0.7s */
        transition-delay: calc(var(--index) * 0.2s + 0.5s); /* Tăng khoảng cách giữa các items */
    }
    .item-appear-enter-from {
        opacity: 0;
        transform: translateX(40px); /* Tăng khoảng cách di chuyển */
    }

    .menu-item {
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
        padding: 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        transition: color 0.4s, transform 0.4s, text-shadow 0.4s;
    }

    .menu-item:hover {
        background-color: rgba(77, 41, 0, 0.1);
        color: #fffaf5;
        transform: translateX(-5px);
        text-shadow: 0 0 8px rgba(255, 250, 245, 0.5);
    }

    /* Cải thiện hiệu ứng cho nút đóng */
    .close-button {
        /* Giữ nguyên style hiện tại */
        transform-origin: center;
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.5s; /* Tăng từ 0.3s lên 0.5s */
    }
    
    .close-button:hover {
        transform: rotate(90deg) scale(1.2);
        color: #ff6b6b;
    }
</style>
  