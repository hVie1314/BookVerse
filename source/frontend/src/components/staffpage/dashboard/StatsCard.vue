<template>
  <article class="stats-card" :class="{'has-trend': trendValue}">
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-value">{{ value }}</p>
    
    <!-- Hiển thị thông tin khách hàng mới (nếu có) -->
    <div v-if="newCustomerStat && chartType === 'user'" class="new-customer-info">
      <div class="new-stat-item">
        <span class="stat-indicator" :style="{ backgroundColor: newCustomerStat.color }"></span>
        <span><strong>{{ newCustomerStat.value }}</strong><span>{{ newCustomerStat.label }}</span></span>
      </div>
    </div>
    
    <!-- Trend icon ở góc phải trên cùng -->
    <div v-if="trendValue" class="trend-container">
      <div class="trend-icon">
        <i :class="getTrendIconClass()"></i>
      </div>
    </div>
    
    <!-- Trend value tách riêng và đặt ở góc phải dưới cùng -->
    <p v-if="trendValue" class="trend-value">{{ trendValue }}</p>
    
    <div v-if="stats && stats.length" class="stats-list">
      <div v-for="(stat, index) in stats" :key="index" class="stat-item">
        <span class="stat-indicator" :style="{ backgroundColor: stat.color }"></span>
        <span><strong>{{ stat.value }}</strong><span>{{ stat.label }}</span></span>
      </div>
    </div>
    
    <!-- Biểu đồ hình tròn CSS (chỉ hiển thị cho stats) -->
    <div v-if="chartType !== 'revenue' && stats && stats.length" class="chart-wrapper">
      <div class="pie-chart" :style="getPieChartStyle()">
        <!-- Thêm donut center -->
        <div class="donut-center"></div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'StatsCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    stats: {
      type: Array,
      default: () => []
    },
    newCustomerStat: { // Thêm prop mới cho khách hàng mới
      type: Object,
      default: null
    },
    trendValue: {
      type: String,
      default: null
    },
    chartType: {
      type: String,
      required: true,
      validator: value => ['user', 'order', 'revenue'].includes(value)
    }
  },
  methods: {
    getPieChartStyle() {
      if (!this.stats || this.stats.length === 0) return {};
      
      // Tính toán góc cho mỗi phần của biểu đồ
      let gradientString = '';
      let startPercentage = 0;
      
      this.stats.forEach(stat => {
        const percentage = parseInt(stat.value);
        const endPercentage = startPercentage + percentage;
        
        gradientString += `${stat.color} ${startPercentage}% ${endPercentage}%, `;
        startPercentage = endPercentage;
      });
      
      // Xóa dấu phẩy và khoảng trắng cuối cùng
      gradientString = gradientString.slice(0, -2);
      
      return {
        background: `conic-gradient(${gradientString})`
      };
    },
    getTrendIconClass() {
      // Xác định icon Font Awesome dựa trên giá trị xu hướng
      if (this.chartType !== 'revenue') return '';
      
      // Nếu là xu hướng tăng (bắt đầu bằng +), hiển thị icon tăng
      if (this.trendValue && this.trendValue.startsWith('+')) {
        return 'fas fa-chart-line';
      }
      
      // Nếu là xu hướng giảm, hiển thị icon giảm
      return 'fas fa-chart-line fa-flip-vertical';
    }
  }
}
</script>

<style scoped>
.stats-card {
  border-radius: 20px;
  padding: 20px;
  flex: 1;
  position: relative;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  min-height: 256px;
  background-color: #fff;
  overflow: hidden;
}

.card-title {
  color: #4d4d4d;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  margin-bottom: 20px;
  font-weight: normal;
}

.card-value {
  color: #4d2900;
  font-family: "Montserrat", sans-serif;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 30px;
}

.stats-list {
  margin-top: 40px;
  position: relative;
  z-index: 2;
}

.stat-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-family: "Montserrat", sans-serif;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.7);
}

.stat-indicator {
  width: 14px;
  height: 9px;
  border-radius: 3px;
  margin-right: 6px;
}

/* Điều chỉnh style cho trend icon và container */
.trend-container {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
}

.trend-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4d2900;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.trend-icon i {
  font-size: 30px;
  color: white;
}

.trend-value {
  position: absolute;
  bottom: 20px;
  right: 25px;
  color: #0d8f1a;
  font-family: "Montserrat", sans-serif;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  z-index: 3; /* Đảm bảo hiển thị trên biểu đồ */
}

/* Styles cho biểu đồ hình tròn */
.chart-wrapper {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 130px;
  height: 130px;
  overflow: hidden;
  border-radius: 50%;
}

.pie-chart {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  position: relative;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1), 0 0 10px rgba(0, 0, 0, 0.1);
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
}

/* Media queries */
@media (max-width: 991px) {
  .trend-icon {
    width: 55px;
    height: 55px;
  }
  
  .trend-icon i {
    font-size: 26px;
  }
  
  .trend-value {
    font-size: 24px;
  }
}

@media (max-width: 640px) {
  .trend-icon {
    width: 45px;
    height: 45px;
  }
  
  .trend-icon i {
    font-size: 22px;
  }
  
  .trend-value {
    font-size: 20px;
  }
}

.new-customer-info {
  position: absolute;
  top: 20px;
  right: 20px; /* Thay đổi từ left: 20px thành right: 20px */
  background-color: rgba(255, 255, 255, 0.9); /* Làm đậm nền để dễ đọc hơn */
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 5;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #4d2900;
  border: 1px solid #eee;
}

.new-stat-item {
  display: flex;
  align-items: center;
  gap: 8px; /* Tăng khoảng cách giữa indicator và text */
}

.new-stat-item .stat-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%; /* Làm tròn indicator */
}

/* Đảm bảo trend-icon không xung đột với thông tin khách hàng mới */
.trend-container {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
}

/* Khi cả hai cùng xuất hiện (dành cho tương lai) */
.stats-card.has-trend .new-customer-info {
  right: 90px; /* Đẩy sang trái nếu có trend icon */
}
</style>