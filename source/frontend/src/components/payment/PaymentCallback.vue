<template>
    <div class="payment-processing">
        <div class="loading-spinner"></div>
        <p>Đang xử lý kết quả thanh toán...</p>
    </div>
</template>
  
<script>
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import OrderService from '@/services/OrderService';
    //   import eventBus from '@/eventBus.js';
    
    export default {
        name: 'PaymentCallback',
        setup() {
            const router = useRouter();
    
            onMounted(async () => {
                // Đọc tham số từ URL
                const params = new URLSearchParams(window.location.search);
                const resultCode = params.get('resultCode');
                const orderId = params.get('orderId');
            
                try {
                    // Cập nhật trạng thái đơn hàng (nếu cần)
                    if (resultCode === '0' && orderId) {
                        try {
                            await OrderService.checkTransactionStatus(orderId);
                        } catch (error) {
                            console.error('Lỗi khi kiểm tra trạng thái giao dịch:', error);
                        }
                    }
            
                    // Chuyển hướng đến trang đơn hàng
                    router.replace({
                        path: '/my-orders',
                        query: { 
                            payment: 'success',
                            orderId: orderId 
                        }
                    });
                } catch (error) {
                    console.error('Lỗi xử lý callback:', error);
                    router.replace('/my-orders');
                }
            });
    
            return {};
        }
    }
</script>
  
<style scoped>
    .payment-processing {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: #f4ebe1;
    }
  
    .loading-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border-left-color: #4d2900;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
  
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>