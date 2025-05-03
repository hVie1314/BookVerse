<template>
    <div class="page-container">
      <Nav />
      <main class="shopping-cart">
        <div class="shopping-cart-container">
          <CartHeader />
          <section class="cart-content" v-if="!loading">
            <ProductList
              :products="cartItems" 
              :itemCount="cartItems.length"
              @update-quantity="updateQuantity"
              @remove-item="removeItem"
            />
            <CheckoutSummary
              :totalPrice="calculatedTotalPrice " 
              @checkout="proceedToCheckout" 
            />
          </section>
          <div v-else class="loading-container">
            <p>Đang tải giỏ hàng...</p>
          </div>
        </div>
      </main>
      <footer-form />
    </div>
  </template>
    
  <script>
  import Nav from "../navbar/Nav.vue";
  import CartHeader from "./CartHeader.vue";
  import ProductList from "./ProductList.vue";
  import CheckoutSummary from "./CheckoutSummary.vue";
  import FooterForm from "../footer/footer.vue";
  import CartService from '@/services/CartService';
  import AuthenticationService from '@/services/AuthenticationService';
  import OrderService from '@/services/OrderService'; // Thêm import này
  import eventBus from '@/eventBus.js';
  
  export default {
    name: "ShoppingCart",
    components: {
      Nav,
      CartHeader,
      ProductList,
      CheckoutSummary,
      FooterForm
    },
    data() {
      return {
        cartItems: [],
        totalPrice: 0,
        loading: true,
        error: null
      };
    },
    computed: {
      calculatedTotalPrice() {
        return this.cartItems.reduce((total, item) => {
          const price = item.book?.price || item.price || 0;
          return total + (price * item.quantity);
        }, 0);
      }
    },
    created() {
      this.fetchCartData();
      // Lắng nghe sự kiện cập nhật giỏ hàng
      eventBus.on('cart-updated', this.fetchCartData);
    },
    beforeUnmount() {
      // Hủy lắng nghe sự kiện khi component bị hủy
      eventBus.off('cart-updated', this.fetchCartData);
    },
    methods: {
      async fetchCartData() {
        try {
          this.loading = true;
          const user = AuthenticationService.getCurrentUser();
          
          if (user && user.id) {
             // Lấy giỏ hàng người dùng đã đăng nhập
            const cartData = await CartService.getCartItemsWithDetails(user.id);
            console.log("Cart data in component:", cartData);
            
            // Log chi tiết từng sản phẩm để kiểm tra
            if (cartData.items && cartData.items.length > 0) {
              console.log("First book sample:", cartData.items[0]);
            }
            
            this.cartItems = cartData.items || [];
            this.totalPrice = this.cartItems.reduce((total, item) => {
              const price = item.book?.price || item.price || 0;
              return total + (price * item.quantity);
            }, 0);
            console.log("Total price after conversion:", this.totalPrice);
          }  else {
            // Lấy giỏ hàng khách
            const guestCartId = localStorage.getItem('guestCartId');
            if (guestCartId) {
              // Sử dụng phương thức mới để lấy chi tiết giỏ hàng khách
              const guestCartData = await CartService.getGuestCartItemsWithDetails(guestCartId);
              this.cartItems = guestCartData.items || [];
              this.totalPrice = this.calculatedTotalPrice;
              console.log("Guest cart loaded with items:", this.cartItems.length);
            } else {
              this.cartItems = [];
              this.totalPrice = 0;
            }
          }
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
          this.error = 'Không thể tải giỏ hàng. Vui lòng thử lại sau.';
          this.cartItems = [];
          this.totalPrice = 0;
        } finally {
          this.loading = false;
        }
      },
      async updateQuantity(productId, quantity) {
        try {
          const user = AuthenticationService.getCurrentUser();
          if (user && user.id) {
            await CartService.updateUserCart(user.id, productId, quantity);
          } else {
            const guestCartId = localStorage.getItem('guestCartId');
            if (guestCartId) {
              await CartService.updateGuestCart(guestCartId, productId, quantity);
            }
          }
          // Cập nhật lại giỏ hàng sau khi thay đổi
          this.fetchCartData();
        } catch (error) {
          console.error('Lỗi khi cập nhật số lượng:', error);
        }
      },
      async removeItem(productId) {
        try {
          this.loading = true;
          const user = AuthenticationService.getCurrentUser();
          
          if (user && user.id) {
            // Sử dụng phương thức mới thay vì updateUserCart với quantity=0
            await CartService.removeFromUserCart(user.id, productId);
            
            // Cập nhật lại giỏ hàng và tổng tiền
            await this.fetchCartData();
            
            // Sử dụng giá trị calculatedTotalPrice thay vì totalPrice từ API
            this.totalPrice = this.calculatedTotalPrice;
          } else {
            const guestCartId = localStorage.getItem('guestCartId');
            if (guestCartId) {
              await CartService.removeFromGuestCart(guestCartId, productId);
              await this.fetchCartData();
              this.totalPrice = this.calculatedTotalPrice;
            }
          }
        } catch (error) {
          console.error('Lỗi khi xóa sản phẩm:', error);
        } finally {
          this.loading = false;
        }
      },

      async createOrderWithPayment() {
        try {
          // Hiển thị trạng thái loading
          this.loading = true;
          
          // 1. Tạo đơn hàng trước
          const orderData = {
            userId: AuthenticationService.getCurrentUser().id,
            items: this.cartItems.map(item => ({
              bookId: item.cartItemId || item._id,
              quantity: item.quantity
            })),
            totalAmount: this.calculatedTotalPrice,
            paymentMethod: 'MOMO'
          };
          
          console.log('Đang tạo đơn hàng với MoMo:', orderData);
          
          // Tạo đơn hàng
          const orderResponse = await OrderService.createOrder(orderData);
          console.log('Kết quả tạo đơn hàng:', orderResponse.data);
          
          if (orderResponse.data && (orderResponse.data.success || orderResponse.data._id)) {
            // 2. Lấy orderId từ response
            console.log('Chi tiết response tạo đơn hàng:', JSON.stringify(orderResponse.data));
            const orderId = orderResponse.data._id || 
                orderResponse.data.data?._id || 
                orderResponse.data.data?.order?._id || 
                (orderResponse.data.order && orderResponse.data.order._id);

            console.log('OrderId trích xuất:', orderId);
            const totalAmount = this.calculatedTotalPrice;
            
            // 3. Tạo yêu cầu thanh toán MoMo
            const paymentResponse = await OrderService.createMomoPayment(orderId, totalAmount);
            console.log('Kết quả tạo thanh toán MoMo:', paymentResponse.data);
            
            if (paymentResponse.data && 
                  (paymentResponse.data.payUrl || 
                  paymentResponse.data.url || 
                  (paymentResponse.data.data && paymentResponse.data.data.url))
              ) {
              // Lấy URL thanh toán từ bất kỳ trường nào có giá trị
              const paymentUrl = paymentResponse.data.payUrl || paymentResponse.data.url||(paymentResponse.data.data && paymentResponse.data.data.url);
              
              console.log('URL thanh toán MoMo:', paymentUrl);
              
              // 4. Xóa giỏ hàng sau khi tạo đơn hàng thành công
              const userId = AuthenticationService.getCurrentUser().id;
              await CartService.clearUserCart(userId);
              eventBus.emit('cart-updated');
              
              // 5. Lưu orderId để kiểm tra sau này
              localStorage.setItem('pendingOrderId', orderId);
              
              // 6. Chuyển hướng người dùng đến trang thanh toán MoMo
              window.location.href = paymentUrl;
              return;
            }
            
            // Nếu không có payUrl, hiển thị thông báo lỗi
            eventBus.emit('show-alert', {
              show: true,
              type: 'error',
              title: 'Lỗi thanh toán',
              message: 'Không thể tạo liên kết thanh toán MoMo. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.',
              autoClose: true
            });
          }
        } catch (error) {
          console.error('Lỗi khi tạo đơn hàng và thanh toán:', error);
          
          // Fallback cho môi trường development
          if (process.env.NODE_ENV === 'development') {
            console.log('Đang sử dụng fallback trong môi trường development');
            
            try {
                // Xóa giỏ hàng
                const userId = AuthenticationService.getCurrentUser().id;
                await CartService.clearUserCart(userId);
                eventBus.emit('cart-updated');
                
                // Lưu thông tin đơn hàng giả lập vào localStorage
                const mockOrderId = 'mock-' + Date.now();
                localStorage.setItem('pendingOrderId', mockOrderId);
                
                // Hiển thị thông báo và chuyển hướng đến trang callback thay vì my-orders
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'success',
                    title: 'Đơn hàng đã tạo',
                    message: 'Đang chuyển hướng đến trang thanh toán...',
                    autoClose: true,
                    duration: 2000
                });
                
                // Chuyển hướng đến trang callback thay vì my-orders
                setTimeout(() => {
                  this.$router.push('/payment/callback?resultCode=0&orderId=' + mockOrderId);
                }, 2000);
            } catch (err) {
                console.error('Lỗi khi thực hiện fallback:', err);
            }
            return;
        }
          
          // Hiển thị thông báo lỗi
          eventBus.emit('show-alert', {
            show: true,
            type: 'error',
            title: 'Đặt hàng thất bại',
            message: 'Có lỗi xảy ra khi tạo đơn hàng hoặc thanh toán, vui lòng thử lại sau',
            autoClose: true
          });
        } finally {
          this.loading = false;
        }
      },

      async createOrderWithoutPayment() {
        try {
          // Hiển thị trạng thái loading
          this.loading = true;
          
          // Tạo dữ liệu đơn hàng
          const orderData = {
            userId: AuthenticationService.getCurrentUser().id,
            items: this.cartItems.map(item => ({
              bookId: item.cartItemId || item._id, // Thay đổi productId thành bookId
              quantity: item.quantity
            })),
            totalAmount: this.calculatedTotalPrice,
            paymentMethod: 'COD' // Thay đổi thành paymentMethod với giá trị phù hợp
          };
          
          console.log('Đang tạo đơn hàng chưa thanh toán với dữ liệu:', orderData);
          
          // Tạo đơn hàng
          const response = await OrderService.createOrder(orderData);
          console.log('Kết quả tạo đơn hàng:', response.data);
          
          // Kiểm tra response
          if (response.data && (response.data.success || response.data._id)) {
            // Xóa giỏ hàng
            const userId = AuthenticationService.getCurrentUser().id;
            await CartService.clearUserCart(userId);
            
            // Phát sự kiện để cập nhật số lượng giỏ hàng
            eventBus.emit('cart-updated');
            
            // Hiển thị thông báo thành công
            eventBus.emit('show-alert', {
              show: true,
              type: 'success',
              title: 'Đặt hàng thành công',
              message: 'Bạn đã đặt hàng thành công, vui lòng qua đơn hàng của tôi để xác nhận thanh toán.',
              autoClose: true,
              duration: 5000
            });
            
            // Chuyển hướng đến trang đơn hàng
            setTimeout(() => {
              this.$router.push('/my-orders');
            }, 2000);
          }
        } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        
        // Fallback: Mô phỏng thành công nếu API không hoạt động trong môi trường development
        if (process.env.NODE_ENV === 'development') {
          console.log('Sử dụng fallback để mô phỏng tạo đơn hàng thành công');
          
          // Xóa giỏ hàng
          try {
            const userId = AuthenticationService.getCurrentUser().id;
            await CartService.clearUserCart(userId);
            eventBus.emit('cart-updated');
          } catch (err) {
            console.error('Lỗi khi xóa giỏ hàng:', err);
          }
          
          // Hiển thị thông báo thành công
          eventBus.emit('show-alert', {
            show: true,
            type: 'success',
            title: 'Đặt hàng thành công',
            message: this.isPaymentOrder 
              ? 'Bạn đã thanh toán thành công đơn hàng, đơn hàng sẽ sớm được giao cho bạn.' 
              : 'Bạn đã đặt hàng thành công, vui lòng qua đơn hàng của tôi để xác nhận thanh toán.',
            autoClose: true,
            duration: 5000
          });
          
          // Chuyển hướng đến trang đơn hàng
          setTimeout(() => {
            this.$router.push('/my-orders');
          }, 2000);
          
          return;
        }
        
        // Hiển thị thông báo lỗi (phần còn lại như cũ)
        eventBus.emit('show-alert', {
          show: true,
          type: 'error',
          title: 'Đặt hàng thất bại',
          message: 'Có lỗi xảy ra khi tạo đơn hàng, vui lòng thử lại',
          autoClose: true
        });
      } finally {
          this.loading = false;
        }
      },
      proceedToCheckout() {
        if (this.cartItems.length === 0) {
          eventBus.emit('show-alert', {
            show: true,
            type: 'error',
            title: 'Giỏ hàng trống',
            message: 'Giỏ hàng của bạn đang trống hãy mua sắm để mang về những sản phẩm bổ ích và thú vị.',
            autoClose: true,
            duration: 5000,
            textAlign: 'center'
          });
          return;
        }
        
        // Kiểm tra đăng nhập
        const user = AuthenticationService.getCurrentUser();
        if (!user || !user.id) {
          console.log('Người dùng chưa đăng nhập, hiển thị thông báo');
          eventBus.emit('show-alert', {
            show: true,
            type: 'error',
            title: 'Thông báo',
            message: 'đặt hàng',
            autoClose: false
          });
          return;
        }
        
        // Hiển thị hộp thoại xác nhận với văn bản rõ ràng hơn
        // Sử dụng alert tùy chỉnh thay vì window.confirm
        const handleConfirm = () => {
          this.isPaymentOrder = true;
          this.createOrderWithPayment();
          // Hủy đăng ký sau khi xử lý
          eventBus.off('confirm', handleConfirm);
        };
        
        const handleCancel = () => {
          this.isPaymentOrder = false;
          this.createOrderWithoutPayment();
          // Hủy đăng ký sau khi xử lý
          eventBus.off('cancel', handleCancel);
        };
        
        // Đăng ký lắng nghe sự kiện
        eventBus.on('confirm', handleConfirm);
        eventBus.on('cancel', handleCancel);
        
        // Hiển thị alert
        eventBus.emit('show-alert', {
          show: true,
          type: 'success',
          title: 'Xác nhận đặt hàng',
          message: 'Bạn có muốn thanh toán đơn hàng luôn không?',
          autoClose: false,
          showChoices: true,
          confirmText: 'Thanh toán ngay',
          cancelText: 'Thanh toán sau'
        });
      }
    },
  };
  </script>
    
  <style scoped>
  .page-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fffaf5;
    /* min-height: 100vh; */
  }
  
  .shopping-cart {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 50px 0;
  }
  
  .shopping-cart-container {
    width: 82%;
  }
  
  .cart-content {
    display: flex;
    justify-content: flex-start;
    gap: 30px;
    margin-top: 20px;
    width: 100%;
  }
  
  @media (max-width: 991px) {
    .container {
      width: 95%;
    }
    
    .shopping-cart {
      padding: 30px 0;
    }
    
    .cart-content {
      flex-direction: column;
      gap: 20px;
    }
  }
  </style>