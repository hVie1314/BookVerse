<template>
  <div class="statistics-dashboard animate-in">
    <div class="dashboard-background">
      <div class="bg-element bg-1"></div>
      <div class="bg-element bg-2"></div>
      <div class="bg-element bg-3"></div>
    </div>
    
    <DashboardHeader class="animate-item" />
    
    <div class="filters animate-item">
      <div class="filter-item">
        <label for="from">Từ:</label>
        <div class="date-select">
          <input 
            type="month" 
            id="from" 
            v-model="startDate" 
            @change="loadChartData"
            :min="minDate"
            :max="endDate"
          >
          <div class="selected-date pulse-on-hover">{{ formatMonthYear(startDate) }}</div>
        </div>
      </div>
      <div class="filter-item">
        <label for="to">Đến:</label>
        <div class="date-select">
          <input 
            type="month" 
            id="to" 
            v-model="endDate" 
            @change="loadChartData"
            :min="startDate"
            :max="maxDate"
          >
          <div class="selected-date pulse-on-hover">{{ formatMonthYear(endDate) }}</div>
        </div>
      </div>
      <button 
        @click="loadChartData" 
        class="refresh-button pulse-on-hover"
        :disabled="isLoading"
      >
        <span class="refresh-icon" :class="{ 'is-refreshing': isLoading }">↻</span>
        <span>Làm mới</span>
      </button>
    </div>

    <transition name="fade">
      <div class="legend animate-item">
        <div class="legend-item pulse-on-hover" @mouseover="highlightDataset(0)" @mouseout="resetHighlight">
          <span class="legend-color" style="background-color: #a86a2a;"></span> Tổng doanh thu
        </div>
        <div class="legend-item pulse-on-hover" @mouseover="highlightDataset(1)" @mouseout="resetHighlight">
          <span class="legend-color" style="background-color: black;"></span> Tổng số lượng đơn hàng
        </div>
      </div>
    </transition>

    <transition name="fade-scale">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    </transition>

    <div class="chart-wrapper animate-item">
      <canvas ref="revenueChart"></canvas>
    </div>

    <transition name="slide-in">
      <div v-if="showDataSummary" class="data-summary">
        <div class="summary-item">
          <div class="summary-label">Tổng doanh thu</div>
          <div class="summary-value">{{ totalRevenue }} triệu VNĐ</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Tổng đơn hàng</div>
          <div class="summary-value">{{ totalOrders }} đơn</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import DashboardHeader from './DashboardHeader.vue';
import Chart from 'chart.js/auto';
import StatsApiService from '@/services/StatsApiService';

export default {
  name: 'StatisticsDashboard',
  components: {
    DashboardHeader
  },
  props: {
    chartData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    // Format month as YYYY-MM
    const formatYearMonth = (year, month) => {
      return `${year}-${month.toString().padStart(2, '0')}`;
    };
    
    // Calculate 6 months ago for default start date
    let startMonth = currentMonth - 6;
    let startYear = currentYear;
    if (startMonth <= 0) {
      startMonth += 12;
      startYear -= 1;
    }
    
    return {
      chart: null,
      startDate: formatYearMonth(startYear, startMonth),
      endDate: formatYearMonth(currentYear, currentMonth),
      minDate: formatYearMonth(currentYear - 2, 1), // 2 years ago
      maxDate: formatYearMonth(currentYear, currentMonth),
      revenueData: [],
      orderData: [],
      isLoading: false,
      showDataSummary: false,
      totalRevenue: 0,
      totalOrders: 0,
      activeDatasetIndex: null
    };
  },
  mounted() {
    this.loadChartData();
    
    // Hiển thị tóm tắt dữ liệu sau khi đã hiển thị chart
    setTimeout(() => {
      this.showDataSummary = true;
    }, 1500);
    
    // Thêm hiệu ứng nền động
    this.animateBackgroundElements();
  },
  methods: {
    // Định dạng hiển thị tháng/năm theo tiếng Việt
    formatMonthYear(dateString) {
      if (!dateString) return '';
      
      const [year, month] = dateString.split('-').map(Number);
      const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ];
      
      return `${monthNames[month-1]} ${year}`;
    },
    
    // Hiệu ứng chuyển động cho các phần tử nền
    animateBackgroundElements() {
      const elements = document.querySelectorAll('.bg-element');
      elements.forEach(el => {
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 5;
        el.style.animationDuration = `${duration}s`;
        el.style.animationDelay = `${delay}s`;
      });
    },
    
    // Làm nổi bật dữ liệu khi hover vào legend
    highlightDataset(index) {
      if (!this.chart) return;
      
      this.activeDatasetIndex = index;
      
      this.chart.data.datasets.forEach((dataset, i) => {
        if (i === index) {
          dataset.backgroundColor = i === 0 ? '#c17b2b' : 'rgba(0, 0, 0, 0.9)';
          dataset.borderColor = i === 0 ? '#c17b2b' : 'rgba(0, 0, 0, 0.9)';
          dataset.borderWidth = i === 1 ? 3 : 1;
        } else {
          dataset.backgroundColor = i === 0 ? 'rgba(168, 106, 42, 0.5)' : 'rgba(0, 0, 0, 0.3)';
          dataset.borderColor = i === 0 ? 'rgba(168, 106, 42, 0.5)' : 'rgba(0, 0, 0, 0.3)';
          dataset.borderWidth = i === 1 ? 2 : 1;
        }
      });
      
      this.chart.update();
    },
    
    // Khôi phục hiển thị mặc định khi không hover
    resetHighlight() {
      if (!this.chart) return;
      
      this.activeDatasetIndex = null;
      
      this.chart.data.datasets.forEach((dataset, i) => {
        dataset.backgroundColor = i === 0 ? '#a86a2a' : 'black';
        dataset.borderColor = i === 0 ? '#a86a2a' : 'black'; 
        dataset.borderWidth = i === 1 ? 2 : 1;
      });
      
      this.chart.update();
    },
    
    async loadChartData() {
      try {
        this.isLoading = true;
        this.showDataSummary = false;
        
        // Parse date ranges
        const [startYear, startMonth] = this.startDate.split('-').map(Number);
        const [endYear, endMonth] = this.endDate.split('-').map(Number);
        
        // Map month numbers to month names
        const monthNames = [
          'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
          'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];
        
        // Chuẩn bị dữ liệu cho mỗi tháng trong khoảng thời gian
        const labels = [];
        const revenueValues = [];
        const orderValues = [];
        const monthData = {};
        
        // Tạo mảng các tháng cần lấy dữ liệu
        const months = [];
        let currentYear = startYear;
        let currentMonth = startMonth;
        
        while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
          months.push({ month: currentMonth, year: currentYear });
          
          // Tạo key và label cho tháng hiện tại
          const key = `${currentYear}-${currentMonth}`;
          const label = `${monthNames[currentMonth-1]}/${currentYear}`;
          
          // Khởi tạo dữ liệu trống cho tháng
          monthData[key] = { revenue: 0, orders: 0 };
          labels.push(label);
          
          currentMonth++;
          if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
          }
        }
        
        // Lấy dữ liệu cho từng tháng
        const promises = months.map(({ month, year }) => 
          StatsApiService.getMonthlyStats(month, year)
            .then(response => {
              if (response && response.data && response.data.success) {
                const key = `${year}-${month}`;
                const data = response.data.data;
                monthData[key] = {
                  revenue: data.revenue || 0,
                  orders: data.orderCount || 0
                };
              }
            })
            .catch(error => {
              console.warn(`Không thể lấy dữ liệu cho tháng ${month}/${year}:`, error);
            })
        );
        
        // Chờ tất cả các request hoàn thành
        await Promise.allSettled(promises);
        
        // Chuyển đổi dữ liệu từ object sang mảng cho biểu đồ
        let totalRev = 0;
        let totalOrd = 0;
        
        labels.forEach((label, index) => {
          const key = months[index].year + '-' + months[index].month;
          const revInMillions = monthData[key].revenue / 1000000; // Chuyển đổi sang triệu
          revenueValues.push(revInMillions);
          orderValues.push(monthData[key].orders);
          
          totalRev += revInMillions;
          totalOrd += monthData[key].orders;
        });
        
        this.totalRevenue = totalRev.toFixed(2);
        this.totalOrders = totalOrd;
        
        this.renderChart(labels, revenueValues, orderValues);
        
        // Hiển thị tóm tắt sau khi hiển thị chart
        setTimeout(() => {
          this.showDataSummary = true;
        }, 1000);
        
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu biểu đồ:', error);
        // Sử dụng dữ liệu mẫu nếu API gặp lỗi
        const sampleLabels = [
          'Tháng 5/2025', 'Tháng 6/2025', 'Tháng 7/2025', 
          'Tháng 8/2025', 'Tháng 9/2025', 'Tháng 10/2025', 'Tháng 11/2025'
        ];
        const sampleRevenue = [2.9, 10, 14.95, 25, 12.5, 15, 30];
        const sampleOrders = [2, 2, 6, 16, 5, 6, 20];
        
        this.totalRevenue = sampleRevenue.reduce((a, b) => a + b, 0).toFixed(2);
        this.totalOrders = sampleOrders.reduce((a, b) => a + b, 0);
        
        this.renderChart(sampleLabels, sampleRevenue, sampleOrders);
        
        // Hiển thị tóm tắt sau khi hiển thị chart
        setTimeout(() => {
          this.showDataSummary = true;
        }, 1000);
      } finally {
        this.isLoading = false;
      }
    },
    
    renderChart(labels, revenueData, orderData) {
      if (this.chart) {
        this.chart.destroy();
      }
      
      const ctx = this.$refs.revenueChart.getContext('2d');
      
      // Calculate maximum values for y-axis scales
      const maxRevenue = Math.ceil(Math.max(...revenueData, 5) / 5) * 5;
      const maxOrders = Math.ceil(Math.max(...orderData, 5) / 5) * 5;
      
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              type: 'bar',
              label: 'Tổng doanh thu',
              data: revenueData,
              backgroundColor: '#a86a2a',
              yAxisID: 'y',
              borderWidth: 1,
              borderRadius: 4,
              borderColor: '#a86a2a'
            },
            {
              type: 'line',
              label: 'Tổng số lượng đơn hàng',
              data: orderData,
              borderColor: 'black',
              backgroundColor: 'black',
              fill: false,
              tension: 0.3,
              yAxisID: 'y1',
              borderWidth: 2,
              pointBackgroundColor: 'black',
              pointBorderColor: 'white',
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1500,
            easing: 'easeOutQuart'
          },
          interaction: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            y: {
              beginAtZero: true,
              max: maxRevenue,
              title: {
                display: true,
                text: 'Doanh thu (triệu VNĐ)',
                font: {
                  weight: 'bold'
                }
              },
              ticks: {
                callback: (value) => value + ' triệu'
              }
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              max: maxOrders,
              title: {
                display: true,
                text: 'Số lượng đơn hàng',
                font: {
                  weight: 'bold'
                }
              },
              grid: {
                drawOnChartArea: false
              }
            },
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#333',
              bodyColor: '#333',
              borderColor: '#aaa',
              borderWidth: 1,
              cornerRadius: 8,
              padding: 12,
              boxPadding: 6,
              usePointStyle: true,
              callbacks: {
                label: (tooltipItem) => {
                  const label = tooltipItem.dataset.label || '';
                  const val = tooltipItem.raw;
                  return label === 'Tổng doanh thu' 
                    ? `${label}: ${val} triệu VNĐ` 
                    : `${label}: ${val} đơn hàng`;
                }
              }
            }
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.statistics-dashboard {
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Hiệu ứng nền */
.dashboard-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.05;
  pointer-events: none;
}

.bg-element {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  animation: float linear infinite;
}

.bg-1 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #a86a2a 0%, transparent 70%);
  top: -50px;
  left: -50px;
}

.bg-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #a86a2a 0%, transparent 70%);
  bottom: -100px;
  right: -50px;
}

.bg-3 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #000 0%, transparent 70%);
  top: 30%;
  right: 20%;
}

@keyframes float {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(5%, 10%) scale(1.05);
  }
  50% {
    transform: translate(10%, 5%) scale(0.95);
  }
  75% {
    transform: translate(5%, -5%) scale(1.05);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

/* Hiệu ứng xuất hiện ban đầu */
.animate-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-item {
  opacity: 0;
  animation: slideUp 0.8s ease-out forwards;
}

.animate-item:nth-child(1) {
  animation-delay: 0.1s;
}

.animate-item:nth-child(2) {
  animation-delay: 0.2s;
}

.animate-item:nth-child(3) {
  animation-delay: 0.3s;
}

.animate-item:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hiệu ứng hover */
.pulse-on-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pulse-on-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Nút làm mới */
.refresh-button {
  display: flex;
  align-items: center;
  background-color: #4D2900;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  margin-left: 10px;
}

.refresh-button:hover:not(:disabled) {
  background-color: #5e3200;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  display: inline-block;
  margin-right: 5px;
  font-size: 16px;
  transition: transform 0.5s ease;
}

.is-refreshing {
  animation: rotating 1s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Filters */
.filters {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  margin-bottom: 15px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-select {
  position: relative;
}

.date-select input {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 140px;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
  z-index: 2;
}

.selected-date {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 140px;
  background-color: white;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.selected-date:hover {
  border-color: #a86a2a;
}

.selected-date::after {
  content: "▼";
  font-size: 10px;
  color: #666;
  margin-left: auto;
}

.filters label {
  font-size: 14px;
  color: #4a3e3e;
  font-weight: 500;
}

/* Legend with hover effects */
.legend {
  margin: 10px 0;
  display: flex;
  gap: 20px;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #4a3e3e;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.legend-item:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
}

.legend-color {
  width: 12px;
  height: 12px;
  display: inline-block;
  margin-right: 6px;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.legend-item:hover .legend-color {
  transform: scale(1.2);
}

/* Chart and loading */
.chart-wrapper {
  border-top: 1px solid #ccc;
  padding-top: 15px;
  height: 400px;
  width: 100%;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 10px;
  backdrop-filter: blur(3px);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #a86a2a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

/* Data summary section */
.data-summary {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.summary-item {
  text-align: center;
}

.summary-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.summary-value {
  font-size: 18px;
  font-weight: bold;
  color: #4D2900;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-scale-enter-active, .fade-scale-leave-active {
  transition: all 0.5s;
}

.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.slide-in-enter-active, .slide-in-leave-active {
  transition: all 0.5s;
}

.slide-in-enter-from, .slide-in-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .legend {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-wrapper {
    height: 300px;
  }
  
  .data-summary {
    flex-direction: column;
    gap: 15px;
  }
}
</style>