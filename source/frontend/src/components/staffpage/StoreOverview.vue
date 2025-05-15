<template>
  <section class="store-overview">
    <header class="store-title">
      <h1>TRANG TỔNG QUAN CỦA CỬA HÀNG BOOKVERSE</h1>
    </header>
    <div class="statistics-container">
      <!--Thống kê số khách hàng-->
      <article class="statistics-card customer-card">
        <div class="card-content">
          <span class="stat-number">12</span>
          <div class="card-details">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/cc42ed88fc5bdc8d58afee0898732ff14d9ea292"
              alt="Customer statistics illustration"
              class="stat-image"
            />
            <h2 class="stat-title">KHÁCH HÀNG</h2>
            <p class="stat-description">
              Đã có hơn 7000 lượt mua từ những khách hàng yêu sách. Từ học sinh,
              sinh viên đến người đi làm - ai cũng tìm thấy điều mình cần.
            </p>
          </div>
        </div>
      </article>
      <!--Thống kê số sản phẩm-->
      <article class="statistics-card product-card">
        <div class="card-content">
          <span class="stat-number" v-if="loading">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          <span class="stat-number" v-else>{{ totalBooks }}</span>
          <div class="card-details">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b5fe9eb9e3cadcb59f21c63153ace24125df3414"
              alt="Product statistics illustration"
              class="stat-image product-image"
            />
            <h2 class="stat-title">SẢN PHẨM</h2>
            <p class="stat-description">
              Sách không chỉ để đọc - mà còn để chạm tới tâm hồn. Chúng tôi chọn
              sách bằng cả trái tim, dành cho bạn đọc chân thành.
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import BookService from '@/services/BookService';

export default {
  name: 'StoreOverview',
  data() {
    return {
      totalBooks: 0,
      loading: true
    };
  },
  created() {
    this.fetchTotalBooks();
  },
  methods: {
    async fetchTotalBooks() {
      try {
        this.loading = true;
        // Gọi API để lấy danh sách sách với limit=1 (chỉ cần lấy thông tin tổng số)
        const response = await BookService.getAllBooks(1, 1);
        
        // Kiểm tra phản hồi và trích xuất totalBooks từ phần pagination
        if (response.data && response.data.data && response.data.data.pagination) {
          this.totalBooks = response.data.data.pagination.totalBooks || 0;
        } else {
          console.error('Không tìm thấy thông tin pagination trong phản hồi', response.data);
          this.totalBooks = 0;
        }
      } catch (error) {
        console.error('Lỗi khi lấy tổng số sách:', error);
        this.totalBooks = 0;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
  
<style scoped>
.store-overview {
  width: 100%;
  min-height: screen;
  background-color: #f4ebe1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 40px;
}

.store-title {
  color: #fff;
  text-align: center;
  font-family: "Montserrat", sans-serif; /* Thêm font-family */
  font-size: 25px;
  font-weight: 900;
  width: 100%;
  max-width: 1239px;
  border-radius: 15px;
  background-color: #4d2900;
  padding: 10px 15px;
}

.statistics-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 80px;
  margin-top: 40px;
}

.statistics-card {
  width: 400px;
  padding: 15px;
  border-radius: 20px;
  border: 5px solid #000;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.customer-card {
  background-color: #fff;
}

.product-card {
  background-color: #f9f9f9;
}

.card-content {
  width: 100%;
  border-radius: 10px;
  border: 4px solid #a18585;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 20px;
  position: relative;
}

.stat-number {
  position: absolute;
  right: 12px;
  top: 0px;
  color: #000;
  font-family: "Montserrat", sans-serif; /* Thêm font-family */
  font-size: 42px;
  font-weight: 800;
}

.card-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.product-image {
  width: 200x;
  height: 200px;
  margin-right: -20px;
}

.stat-title {
  color: #000;
  text-align: center;
  font-family: "Montserrat", sans-serif; /* Thêm font-family */
  font-size: 28px;
  font-weight: 700;
  margin-top: 5px;
}

.stat-description {
  color: #4d2900;
  font-family: "Montserrat", sans-serif; /* Thêm font-family rõ ràng */
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
}

@media (max-width: 991px) {
  .store-title {
    font-size: 22px;
  }

  .statistics-container {
    flex-direction: column;
    align-items: center;
  }

  .stat-description {
    font-size: 20px;
  }
}

@media (max-width: 640px) {
  .store-title {
    font-size: 18px;
  }

  .stat-description {
    font-size: 18px;
  }
}
</style>
  