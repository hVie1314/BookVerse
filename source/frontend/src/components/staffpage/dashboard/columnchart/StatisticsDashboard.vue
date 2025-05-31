<!-- filepath: d:\Workspace\Software-engineering\project\BookVerse\source\frontend\src\components\staffpage\dashboard\columnchart\StatisticsDashboard.vue -->
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
        <div class="date-select" @click.stop="activateDateInput('fromInput')">
          <input 
            type="month" 
            id="from" 
            ref="fromInput"
            v-model="startDate" 
            @change="loadChartData"
            :min="minDate"
            :max="endDate"
          >
          <div class="selected-date pulse-on-hover">
            {{ formatMonthYear(startDate) }}
            <span class="dropdown-icon">▼</span>
          </div>
        </div>
      </div>
      <div class="filter-item">
        <label for="to">Đến:</label>
        <div class="date-select" @click.stop="activateDateInput('toInput')">
          <input 
            type="month" 
            id="to" 
            ref="toInput"
            v-model="endDate" 
            @change="loadChartData"
            :min="startDate"
            :max="maxDate"
          >
          <div class="selected-date pulse-on-hover">
            {{ formatMonthYear(endDate) }}
            <span class="dropdown-icon">▼</span>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div class="legend animate-item">
        <div class="legend-item">
          <span class="legend-color" style="background-color: #a86a2a;"></span> Tổng doanh thu
        </div>
        <div class="legend-item">
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
      <apexchart
        type="bar"
        height="400"
        :options="chartOptions"
        :series="chartSeries"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import DashboardHeader from './DashboardHeader.vue';
import VueApexCharts from 'vue3-apexcharts';
import StatsApiService from '@/services/StatsApiService';

function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export default {
  name: 'StatisticsDashboard',
  components: {
    DashboardHeader,
    apexchart: VueApexCharts
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
      startDate: formatYearMonth(startYear, startMonth),
      endDate: formatYearMonth(currentYear, currentMonth),
      minDate: formatYearMonth(currentYear - 2, 1), // 2 years ago
      maxDate: formatYearMonth(currentYear, currentMonth),
      isLoading: false,
      showDataSummary: false,
      totalRevenue: 0,
      totalOrders: 0,
      isUnmounting: false,
      animationFrames: [],
      timeoutIds: [],
      
      // ApexCharts options
      chartOptions: {
        chart: {
          id: 'revenue-orders-chart',
          type: 'line',
          stacked: false,
          toolbar: {
            show: false
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          },
          fontFamily: 'Montserrat, sans-serif'
        },
        colors: ['#a86a2a', '#000000'],
        stroke: {
          width: [0, 3],
          curve: 'smooth'
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              colors: '#4a3e3e',
              fontSize: '12px'
            },
            rotate: -45,
            rotateAlways: false
          }
        },
        yaxis: [
        {
          title: {
            text: 'Doanh thu',
            style: {
              fontWeight: 600
            }
          },
          labels: {
            formatter: (val) => `${val} triệu`,
            style: {
              colors: '#4a3e3e'
            }
          }
        },
        {
          opposite: true,
          min: 0, // Thêm dòng này để đảm bảo trục y bắt đầu từ 0
          title: {
            text: 'Số lượng đơn hàng',
            style: {
              fontWeight: 600
            }
          },
          labels: {
            formatter: (val) => Math.round(val).toString(),
            style: {
              colors: '#4a3e3e'
            }
          }
        }
      ],
        tooltip: {
          shared: true,
          intersect: false,
          theme: 'light',
          style: {
            fontSize: '14px'
          },
          y: {
            formatter: (val, { seriesIndex, w }) => {
              const name = w.config.series[seriesIndex].name;
              return name === 'Tổng doanh thu' ? 
                `${val} triệu VNĐ` : 
                `${val} đơn hàng`;
            }
          }
        },
        grid: {
          borderColor: '#e0e0e0',
          strokeDashArray: 3,
          padding: {
            top: 0,
            right: 10,
            bottom: 0,
            left: 10
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 3,
            columnWidth: '50%',
            dataLabels: {
              position: 'top'
            }
          }
        },
        legend: {
          show: false
        }
      },
      chartSeries: [
        {
          name: 'Tổng doanh thu',
          type: 'column',
          data: []
        },
        {
          name: 'Tổng số lượng đơn hàng',
          type: 'line',
          data: []
        }
      ]
    };
  },
  mounted() {
    this.loadChartData();
    
    this.safeSetTimeout(() => {
      this.showDataSummary = true;
    }, 1500);
    
    this.animateBackgroundElements();
  },
  beforeUnmount() {
    this.isUnmounting = true;
    this.clearAllPendingOperations();
  },
  methods: {
    safeSetTimeout(callback, delay) {
      if (!this.timeoutIds) this.timeoutIds = [];
      const id = setTimeout(() => {
        if (!this.isUnmounting) callback();
      }, delay);
      this.timeoutIds.push(id);
      return id;
    },
    
    addAnimationFrame(callback) {
      if (this.isUnmounting) return;
      const id = requestAnimationFrame(callback);
      this.animationFrames.push(id);
      return id;
    },
    
    clearAnimationFrames() {
      if (this.animationFrames && this.animationFrames.length) {
        this.animationFrames.forEach(id => {
          try {
            if (id) cancelAnimationFrame(id);
          } catch (e) {
            console.warn('Lỗi khi hủy animation frame:', e);
          }
        });
        this.animationFrames = [];
      }
    },

    clearAllPendingOperations() {
      // Hủy tất cả animation frames
      if (this.animationFrames && this.animationFrames.length) {
        this.animationFrames.forEach(id => {
          if (id) cancelAnimationFrame(id);
        });
        this.animationFrames = [];
      }
      
      // Hủy tất cả timeouts
      if (this.timeoutIds) {
        this.timeoutIds.forEach(id => clearTimeout(id));
        this.timeoutIds = [];
      }
    },

    activateDateInput(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].focus();
        
        if (this.$refs[refName].showPicker) {
          this.$refs[refName].showPicker();
        }
      }
    },
    
    formatMonthYear(dateString) {
      if (!dateString) return '';
      
      const [year, month] = dateString.split('-').map(Number);
      const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ];
      
      return `${monthNames[month-1]} ${year}`;
    },
    
    animateBackgroundElements() {
      const elements = document.querySelectorAll('.bg-element');
      elements.forEach(el => {
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 5;
        el.style.animationDuration = `${duration}s`;
        el.style.animationDelay = `${delay}s`;
      });
    },
    
    loadChartData: debounce(async function() {
      if (this.isLoading || this.isUnmounting) return;
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
        
        // Hiển thị tóm tắt sau khi hiển thị chart
        if (!this.isUnmounting) {
          this.renderChart(labels, revenueValues, orderValues);
          
          this.safeSetTimeout(() => {
            if (!this.isUnmounting) {
              this.showDataSummary = true;
            }
          }, 1000);
        }
        
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
        
        this.safeSetTimeout(() => {
          this.showDataSummary = true;
        }, 1000);
      } finally {
        this.isLoading = false;
      }
    }, 300),
    
    renderChart(labels, revenueData, orderData) {
      if (this.isUnmounting) return;
      
      // Tính giá trị tối đa cho các trục y
      const maxRevenue = Math.ceil(Math.max(...revenueData, 5) / 5) * 5;
      const maxOrders = Math.ceil(Math.max(...orderData, 5) / 5) * 5;
      
      // Cập nhật options
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: labels
        },
        yaxis: [
          {
            ...this.chartOptions.yaxis[0],
            max: maxRevenue
          },
          {
            ...this.chartOptions.yaxis[1],
            min: 0, // Đảm bảo giá trị min luôn là 0
            max: maxOrders
          }
        ]
      };
      
      // Phần còn lại giữ nguyên
      this.chartSeries = [
        {
          name: 'Tổng doanh thu',
          type: 'column',
          data: revenueData
        },
        {
          name: 'Tổng số lượng đơn hàng',
          type: 'line',
          data: orderData
        }
      ];
    }
  }
}
</script>

<style scoped>
/* Giữ nguyên phần CSS hiện có */
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

/* Phần filters */
.filters {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  margin: 0 0 15px 0;
  max-width: 100%;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.date-select {
  position: relative;
  cursor: pointer;
  flex: 1;
}

.date-select input {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
  z-index: 3;
}

.selected-date {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  min-width: 140px;
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

.dropdown-icon {
  font-size: 10px;
  color: #666;
  margin-left: auto;
}

.filters label {
  font-size: 14px;
  color: #4a3e3e;
  font-weight: 500;
}

/* Legend */
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

/* Chart và loading */
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

/* Data summary */
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