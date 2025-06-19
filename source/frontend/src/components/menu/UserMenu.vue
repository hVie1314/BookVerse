<template>
    <!-- Sử dụng Bootstrap Offcanvas thay vì nav -->
    <div class="offcanvas offcanvas-end user-menu" tabindex="-1" id="userOffcanvas" aria-labelledby="userOffcanvasLabel">
        <div class="menu-container">
            <div class="close-button" @click="closeMenu">
                <i class="fa-solid fa-xmark"></i>
            </div>

            <div class="menu-content">
                <transition name="divider-expand">
                    <hr class="menu-divider" />
                </transition>
                <div class="menu-items">
                    <transition-group name="item-appear">
                        <button key="catalog" class="menu-item" @click="goToCategory">Danh mục sản phẩm</button>
                        <button key="orders" class="menu-item menu-item-orders" @click="goToMyOrders">Đơn hàng của tôi</button>
                    </transition-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserMenu',
    emits: ['close'],
    data() {
        return {
            offcanvas: null
        }
    },
    mounted() {
        // Thêm index cho animation tuần tự của menu items
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.style.setProperty('--index', index);
        });

        // Khởi tạo Bootstrap Offcanvas
        this.initOffcanvas();
    },
    methods: {
        initOffcanvas() {
            if (typeof window.bootstrap !== 'undefined') {
                const offcanvasElement = document.getElementById('userOffcanvas');
                this.offcanvas = new window.bootstrap.Offcanvas(offcanvasElement, {
                    backdrop: true,
                    scroll: false
                });
                
                // Thêm event listener để bắt sự kiện khi offcanvas đóng
                offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
                    this.$emit('close');
                });
                
                // Hiển thị offcanvas ngay sau khi khởi tạo
                this.offcanvas.show();
            } else {
                console.warn('Bootstrap không được tìm thấy. Hãy chắc chắn đã import Bootstrap JS.');
            }
        },
        closeMenu() {
            if (this.offcanvas) {
                this.offcanvas.hide();
            } else {
                this.$emit('close');
            }
        },
        goToCategory() {
            this.$router.push({ name: 'category' });
            this.closeMenu();
        },
        goToMyOrders() {
            this.$router.push({ name: 'my-orders' });
            this.closeMenu();
        }
    },
    beforeUnmount() {
        // Đảm bảo đóng offcanvas khi component bị hủy
        if (this.offcanvas) {
            try {
                this.offcanvas.hide();
            } catch (e) {
                console.log('Offcanvas already hidden');
            }
        }
    }
}
</script>

<style>
    /* CSS global (không scoped) để ghi đè Bootstrap */
    body {
        /* Ngăn không cho Bootstrap thay đổi padding */
        padding-right: 0 !important; 
        overflow-y: auto !important;
    }

    /* Giữ nguyên vị trí header */
    .header-container {
        padding-right: 0 !important;
        width: 100% !important;
    }

    /* Sửa lỗi backdrop */
    .offcanvas-backdrop {
        width: 100vw !important;
        position: fixed !important;
    }

    /* Sửa lỗi offcanvas */
    .offcanvas {
        position: fixed !important;
    }   

    /* Ngăn không cho backdrop và modal ảnh hưởng tới layout */
    .modal-open .modal,
    .offcanvas-open .offcanvas-backdrop {
        padding-right: 0 !important;
    }
</style>

<style scoped>
    /* Style cho Bootstrap Offcanvas */
    .offcanvas.user-menu {
        width: 300px;
        font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
        font-size: 18px;
        color: #f2f2f2;
        font-weight: 400;
        text-align: right;
        line-height: 2;
        background-color: rgba(36, 20, 0, 0.9);
    }

    /* Hiệu ứng transition cho offcanvas */
    .offcanvas-end {
        transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
    }

    /* Giữ nguyên phần còn lại của CSS, chỉ xóa .guest-menu */
    .menu-container {
        display: flex;
        width: 80%;
        margin: 0 auto;
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
        transform-origin: center;
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.5s;
    }

    .close-button:hover {
        transform: rotate(90deg) scale(1.2);
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
        transition: color 0.4s, transform 0.4s, text-shadow 0.4s;
    }

    .menu-item-orders {
         margin-top: 17px;
    }

    .menu-item:hover {
        background-color: rgba(77, 41, 0, 0.1);
        color: #fffaf5;
        transform: translateX(-5px);
        text-shadow: 0 0 8px rgba(255, 250, 245, 0.5);
    }

    /* Animation cho divider */
    .divider-expand-enter-active {
        animation: expand 0.8s ease-out forwards;
        animation-delay: 0.4s;
    }
    @keyframes expand {
        0% {
            width: 0;
            opacity: 0;
        }
        50% {
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
        transition: all 0.7s ease-out;
        transition-delay: calc(var(--index) * 0.2s + 0.5s);
    }
    .item-appear-enter-from {
        opacity: 0;
        transform: translateX(40px);
    }
</style>