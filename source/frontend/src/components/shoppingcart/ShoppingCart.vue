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
            @remove-selected="removeSelectedItems"
            @selection-changed="updateSelectedItems"
          />
          <div class="checkout-summary-container">
            <CheckoutSummary
              :totalPrice="calculatedSelectedTotal" 
              :selectedCount="selectedItems.length"
              :totalCount="cartItems.length"
              @checkout="proceedToCheckout" 
            />
          </div>
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
        error: null,
        selectedItems: [],
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.setupStickyObserver();
      });
    },
    computed: {
      calculatedTotalPrice() {
        return this.cartItems.reduce((total, item) => {
          const price = item.book?.price || item.price || 0;
          return total + (price * item.quantity);
        }, 0);
      },
      calculatedSelectedTotal() {
        // Only calculate total for selected items
        return this.cartItems.reduce((total, item) => {
          const itemId = item.cartItemId || item._id;
          if (this.selectedItems.includes(itemId)) {
            const price = item.book?.price || item.price || 0;
            return total + (price * item.quantity);
          }
          return total;
        }, 0);
      },
      selectedProducts() {
        // Return only the selected cart items with more detailed logging
        const selected = this.cartItems.filter(item => {
          const itemId = item.cartItemId || item._id;
          const isSelected = this.selectedItems.includes(itemId);
          console.log(`Item ${itemId}: ${isSelected ? 'selected' : 'not selected'}`);
          return isSelected;
        });
        console.log('Total selected products:', selected.length);
        return selected;
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
      updateSelectedItems(selectedIds) {
        this.selectedItems = selectedIds;
      },
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
                 // Xử lý ảnh cho mỗi sản phẩm
                  cartData.items = cartData.items.map(item => {
                    // Giữ lại cấu trúc ban đầu của item
                    const processedItem = { ...item };
                    
                    // Kiểm tra và xử lý trường image nếu là chuỗi mảng
                    if (item.productId && item.productId.image) {
                      try {
                        if (typeof item.productId.image === 'string' && 
                            item.productId.image.startsWith('[') && 
                            item.productId.image.endsWith(']')) {
                          // Parse chuỗi thành mảng và lấy URL đầu tiên
                          const imageArray = JSON.parse(item.productId.image.replace(/'/g, '"'));
                          if (imageArray && imageArray.length > 0) {
                            processedItem._id = item.productId._id;
                            processedItem.title = item.productId.title;
                            processedItem.author = item.productId.author;
                            processedItem.price = item.productId.price;
                            processedItem.image = imageArray[0]; // Chỉ lấy ảnh đầu tiên
                            processedItem.quantity = item.quantity;
                          }
                        }
                      } catch (error) {
                        console.error('Lỗi xử lý ảnh sản phẩm:', error);
                      }
                    }
                    
                    return processedItem;
                  });

                 // Thay thế đoạn code sort hiện tại với đoạn code sau
                  cartData.items = cartData.items.reverse();
                  
                  console.log("Processed cart items:", cartData.items);
                }
                
                this.cartItems = cartData.items || [];
                this.totalPrice = cartData.totalPrice || 0;
            } else {
                // Lấy giỏ hàng khách (logic không thay đổi)
                const guestCartId = localStorage.getItem('guestCartId');
            if (guestCartId) {
              const guestCartData = await CartService.getGuestCartItemsWithDetails(guestCartId);
              
              // Sắp xếp tương tự như trên
              
              if (guestCartData.items && guestCartData.items.length > 0) {
                // Đơn giản chỉ đảo ngược mảng để sản phẩm mới nhất lên đầu
                guestCartData.items = guestCartData.items.reverse();
              }
              
              this.cartItems = guestCartData.items || [];
              this.totalPrice = guestCartData.totalPrice || 0;
            } else {
              this.cartItems = [];
              this.totalPrice = 0;
            }
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
          // Xóa thông tin đăng nhập nếu bị lỗi 401
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Sau đó chuyển sang chế độ khách
          const guestCartId = localStorage.getItem('guestCartId');
          if (guestCartId) {
            const guestCartData = await CartService.getGuestCartItemsWithDetails(guestCartId);
            this.cartItems = guestCartData.items || [];
            this.totalPrice = guestCartData.totalPrice || 0;
          }
        }
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
        console.log("ShoppingCart: Bắt đầu xóa sản phẩm", productId);
        this.loading = true;
        
        const user = AuthenticationService.getCurrentUser();
        
        if (user && user.id) {
          console.log("Xóa sản phẩm từ giỏ hàng người dùng", user.id);
          await CartService.removeFromUserCart(user.id, productId);
        } else {
          const guestCartId = localStorage.getItem('guestCartId');
          if (guestCartId) {
            console.log("Xóa sản phẩm từ giỏ hàng khách", guestCartId);
            await CartService.removeFromGuestCart(guestCartId, productId);
          }
        }
        
        // Tải lại dữ liệu giỏ hàng sau khi xóa
        await this.fetchCartData();
        
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        if (error.response) {
          console.error('Response error:', error.response.data);
        }
        
        // Thông báo lỗi
        eventBus.emit('show-alert', {
          show: true,
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể xóa sản phẩm. Vui lòng thử lại sau.',
          autoClose: true
        });
      } finally {
        this.loading = false;
      }
    },

      async createOrderWithPayment() {
        try {
          if (this.selectedItems.length === 0) {
            eventBus.emit('show-alert', {
              show: true,
              type: 'error',
              title: 'Không có sản phẩm được chọn',
              message: 'Vui lòng chọn ít nhất một sản phẩm để đặt hàng',
              autoClose: true
            });
            return;
          }
          // Hiển thị trạng thái loading
          this.loading = true;
          
          // 1. Tạo đơn hàng trước
          const orderData = {
            userId: AuthenticationService.getCurrentUser().id,
            items: this.selectedProducts.map(item => {
              // Kiểm tra cấu trúc của từng sản phẩm
              console.log('Chi tiết sản phẩm trong đơn hàng:', item);
              
              // Thử lấy ID từ nhiều nguồn có thể có
              const bookId = item._id || item.bookId || (item.book && item.book._id);
              return {
                bookId: bookId,
                quantity: item.quantity
              };
            }),
            totalAmount: this.calculatedSelectedTotal,
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
          if (error.response && error.response.data && error.response.data.errorCode === 'MISSING_ADDRESS') {
            eventBus.emit('show-alert', {
              show: true,
              type: 'warning',
              title: 'Thiếu thông tin địa chỉ',
              message: 'Vui lòng cập nhật địa chỉ giao hàng trong hồ sơ của bạn trước khi đặt hàng.',
              autoClose: true,
              duration: 5000,
              textAlign: 'center'
            });
            
            // Chuyển hướng đến trang cập nhật hồ sơ sau 2 giây
            setTimeout(() => {
              this.$router.push('/profile');
            }, 2000);
            
            return;
          }
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
                
                // Chuyển hướng trực tiếp đến trang đơn hàng mà không hiển thị thông báo
                this.$router.push('/my-orders');
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
          if (this.selectedItems.length === 0) {
            eventBus.emit('show-alert', {
              show: true,
              type: 'error',
              title: 'Không có sản phẩm được chọn',
              message: 'Vui lòng chọn ít nhất một sản phẩm để đặt hàng',
              autoClose: true
            });
            return;
          }
          // Hiển thị trạng thái loading
          this.loading = true;
          
          // Tạo dữ liệu đơn hàng
          const orderData = {
            userId: AuthenticationService.getCurrentUser().id,
            items: this.selectedProducts.map(item => ({
              bookId: item._id,
              quantity: item.quantity
            })),
            totalAmount: this.calculatedSelectedTotal,
            paymentMethod: 'COD'
          };
          
          console.log('Đang tạo đơn hàng chưa thanh toán với dữ liệu:', orderData);
          
          // Tạo đơn hàng
          const response = await OrderService.createOrder(orderData);
          console.log('Kết quả tạo đơn hàng:', response.data);
          
          // Kiểm tra response
          if (response.data && (response.data.success || response.data._id)) {
            // Xóa giỏ hàng
            
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
        if (error.response && error.response.data && error.response.data.errorCode === 'MISSING_ADDRESS') {
          eventBus.emit('show-alert', {
            show: true,
            type: 'warning',
            title: 'Thiếu thông tin địa chỉ',
            message: 'Vui lòng cập nhật địa chỉ giao hàng trong hồ sơ của bạn trước khi đặt hàng.',
            autoClose: true,
            duration: 5000,
            textAlign: 'center'
          });
          
          // Chuyển hướng đến trang cập nhật hồ sơ sau 2 giây
          setTimeout(() => {
            this.$router.push('/profile');
          }, 2000);
          
          return;
        }
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

        if (this.selectedItems.length === 0) {
          eventBus.emit('show-alert', {
            show: true,
            type: 'error',
            title: 'Không có sản phẩm được chọn',
            message: 'Vui lòng chọn ít nhất một sản phẩm để đặt hàng',
            autoClose: true
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
      },

      setupStickyObserver() {
        // Tạo Intersection Observer để theo dõi khi checkout summary trở thành sticky
        const observer = new IntersectionObserver(
          ([entry]) => {
            const summaryContainer = document.querySelector('.checkout-summary-container');
            if (summaryContainer) {
              if (!entry.isIntersecting) {
                summaryContainer.classList.add('is-sticky');
              } else {
                summaryContainer.classList.remove('is-sticky');
              }
            }
          },
          { threshold: 0 }
        );
        
        // Quan sát một element "ghost" phía trên checkout summary
        const ghostElement = document.createElement('div');
        ghostElement.style.height = '1px';
        const summaryContainer = document.querySelector('.checkout-summary-container');
        if (summaryContainer && summaryContainer.parentNode) {
          summaryContainer.parentNode.insertBefore(ghostElement, summaryContainer);
          observer.observe(ghostElement);
        }
      },

      async removeSelectedItems(selectedIds) {
        try {
          this.loading = true;
          
          const user = AuthenticationService.getCurrentUser();
          
          if (user && user.id) {
            // Remove each selected item from user cart
            for (const productId of selectedIds) {
              await CartService.removeFromUserCart(user.id, productId);
            }
          } else {
            const guestCartId = localStorage.getItem('guestCartId');
            if (guestCartId) {
              // Remove each selected item from guest cart
              for (const productId of selectedIds) {
                await CartService.removeFromGuestCart(guestCartId, productId);
              }
            }
          }
          
          // Clear selected items
          this.selectedItems = [];
          
          // Reload cart data
          await this.fetchCartData();
          
          // Show success message
          eventBus.emit('show-alert', {
            show: true,
            type: 'success',
            title: 'Thành công',
            message: 'Đã xóa các sản phẩm đã chọn khỏi giỏ hàng',
            autoClose: true
          });
        } catch (error) {
          console.error('Lỗi khi xóa sản phẩm đã chọn:', error);
          
          // Show error message
          eventBus.emit('show-alert', {
            show: true,
            type: 'error',
            title: 'Lỗi',
            message: 'Không thể xóa sản phẩm. Vui lòng thử lại sau.',
            autoClose: true
          });
        } finally {
          this.loading = false;
        }
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
    background-color: rgb(244, 235, 225);
    min-height: 100vh;
    justify-content: space-between;
  }
  
  .shopping-cart {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 50px 0;
    margin-top: 100px;
    flex-grow: 1;
  }
  
  .shopping-cart-container {
    width: 82%;
  }
  
  .cart-content {
    display: flex;
    flex-direction: column; /* Thay đổi từ row thành column */
    width: 100%;
    margin-top: 20px;
  }
  
  .checkout-summary-container {
    width: 100%;
    position: sticky; /* Giữ nguyên tính năng sticky */
    bottom: 0; /* Thay đổi từ 20px thành 0px để đảm bảo không có khoảng trống */
    z-index: 10; 
    margin-top: 30px; /* Giữ nguyên margin phía trên */
    background-color: rgb(244, 235, 225); /* Thêm màu nền để che phần content phía dưới */
    padding-bottom: 20px; /* Thêm padding dưới để có không gian thở */
  }

  .checkout-summary-container.is-sticky {
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
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