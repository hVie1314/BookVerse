<template>
    <section class="store-overview">
      <header class="store-title">
        <h1>TRANG TỔNG QUÁT CỦA CỬA HÀNG BOOKVERSE</h1>
      </header>
      <div class="statistics-container">
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
        <article class="statistics-card product-card">
          <div class="card-content">
            <span class="stat-number">1599</span>
            <div class="card-details">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b5fe9eb9e3cadcb59f21c63153ace24125df3414"
                alt="Product statistics illustration"
                class="stat-image product-image"
              />
              <h2 class="stat-title">SẢN PHẨM</h2>
              <p class="stat-description">
                Sách không chỉ để đọc - mà còn để chạm tới tâm hồn. Chúng tôi chọn
                sách bằng cả trái tim, dành cho bạn đọc chân thành
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  </template>
  
  <style scoped>
  .store-overview {
    width: 100%;
    min-height: screen;
    background-color: #f4ebe1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 34px 24px;
  }
  
  .store-title {
    color: #fff;
    text-align: center;
    font-family: Montserrat;
    font-size: 25px;
    font-weight: 900;
    width: 100%;
    max-width: 1239px;
    border-radius: 15px;
    background-color: #4d2900;
    padding: 15px 24px;
  }
  
  .statistics-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
    margin-top: 50px;
  }
  
  .statistics-card {
    width: 561px;
    padding: 27px;
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
  
  .product-card .card-content {
    margin-bottom: 31px;
    padding-bottom: 49px;
  }
  
  .stat-number {
    position: absolute;
    right: 20px;
    top: 13px;
    color: #000;
    font-family: Montserrat;
    font-size: 50px;
    font-weight: 900;
  }
  
  .card-details {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stat-image {
    width: 316px;
    height: 316px;
    object-fit: contain;
  }
  
  .product-image {
    width: 325px;
    height: 325px;
    margin-right: -5px;
  }
  
  .stat-title {
    color: #000;
    text-align: center;
    font-family: Montserrat;
    font-size: 30px;
    font-weight: 900;
    margin-top: 30px;
  }
  
  .stat-description {
    color: #4d2900;
    font-family: Montserrat;
    font-size: 25px;
    font-weight: 900;
    text-align: center;
    margin-top: 30px;
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
      font-size: 22px;
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
  