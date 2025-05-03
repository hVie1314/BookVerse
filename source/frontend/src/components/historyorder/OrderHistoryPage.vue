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
                    'processing': 'ĐANG XỬ LÝ',
                    'shipping': 'ĐANG VẬN CHUYỂN',
                    'completed': 'HOÀN THÀNH',
                    'cancelled': 'ĐÃ HỦY'
                }
            }
        },
        async created() {
            await this.fetchOrders();
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

                    if (response.data && response.data.success) {
                        const orders = response.data.data || [];
                        
                        // Lấy thông tin chi tiết cho từng sách trong mỗi đơn hàng
                        for (let order of orders) {
                            if (order.items && Array.isArray(order.items)) {
                                console.log(`Order ${order._id} has ${order.items.length} items`);
                                
                                // Lấy thông tin chi tiết cho từng sản phẩm
                                const enrichedItems = await Promise.all(
                                    order.items.map(async (item) => {
                                        try {
                                            console.log(`Đang lấy thông tin sách với ID: ${item.bookId}`);
                                            const bookResponse = await BookService.getBookById(item.bookId);
                                            
                                            console.log(`Response đầy đủ cho sách ${item.bookId}:`, JSON.stringify(bookResponse.data));
                                            
                                            // Xử lý linh hoạt với nhiều cấu trúc dữ liệu có thể có
                                            let bookData = null;
                                            
                                            // Đúng cấu trúc response: success -> data -> book
                                            if (bookResponse.data && bookResponse.data.success && bookResponse.data.data && bookResponse.data.data.book) {
                                                bookData = bookResponse.data.data.book;
                                                console.log("Trích xuất dữ liệu sách từ cấu trúc chuẩn: data.data.book");
                                            } 
                                            // Cấu trúc data -> book
                                            else if (bookResponse.data && bookResponse.data.data && bookResponse.data.data.book) {
                                                bookData = bookResponse.data.data.book;
                                                console.log("Trích xuất dữ liệu sách từ: data.data.book");
                                            }
                                            // Cấu trúc data -> { book properties }
                                            else if (bookResponse.data && bookResponse.data.data && bookResponse.data.data.title) {
                                                bookData = bookResponse.data.data;
                                                console.log("Trích xuất dữ liệu sách từ: data.data (có title)");
                                            }
                                            // Cấu trúc { book properties }
                                            else if (bookResponse.data && bookResponse.data.title) {
                                                bookData = bookResponse.data;
                                                console.log("Trích xuất dữ liệu sách từ: data (có title)");
                                            }
                                            // Cấu trúc { book: { book properties } }
                                            else if (bookResponse.data && bookResponse.data.book) {
                                                bookData = bookResponse.data.book;
                                                console.log("Trích xuất dữ liệu sách từ: data.book");
                                            }
                                            
                                            if (bookData) {
                                                console.log(`Đã tìm thấy dữ liệu sách: ${JSON.stringify(bookData)}`);
                                                return {
                                                    ...item,
                                                    book: {
                                                        title: bookData.title || bookData.name || 'Sách không xác định',
                                                        image: bookData.image || bookData.coverImage || `https://picsum.photos/seed/${item.bookId}/150/200`,
                                                        author: bookData.author || bookData.authorName || 'Không có thông tin',
                                                        price: bookData.price || bookData.salePrice || 0
                                                    }
                                                };
                                            }
                                            
                                            console.warn(`Không tìm thấy dữ liệu hợp lệ cho sách ${item.bookId}`);
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
                
                if (status === 'all') {
                    this.filteredOrders = this.searchQuery 
                        ? this.orders.filter(order => this.matchesSearch(order))
                        : [...this.orders];
                } else {
                    this.filteredOrders = this.orders.filter(order => {
                        const statusMatch = order.orderStatus === status;
                        return this.searchQuery 
                            ? statusMatch && this.matchesSearch(order)
                            : statusMatch;
                    });
                }
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
                
                console.log('Raw order items:', JSON.stringify(items));
                
                return items.map(item => {
                    // Kiểm tra nếu item đã có thông tin book đầy đủ
                    if (item.book) {
                        // Tính toán tổng giá dựa trên số lượng nhân với đơn giá
                        const totalItemPrice = item.book.price * item.quantity || 0;
                        
                        return {
                            image: item.book.image || `https://picsum.photos/seed/${item.bookId}/150/200`,
                            title: item.book.title || `Sách #${item.bookId?.substring(0, 6)}`,
                            author: item.book.author || 'Không có thông tin',
                            quantity: item.quantity || 1,
                            price: this.formatPrice(totalItemPrice)
                        };
                    }
                    
                    // Fallback cho trường hợp không có thông tin book
                    return {
                        image: `https://picsum.photos/seed/${item.bookId}/150/200`,
                        title: `Sách #${item.bookId?.substring(0, 6)}`,
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
                        type: 'info',
                        title: 'Đang xử lý thanh toán',
                        message: 'Vui lòng đợi trong giây lát...',
                        autoClose: false
                    });
                    
                    // Tạo yêu cầu thanh toán
                    const paymentResponse = await OrderService.createMomoPayment(orderId, amount);
                    
                    if (paymentResponse.data && (paymentResponse.data.payUrl || paymentResponse.data.url)) {
                        // Lấy URL thanh toán từ bất kỳ trường nào có giá trị
                        const paymentUrl = paymentResponse.data.payUrl || paymentResponse.data.url;
                        
                        // Chuyển hướng người dùng đến trang thanh toán MoMo
                        window.location.href = paymentUrl;
                    } else {
                        eventBus.emit('show-alert', {
                            show: true,
                            type: 'error',
                            title: 'Lỗi thanh toán',
                            message: 'Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.',
                            autoClose: true
                        });
                    }
                } catch (error) {
                    console.error('Lỗi khi thanh toán:', error);
                    eventBus.emit('show-alert', {
                        show: true,
                        type: 'error',
                        title: 'Lỗi thanh toán',
                        message: 'Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại sau.',
                        autoClose: true
                    });
                }
            },
            
            async handleCancel(orderId) {
                try {
                    eventBus.emit('show-alert', {
                        show: true,
                        type: 'warning',
                        title: 'Xác nhận hủy đơn',
                        message: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
                        autoClose: false,
                        showChoices: true,
                        choices: [
                            {
                                text: 'Hủy',
                                onClick: () => {
                                    eventBus.emit('hide-alert');
                                }
                            },
                            {
                                text: 'Xác nhận',
                                onClick: async () => {
                                    eventBus.emit('hide-alert');
                                    
                                    try {
                                        // Hiển thị trạng thái loading
                                        eventBus.emit('show-alert', {
                                            show: true,
                                            type: 'info',
                                            title: 'Đang xử lý',
                                            message: 'Vui lòng đợi trong giây lát...',
                                            autoClose: false
                                        });
                                        
                                        // Gửi yêu cầu hủy đơn hàng
                                        await OrderService.createCancelRequest(orderId, 'Hủy bởi người dùng');
                                        
                                        // Hiển thị thông báo thành công
                                        eventBus.emit('show-alert', {
                                            show: true,
                                            type: 'success',
                                            title: 'Thành công',
                                            message: 'Đã gửi yêu cầu hủy đơn hàng thành công.',
                                            autoClose: true
                                        });
                                        
                                        // Cập nhật lại danh sách đơn hàng
                                        await this.fetchOrders();
                                    } catch (error) {
                                        console.error('Lỗi khi hủy đơn hàng:', error);
                                        eventBus.emit('show-alert', {
                                            show: true,
                                            type: 'error',
                                            title: 'Lỗi',
                                            message: 'Đã xảy ra lỗi khi hủy đơn hàng. Vui lòng thử lại sau.',
                                            autoClose: true
                                        });
                                    }
                                }
                            }
                        ]
                    });
                } catch (error) {
                    console.error('Lỗi khi xử lý hủy đơn hàng:', error);
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
    background-color: #fffaf5;
}

.order-history-page {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 600;
    margin: 20px 0;
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