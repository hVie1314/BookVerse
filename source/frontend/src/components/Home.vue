<template>
  <div class="home-container">
    <!-- Thêm thanh Nav vào đây -->
    <Nav />
    
    <!-- Main content của trang Home -->
    <div class="main-content">

      <Overview_form /> <!-- Thêm component Overview_form vào đây -->
      
      <BestSeller /> <!-- Thêm component BestSeller vào đây -->
      <!-- Phần nội dung chính của trang Home có thể được thêm vào đây -->
      <NewBooks /> <!-- Thêm component NewBooks vào đây -->
      
      <TopCategories /> <!-- Thêm component TopCategories vào đây -->
      <AboutUsStats/>
      <ShippingInfo/> <!-- Thêm component ShippingInfo vào đây -->
      <ContactSection/> <!-- Thêm component ContactSection vào đây -->
    </div>
    
    <!-- Footer section từ file footer.vue -->
    <Footer />
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import Nav from './navbar/Nav.vue'; // Thêm import Nav component
import Footer from './footer/footer.vue'; // Thêm import Footer component
import eventBus from '@/eventBus.js'; // Import event bus
import Overview_form from './overview/Overview.vue'; // Import Overview_form component
import BestSeller from './bestsellers/BestSeller.vue';
import NewBooks from './NewBooks.vue';
import TopCategories from './topcategory/TopCategories.vue'; // Import TopCategories component
import AboutUsStats from './aboutus/AboutUs.vue'; // Import AboutUsStats component
import ShippingInfo from './ShippingInfo.vue';
import ContactSection from './ContactSection.vue'; // Import ContactSection component
export default {
  name: 'HomePage',
  components: {
    Footer,
    Nav, // Thêm Nav vào components
    Overview_form, // Thêm Overview_form vào components
    BestSeller, // Thêm BestSeller vào components
    NewBooks, // Thêm NewBooks vào components
    TopCategories,
    AboutUsStats, // Thêm AboutUsStats vào components
    ShippingInfo, // Thêm ShippingInfo vào components
    ContactSection
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
  mounted() {
    eventBus.on('user-logged-out', this.updateLoginStatus);
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
  /* margin: 0; */
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  background-color: rgb(244, 235, 225);
}

.main-content {
  width: 100%;
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(244, 235, 225);
  margin-top: 130px; /* Thêm margin để tạo khoảng cách với Nav */
}

/* Footer styles from footer.vue */
.footer{
    display: flex;
    width: 100%;
    padding: 0px 0px;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
    background-color: rgba(57, 31, 0, 1);
  }
  
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