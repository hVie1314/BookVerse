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
              :totalPrice="totalPrice" 
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
            this.totalPrice = Number(cartData.totalPrice) || 0;
            console.log("Total price after conversion:", this.totalPrice);
          }  else {
            // Lấy giỏ hàng khách
            const guestCartId = localStorage.getItem('guestCartId');
            if (guestCartId) {
              // Lấy thông tin giỏ hàng khách từ localStorage
              const response = await CartService.getGuestCart(guestCartId);
              if (response.data && response.data.success) {
                // Xử lý tương tự như giỏ hàng người dùng
                const guestCartData = response.data.data;
                // Tạo cấu trúc dữ liệu giống với kết quả getCartItemsWithDetails
                // (Logic lấy thông tin chi tiết từng sản phẩm sẽ được thực hiện ở backend)
                this.cartItems = guestCartData.items || [];
                this.totalPrice = guestCartData.totalPrice || 0;
              }
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
          const user = AuthenticationService.getCurrentUser();
          if (user && user.id) {
            await CartService.updateUserCart(user.id, productId, 0); // Số lượng 0 = xóa
          } else {
            const guestCartId = localStorage.getItem('guestCartId');
            if (guestCartId) {
              await CartService.updateGuestCart(guestCartId, productId, 0);
            }
          }
          // Cập nhật lại giỏ hàng sau khi xóa
          this.fetchCartData();
        } catch (error) {
          console.error('Lỗi khi xóa sản phẩm:', error);
        }
      },
      proceedToCheckout() {
        if (this.cartItems.length === 0) {
          alert('Giỏ hàng của bạn đang trống');
          return;
        }
        // Chuyển hướng đến trang thanh toán
        this.$router.push('/checkout');
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