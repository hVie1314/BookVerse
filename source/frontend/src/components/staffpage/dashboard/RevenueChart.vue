<template>
  <section class="revenue-chart">
    <div class="chart-header">
      <h2 class="chart-title">Doanh thu</h2>
      <div class="date-select">
        <select v-model="selectedPeriod" @change="loadData">
          <option value="7">7 ngày qua</option>
          <option value="30">30 ngày qua</option>
          <option value="90">3 tháng qua</option>
        </select>
      </div>
    </div>
    
    <StatisticsDashboard :chartData="chartData" />
  </section>
</template>

<script>
import StatisticsDashboard from './columnchart/StatisticsDashboard.vue';
import StatsService from '@/services/StatsService';

export default {
  name: 'RevenueChart',
  components: {
    StatisticsDashboard
  },
  data() {
    return {
      selectedPeriod: 30, // Mặc định hiển thị 30 ngày
      chartData: [],
      isLoading: false
    };
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.isLoading = true;
        const days = parseInt(this.selectedPeriod);
        // Số tháng cần lấy dựa trên số ngày đã chọn
        const months = Math.ceil(days / 30);
        
        const data = await StatsService.getRevenueChartData(months);
        
        // Nếu số ngày được chọn nhỏ hơn tổng số dữ liệu, chỉ lấy n ngày cuối cùng
        this.chartData = data.slice(-days);
        
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu biểu đồ:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.revenue-chart {
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #4d2900;
}

.date-select select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}
</style>