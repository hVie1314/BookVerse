<template>
  <div class="home-container">
    <!-- Thêm thanh Nav vào đây -->
    <Nav />
    
    <!-- Main content của trang Home -->
    <div class="main-content">
      <h1>Chào mừng đến với BookVerse</h1>
      <p>Khám phá thế giới sách cùng chúng tôi</p>
      
      <!-- Phần nội dung chính của trang Home có thể được thêm vào đây -->
      <div class="featured-books">
        <!-- Sách nổi bật -->
      </div>
      
      <div class="new-arrivals">
        <!-- Sách mới -->
      </div>
      
      <div class="categories">
        <!-- Danh mục sách -->
      </div>
    </div>
    
    <!-- Footer section từ file footer.vue -->
    <footer class="footer">
      <div class="footer-background">
        <div class="footer-container">
          <div class="footer-content">
            <section class="footer-main-section">
              <div class="footer-wrapper">
                <div class="footer-columns">
                  <div class="footer-column-wrapper">
                    <FooterLogo />
                  </div>
                  <div class="footer-column-wrapper">
                    <FooterColumn title="Tài khoản">
                      <p>
                        <span class="text-white">Đăng nhập/ Tạo mới tài khoản</span>
                      </p>
                      <p>
                        <span class="text-white">Thay đổi địa chỉ khách hàng</span>
                      </p>
                      <p>
                        <span class="text-white">Lịch sử mua hàng</span>
                      </p>
                    </FooterColumn>
                  </div>
                  <div class="footer-column-wrapper">
                    <FooterColumn title="Dịch vụ">
                      <p>
                        <span class="text-white">Mua bán trực tuyến</span>
                      </p>
                      <p>
                        <span class="text-white">Chính sách bảo mật thanh toán</span>
                      </p>
                      <p>
                        <span class="text-white">Hệ thống trung tâm nhà sách</span>
                      </p>
                    </FooterColumn>
                  </div>
                  <div class="footer-column-wrapper">
                    <FooterColumn title="Hỗ trợ">
                      <p>
                        <span class="text-white">Chính sách đổi - trả - hoàn tiền</span>
                      </p>
                      <p>
                        <span class="text-white">Chính sách vận chuyển</span>
                      </p>
                      <p>
                        <span class="text-white">Chính sách bảo hành</span>
                      </p>
                    </FooterColumn>
                  </div>
                </div>
              </div>
              <p class="policy-text">
                Điều khoản sử dụng | Chính sách bảo mật
              </p>
            </section>
            <section class="footer-contact-section">
              <FooterContact />
            </section>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import FooterColumn from './FooterColumn.vue';
import FooterLogo from './FooterLogo.vue';
import FooterContact from './FooterContact.vue';
import AuthenticationService from '@/services/AuthenticationService';
import Nav from './Nav.vue'; // Thêm import Nav component

export default {
  name: 'HomePage',
  components: {
    FooterColumn,
    FooterLogo,
    FooterContact,
    Nav // Thêm Nav vào components
  },
  data() {
    return {
      isLoggedIn: false,
      showAccountMenu: false
    }
  },
  created() {
    this.isLoggedIn = AuthenticationService.isLoggedIn()
  },
  methods: {
    toggleAccountMenu() {
      this.showAccountMenu = !this.showAccountMenu
    },
    logout() {
      AuthenticationService.logout()
      this.isLoggedIn = false
      this.showAccountMenu = false
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    }
  },
  watch: {
    $route() {
      this.isLoggedIn = AuthenticationService.isLoggedIn()
    }
  }
}
</script>

<style scoped>
.home-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
}

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fffaf5;
  margin-top: 20px; /* Thêm margin để tạo khoảng cách với Nav */
}

/* Footer styles from footer.vue */
.footer-background {
  background-color: rgba(57, 31, 0, 1);
  display: flex;
  width: 100%;
  padding: 30px 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.footer-container {
  width: 100%;
  max-width: 100%;
  flex-wrap: wrap;
}

.footer-content {
  gap: 15px;
  display: flex;
}

.footer-main-section {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  line-height: normal;
  width: 75%;
  margin-left: 0;
}

.footer-wrapper {
  width: 100%;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
}

.footer-columns {
  gap: 15px;
  display: flex;
  flex-wrap: wrap;
}

.footer-column-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  line-height: normal;
  width: 22%;
  min-width: 150px;
  margin-left: 0;
}

.footer-column-wrapper:not(:first-child) {
  margin-left: 15px;
}

.policy-text {
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  font-weight: 400;
  line-height: 2;
  align-self: flex-end;
  margin-top: 40px;
  margin-right: 50px;
}

.footer-contact-section {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  line-height: normal;
  width: 23%;
  min-width: 200px;
  margin-left: 20px;
}

.text-white {
  color: rgb(255, 255, 255);
}

/* Responsive styles for footer */
@media (min-width: 992px) and (max-width: 1366px){
  .footer-background {
    padding: 30px 20px;
  }
  
  .footer-column-wrapper {
    width: 22%;
    min-width: 140px;
  }
  
  .footer-column-wrapper:not(:first-child) {
    margin-left: 10px;
  }
  
  .policy-text {
    margin-right: 20px;
    margin-top: 30px;
  }
  
  /* Điều chỉnh font size */
  .column-title {
    font-size: 18px;
  }
  
  .text-white, .column-content {
    font-size: 12px;
  }
  
  .brand-name {
    font-size: 24px;
  }
}
</style>