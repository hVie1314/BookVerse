<template>
    <div class="page-container">
      <Nav />
      <main class="order-history-page">
        <div class="content-wrapper">
          <OrderCategoryTabs @change-category="filterByStatus" :activeCategory="activeCategory" />
          <OrderSearchBar @search="filterBySearch" />
          
          <div v-if="loading" class="loading-indicator">
            <div class="spinner"></div>
            <p>Đang tải đơn hàng...</p>
          </div>
          
          <div v-else-if="filteredOrders.length === 0" class="no-orders">
            <p>Không tìm thấy đơn hàng nào.</p>
          </div>
          
          <template v-else>
            <OrderItem
              v-for="order in filteredOrders"
              :key="order._id"
              :status="order.orderStatus"
              :statusText="getStatusText(order.orderStatus)"
              :products="formatProducts(order.items)"
              :total="formatPrice(order.totalAmount)"
              :showActions="order.orderStatus === 'pending'"
              :cancelMessage="order.cancelReason"
              @pay="handlePayment(order._id, order.totalAmount)"
              @cancel="handleCancel(order._id)"
            />
          </template>
        </div>
      </main>
      <footer-form />
    </div>
</template>
  
<script>
    import OrderCategoryTabs from './OrderCategoryTabs.vue';
    import OrderSearchBar from './OrderSearchBar.vue';
    import OrderItem from './OrderItem.vue';
    import Nav from "@/components/navbar/Nav.vue";
    import FooterForm from "@/components/footer/footer.vue";
    import OrderService from '@/services/OrderService';
    import AuthenticationService from '@/services/AuthenticationService';
    import BookService from '@/services/BookService';
    // import Vue from 'vue'; // Import Vue để sử dụng Vue.set
    import eventBus from '@/eventBus.js';
    export default {
        name: 'OrderHistoryPage',
        components: {
            Nav,
            FooterForm,
            OrderCategoryTabs,
            OrderSearchBar,
            OrderItem
        },
        data() {
            return {
                orders: [],
                filteredOrders: [],
                loading: true,
                activeCategory: 'all',
                searchQuery: '',
                statusMap: {
                    'pending': 'CHỜ THANH TOÁN',
                    'success': 'HOÀN THÀNH',
                    'cancelled': 'ĐÃ HỦY'
                }
            }
        },
        async created() {
            await this.fetchOrders();
            
            // Kiểm tra tham số URL để hiển thị thông báo thanh toán thành công
            const params = new URLSearchParams(window.location.search);
            const paymentStatus = params.get('payment');
            const orderId = params.get('orderId');
            
            if (paymentStatus === 'success' && orderId) {
                // Xóa tham số khỏi URL
                window.history.replaceState({}, document.title, '/my-orders');
                
                // Hiển thị thông báo thành công
                eventBus.emit('show-alert', {
                show: true,
                type: 'success',
                title: 'Thanh toán thành công',
                message: 'Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn sẽ sớm được giao.',
                autoClose: true,
                duration: 5000
                });
            }
            },
        methods: {
            async fetchOrders() {
                try {
                    this.loading = true;
                    const user = AuthenticationService.getCurrentUser();
                    
                    if (!user) {
                        this.$router.push('/login');
                        return;
                    }
                    
                    const response = await OrderService.getAllOrders(user.id);
                    console.log('Dữ liệu đơn hàng từ API:', response.data);

                    if (response.data && response.data.success) {
                        const orders = response.data.data.orders || [];
                        
                        // Trường hợp 1: Xử lý đơn hàng có đầy đủ thông tin sản phẩm
                        for (let order of orders) {
                            if (order.items && Array.isArray(order.items)) {
                                // Kiểm tra nếu đơn hàng đã có thông tin sách đầy đủ
                                const hasFullBookInfo = order.items.some(item => 
                                    item.bookId && typeof item.bookId === 'object' && item.bookId._id);
                                    
                                if (hasFullBookInfo) {
                                    // Đơn hàng mới đã có thông tin sách đầy đủ, không cần fetch thêm
                                    console.log('Đơn hàng đã có thông tin sách đầy đủ:', order._id);
                                    continue;
                                }
                                
                                // Trường hợp 2: Đơn hàng cũ không có thông tin sách, cần fetch thêm
                                console.log('Đơn hàng cần fetch thông tin sách:', order._id);
                                const enrichedItems = await Promise.all(
                                    order.items.map(async (item) => {
                                        if (!item.bookId) {
                                            console.warn(`Item không có bookId trong đơn hàng ${order._id}`);
                                            return item;
                                        }
                                        
                                        try {
                                            // Lấy chi tiết sách
                                            const bookResponse = await BookService.getBookById(item.bookId);
                                            
                                            // Xử lý linh hoạt với nhiều cấu trúc dữ liệu có thể có
                                            let bookData = null;
                                            
                                            if (bookResponse.data && bookResponse.data.book) {
                                                bookData = bookResponse.data.book;
                                            } else if (bookResponse.data && bookResponse.data.data && bookResponse.data.data.book) {
                                                bookData = bookResponse.data.data.book;
                                            } else if (bookResponse.data && bookResponse.data.data) {
                                                bookData = bookResponse.data.data;
                                            }
                                            
                                            if (bookData) {
                                                return {
                                                    ...item,
                                                    book: {
                                                        title: bookData.title || 'Sách không xác định',
                                                        image: bookData.image || `https://picsum.photos/seed/${item.bookId}/150/200`,
                                                        author: bookData.author || 'Không có thông tin',
                                                        price: bookData.price || 0
                                                    }
                                                };
                                            }
                                            
                                            return item;
                                        } catch (error) {
                                            console.error(`Lỗi khi lấy thông tin sách ${item.bookId}:`, error);
                                            return item;
                                        }
                                    })
                                );
                                
                                // Cập nhật items với thông tin đầy đủ
                                order.items = enrichedItems;
                            }
                        }
                        
                        this.orders = orders;
                        this.filteredOrders = [...this.orders];
                    } else {
                        console.error('Lỗi khi lấy đơn hàng:', response.data);
                        this.orders = [];
                        this.filteredOrders = [];
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy đơn hàng:', error);
                    this.orders = [];
                    this.filteredOrders = [];
                } finally {
                    this.loading = false;
                }
            },
            
            filterByStatus(status) {
                this.activeCategory = status;
                
                // Cập nhật mảng filteredOrders hoàn toàn mới
                if (status === 'all') {
                    this.filteredOrders = this.searchQuery 
                        ? [...this.orders.filter(order => this.matchesSearch(order))]
                        : [...this.orders];
                } else {
                    this.filteredOrders = [...this.orders.filter(order => {
                        const statusMatch = order.orderStatus === status;
                        return this.searchQuery 
                            ? statusMatch && this.matchesSearch(order)
                            : statusMatch;
                    })];
                }

                 // Log để kiểm tra
                console.log(`Đã lọc theo trạng thái ${status}, có ${this.filteredOrders.length} đơn hàng.`);
                console.log('Danh sách trạng thái:', this.filteredOrders.map(o => o.orderStatus));
            },
            
            filterBySearch(query) {
                this.searchQuery = query;
                
                if (!query) {
                    this.filterByStatus(this.activeCategory);
                    return;
                }
                
                if (this.activeCategory === 'all') {
                    this.filteredOrders = this.orders.filter(order => this.matchesSearch(order));
                } else {
                    this.filteredOrders = this.orders.filter(order => 
                        order.orderStatus === this.activeCategory && this.matchesSearch(order));
                }
            },
            
            matchesSearch(order) {
                const query = this.searchQuery.toLowerCase();
                // Tìm kiếm theo ID đơn hàng 
                return order._id.toLowerCase().includes(query);
            },
            
            getStatusText(status) {
                return this.statusMap[status] || 'KHÔNG XÁC ĐỊNH';
            },
            
            formatProducts(items) {
                if (!items || !Array.isArray(items)) return [];
                
                return items.map(item => {
                    // Trường hợp 1: item có bookId là object đầy đủ (đơn hàng mới)
                    if (item.bookId && typeof item.bookId === 'object') {
                        const bookInfo = item.bookId;
                        let imageUrl = 'https://picsum.photos/300/400';
                        
                        // Xử lý ảnh từ chuỗi mảng
                        if (bookInfo.image) {
                            try {
                                if (typeof bookInfo.image === 'string' && 
                                    bookInfo.image.startsWith('[') && 
                                    bookInfo.image.endsWith(']')) {
                                    // Parse chuỗi thành mảng và lấy ảnh đầu tiên
                                    const imageArray = JSON.parse(bookInfo.image.replace(/'/g, '"'));
                                    if (imageArray && imageArray.length > 0) {
                                        imageUrl = imageArray[0];
                                    }
                                } else {
                                    imageUrl = bookInfo.image;
                                }
                            } catch (error) {
                                console.error('Lỗi khi xử lý ảnh:', error);
                            }
                        }
                        
                        // Tính toán tổng giá dựa trên số lượng nhân với đơn giá
                        const totalItemPrice = bookInfo.price * item.quantity || 0;
                        
                        return {
                            image: imageUrl,
                            title: bookInfo.title || `Sách không xác định`,
                            author: bookInfo.author || 'Không có thông tin',
                            quantity: item.quantity || 1,
                            price: this.formatPrice(totalItemPrice)
                        };
                    }
                    
                    // Trường hợp 2: item có book property từ enrichedItems (đơn hàng cũ đã được xử lý)
                    else if (item.book) {
                        let imageUrl = item.book.image;
                        
                        // Xử lý ảnh nếu là chuỗi mảng
                        if (typeof imageUrl === 'string' && 
                            imageUrl.startsWith('[') && 
                            imageUrl.endsWith(']')) {
                            try {
                                const imageArray = JSON.parse(imageUrl.replace(/'/g, '"'));
                                if (imageArray && imageArray.length > 0) {
                                    imageUrl = imageArray[0];
                                }
                            } catch (error) {
                                console.error('Lỗi khi xử lý ảnh sách:', error);
                            }
                        }
                        
                        const totalItemPrice = item.book.price * item.quantity || 0;
                        
                        return {
                            image: imageUrl || `https://picsum.photos/seed/${item.bookId}/150/200`,
                            title: item.book.title || `Sách #${item.bookId?.substring(0, 6)}`,
                            author: item.book.author || 'Không có thông tin',
                            quantity: item.quantity || 1,
                            price: this.formatPrice(totalItemPrice)
                        };
                    }
                    
                    // Trường hợp 3: Fallback khi không có thông tin (item không có bookId hoặc book)
                    return {
                        image: `https://picsum.photos/seed/${item._id || 'unknown'}/150/200`,
                        title: `Sách không xác định`,
                        author: 'Không có thông tin',
                        quantity: item.quantity || 1,
                        price: this.formatPrice(0)
                    };
                });
            },
            
            formatPrice(price) {
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(price).replace('₫', 'đ');
            },
            
            async handlePayment(orderId, amount) {
                try {
                    // Hiển thị trạng thái loading
                    eventBus.emit('show-alert', {
                        show: true,
                        type: 'warning',
                        title: 'Đang xử lý thanh toán',
                        message: 'Vui lòng đợi trong giây lát...',
                        autoClose: false
                    });
                    
                    // 1. Tạo đơn hàng mới dựa trên đơn hàng cũ
                    const order = this.orders.find(o => o._id === orderId);
                    if (!order) {
                        throw new Error('Không tìm thấy thông tin đơn hàng');
                    }
                    
                    const orderData = {
                        userId: AuthenticationService.getCurrentUser().id,
                        items: order.items.map(item => ({
                            bookId: item.bookId,
                            quantity: item.quantity
                        })),
                        totalAmount: order.totalAmount,
                        paymentMethod: 'MOMO',
                        isReorder: true, // Đánh dấu đây là đơn hàng tạo lại
                        originalOrderId: orderId // Tham chiếu đến đơn hàng gốc
                    };
                    
                    console.log('Tạo đơn hàng mới từ đơn hàng cũ:', orderData);
                    
                    // 2. Gọi API tạo đơn hàng mới
                    const orderResponse = await OrderService.createOrder(orderData);
                    console.log('Kết quả tạo đơn hàng:', orderResponse.data);
                    
                    if (orderResponse.data && (orderResponse.data.success || orderResponse.data._id)) {
                        // 3. Lấy ID đơn hàng mới
                        const newOrderId = orderResponse.data._id || 
                            orderResponse.data.data?._id || 
                            orderResponse.data.data?.order?._id;
                            
                        console.log('OrderId mới:', newOrderId);
                        
                        // 4. Tạo yêu cầu thanh toán với đơn hàng mới
                        const paymentResponse = await OrderService.createMomoPayment(newOrderId, amount);
                        
                        if (paymentResponse.data && 
                            (paymentResponse.data.payUrl || 
                            paymentResponse.data.url || 
                            (paymentResponse.data.data && paymentResponse.data.data.url))
                        ) {
                            // Lấy URL thanh toán từ bất kỳ trường nào có giá trị
                            const paymentUrl = paymentResponse.data.payUrl || 
                                            paymentResponse.data.url || 
                                            (paymentResponse.data.data && paymentResponse.data.data.url);
                            
                            console.log('URL thanh toán MoMo:', paymentUrl);
                            
                            // Lưu orderId mới để kiểm tra sau này
                            localStorage.setItem('pendingOrderId', newOrderId);
                            
                            // Chuyển hướng đến trang thanh toán MoMo THỰC SỰ như trong ShoppingCart
                            window.location.href = paymentUrl;
                            return;
                        }
                    }
                    
                    throw new Error('Không thể tạo đơn hàng hoặc thanh toán');
                } catch (error) {
                    console.error('Lỗi khi thanh toán:', error);
                    
                    // Nếu đang trong môi trường development, sử dụng fallback
                    if (process.env.NODE_ENV === 'development') {
                        console.log('Đang sử dụng fallback trong môi trường development');
                        // Phần fallback giữ nguyên...
                    }
                    
                    eventBus.emit('show-alert', {
                        show: true,
                        type: 'error',
                        title: 'Lỗi thanh toán',
                        message: 'Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại sau.',
                        autoClose: true
                    });
                }
            },
            
            // Sửa trong d:\Workspace\Software-engineering\project\BookVerse\source\frontend\src\components\historyorder\OrderHistoryPage.vue
            async handleCancel(orderId) {
    try {
        console.log('=== TIẾN TRÌNH HỦY ĐƠN HÀNG ===');
        console.log('Bắt đầu xử lý hủy đơn hàng với OrderID:', orderId);
        
        // Thay thế toàn bộ phần eventBus.emit hiện tại bằng đoạn code dưới đây
        eventBus.emit('show-alert', {
            show: true,
            type: 'warning',
            title: 'Xác nhận hủy đơn',
            message: 'Vui lòng nhập lý do hủy đơn hàng:',
            autoClose: false,
            showInput: true,
            inputPlaceholder: 'Nhập lý do hủy đơn hàng...',
            inputRequired: true,
            showChoices: true,
            confirmText: 'Xác nhận hủy',
            cancelText: 'Hủy bỏ',
            choices: [
                {
                    text: 'Hủy bỏ',
                    onClick: () => {
                        console.log('Đã hủy bỏ việc hủy đơn hàng');
                        eventBus.emit('hide-alert');
                    }
                },
                {
                    text: 'Xác nhận hủy',
                    onClick: (reason) => {
                        if (!reason || reason.trim() === '') {
                            // Thông báo lỗi nếu không có lý do
                            eventBus.emit('show-alert', {
                                show: true,
                                type: 'error',
                                title: 'Lỗi',
                                message: 'Vui lòng nhập lý do hủy đơn hàng',
                                autoClose: true,
                                duration: 2000
                            });
                            return;
                        }
                        
                        // Đóng modal
                        eventBus.emit('hide-alert');
                        
                        // Xử lý hủy đơn hàng với lý do từ người dùng
                        setTimeout(() => {
                            this.processCancelOrder(orderId, reason);
                        }, 100);
                    }
                }
            ]
        });
    } catch (error) {
        console.error('Lỗi khi xử lý hủy đơn hàng:', error);
        eventBus.emit('show-alert', {
            show: true,
            type: 'error',
            title: 'Lỗi',
            message: 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.',
            autoClose: true
        });
    }
},

            // Thêm vào OrderHistoryPage.vue
            async processCancelOrder(orderId, reason) {
    try {
        console.log('Bắt đầu xử lý hủy đơn hàng');
        
        // Hiển thị trạng thái loading
        eventBus.emit('show-alert', {
            show: true,
            type: 'warning',
            title: 'Đang xử lý',
            message: 'Vui lòng đợi trong giây lát...',
            autoClose: false
        });
        
        // Gửi yêu cầu hủy đơn hàng với lý do từ người dùng
        console.log('Gửi API hủy đơn hàng:', orderId);
        console.log('Lý do hủy từ người dùng:', reason);
        const cancelResponse = await OrderService.createCancelRequest(orderId, reason);
        console.log('Kết quả hủy đơn hàng:', cancelResponse.data);
        
        // Cập nhật UI đơn hàng
        console.log('Cập nhật UI trạng thái đơn hàng');
        const orderIndex = this.orders.findIndex(order => order._id === orderId);
        
        if (orderIndex !== -1) {
            // Cập nhật đơn hàng với Vue 3 không cần $set
            this.orders[orderIndex] = {
                ...this.orders[orderIndex],
                orderStatus: 'cancelled',
                cancelReason: reason
            };
            
            // Cập nhật lại mảng đã lọc
            this.filterByStatus(this.activeCategory);
        }
        
        // Đóng thông báo loading
        eventBus.emit('hide-alert');
        
        // Đợi một chút để đảm bảo thông báo loading đã đóng
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Hiển thị thông báo thành công
        eventBus.emit('show-alert', {
            show: true,
            type: 'success',
            title: 'Thành công',
            message: 'Đã hủy đơn hàng thành công.',
            autoClose: true,
            duration: 3000
        });
    } catch (error) {
        console.error('Lỗi khi hủy đơn hàng:', error);
        eventBus.emit('show-alert', {
            show: true,
            type: 'error',
            title: 'Lỗi',
            message: 'Đã xảy ra lỗi khi hủy đơn hàng. Vui lòng thử lại sau.',
            autoClose: true
        });
        
        // Nếu lỗi, vẫn cần cập nhật lại danh sách đơn hàng để đảm bảo dữ liệu đồng bộ
        await this.fetchOrders();
    }
}
        }
    }
</script>

<style scoped>
.page-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    min-height: 100vh;
    background-color: rgb(244, 235, 225);
}

.order-history-page {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 600;
    margin: 20px 0;
    margin-top: 100px;
}

.content-wrapper {
    width: 83%; /* Giữ nguyên width 85% */
    margin: 0 auto;
}

/* Thêm CSS cho trạng thái loading và không có đơn hàng */
.loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    width: 100%;
}

/* Override component font sizes */
:deep(.order-category) {
    font-size: 20px !important;
    padding: 30px 60px 20px;
}

:deep(.search-placeholder) {
    font-size: 18px !important;
}

:deep(.order-status) {
    font-size: 20px !important;
}

:deep(.product-title) {
    font-size: 18px !important;
}

:deep(.product-author) {
    font-size: 16px !important;
}

:deep(.product-quantity),
:deep(.product-price) {
    font-size: 18px !important;
}

:deep(.total-label) {
    font-size: 16px !important;
}

:deep(.total-amount) {
    font-size: 32px !important;
}

:deep(.action-buttons) {
    font-size: 18px !important;
    width: auto !important;
}

:deep(.action-button) {
    padding: 14px 40px !important;
}

:deep(.cancel-message) {
    font-size: 18px !important;
}

@media (max-width: 991px) {
    .content-wrapper {
        width: 95%;
        padding: 0 10px;
    }
}
</style>