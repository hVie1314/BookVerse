<template>
  <main class="dashboard">
    <h1 class="dashboard-title">Tổng quan thống kê</h1>
    
    <section class="stats-container">
      <StatsCard
        title="Khách hàng"
        :value="formatNumberWithCommas(customerStats.totalCustomers)"
        :stats="customerStats.stats"
        chartType="user"
      />
      <StatsCard
        title="Đơn hàng"
        :value="formatNumberWithCommas(orderStats.totalOrders)"
        :stats="orderStats.stats"
        chartType="order"
      />
      <StatsCard
        title="Tổng doanh thu"
        :value="revenueStats.totalRevenue"
        :trendValue="revenueStats.trendValue"
        chartType="revenue"
      />
    </section>
    
    <RevenueChart />
    
    <TopBooks />
  </main>
</template>

<script>
import StatsCard from './StatsCard.vue';
import RevenueChart from './RevenueChart.vue';
import TopBooks from './TopBooks.vue';
import StatsService from '@/services/StatsService';

export default {
  name: 'DashBoard',
  components: {
    StatsCard,
    RevenueChart,
    TopBooks
  },
  data() {
    return {
      customerStats: {
        totalCustomers: 0,
        stats: [
          { label: 'mới', value: '0%', color: '#4D2900' },
          { label: 'hoạt động', value: '0%', color: '#BA9468' },
          { label: 'không hoạt động', value: '0%', color: '#9F8888' }
        ]
      },
      orderStats: {
        totalOrders: 0,
        stats: [
          { label: 'Đã thanh toán', value: '0%', color: '#4D2900' },
          { label: 'Đã hủy', value: '0%', color: '#9F8888' }
        ]
      },
      revenueStats: {
        totalRevenue: '0 Đ',
        trendValue: '+0%'
      }
    };
  },
  async mounted() {
    document.title = 'BookVerse - Thống kê';
    await this.fetchStats();
  },
  methods: {
    async fetchStats() {
      try {
        // Hiển thị trạng thái loading nếu cần
        
        // Lấy thống kê khách hàng
        const customerStats = await StatsService.getCustomerStats();
        this.customerStats = customerStats;
        
        // Lấy thống kê đơn hàng
        const orderStats = await StatsService.getOrderStats();
        this.orderStats = orderStats;
        
        // Lấy thống kê doanh thu
        const revenueStats = await StatsService.getRevenueStats();
        this.revenueStats = revenueStats;
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
        // Hiển thị thông báo lỗi nếu cần
      }
    },
    formatNumberWithCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: none;
  margin-left: auto;
  margin-right: auto;
  padding: 38px 42px;
  min-height: 100vh;
  background-color: #f4ebe1;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 700;
  color: #4d2900;
  margin: 0 0 28px 0;
}

.stats-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 1200px) {
  .stats-container {
    flex-wrap: wrap;
  }
  
  .stats-container > * {
    flex: 1 1 300px;
  }
}

@media (max-width: 991px) {
  .dashboard {
    padding: 20px;
  }
  
  .stats-container {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .dashboard-title {
    font-size: 24px;
  }
}
</style>