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
import UserService from '@/services/UserService';
import OrderService from '@/services/OrderService';

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
          { label: ' Mới', value: '0%', color: '#4D2900' },
          { label: ' Hoạt động', value: '0%', color: '#BA9468' },
          { label: ' Không hoạt động', value: '0%', color: '#9F8888' }
        ]
      },
      orderStats: {
        totalOrders: 0,
        stats: [
          { label: ' Đã thanh toán', value: '0%', color: '#4D2900' },
          { label: ' Đã hủy', value: '0%', color: '#9F8888' }
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
    const originalConsoleError = console.error;
    console.error = function(...args) {
      const errorMessage = args.join(' ');
      if (errorMessage.includes('Cannot read properties of null (reading \'save\')') || 
          errorMessage.includes('clipArea')) {
        // Bỏ qua lỗi này
        console.warn('Bỏ qua lỗi Chart.js:', args);
        return;
      }
      originalConsoleError.apply(console, args);
    };
    
    this.fetchStats();
  },
  beforeUnmount() {
    // Khôi phục lại hàm console.error gốc
    console.error = window._originalConsoleError || console.error;
  },
  methods: {
    async fetchStats() {
      try {
        // --- Cập nhật lấy thống kê đơn hàng từ OrderService ---
        const orderResponse = await OrderService.getOrderStatistics();
        if (orderResponse.data && orderResponse.data.success) {
          const orderData = orderResponse.data.data;
          
          // Tính tỷ lệ phần trăm các loại đơn hàng
          const totalOrders = orderData.totalOrders;
          const successfulPercentage = totalOrders ? Math.round((orderData.successfulOrders / totalOrders) * 100) : 0;
          const cancelledPercentage = totalOrders ? Math.round((orderData.cancelledOrders / totalOrders) * 100) : 0;
          const pendingPercentage = totalOrders ? Math.round((orderData.pendingOrders / totalOrders) * 100) : 0;
          
          // Cập nhật dữ liệu với định dạng hiện tại và thêm trạng thái "Đang chờ thanh toán"
          this.orderStats = {
            totalOrders: totalOrders,
            stats: [
              { label: ' Đã thanh toán', value: `${successfulPercentage}%`, color: '#4D2900' },
              { label: ' Đang chờ thanh toán', value: `${pendingPercentage}%`, color: '#BA9468' },
              { label: ' Đã hủy', value: `${cancelledPercentage}%`, color: '#9F8888' }
            ]
          };
        }
        
        // --- Cập nhật lấy thống kê khách hàng từ UserService ---
        const customerResponse = await UserService.getAllCustomers();
        if (customerResponse.data && customerResponse.data.success) {
          const customers = customerResponse.data.data;
          const totalCustomers = customers.length;
          
          // Phân loại khách hàng theo trạng thái hoạt động
          const activeCustomers = customers.filter(customer => customer.lastLogin !== null);
          const activeCount = activeCustomers.length;
          const inactiveCount = totalCustomers - activeCount;
          
          // Tính tỷ lệ phần trăm
          const activePercentage = totalCustomers ? Math.round((activeCount / totalCustomers) * 100) : 0;
          const inactivePercentage = totalCustomers ? Math.round((inactiveCount / totalCustomers) * 100) : 0;
          const newPercentage = 100 - activePercentage - inactivePercentage; // Có thể điều chỉnh logic xác định khách hàng mới
          
          // Cập nhật dữ liệu với định dạng hiện tại
          this.customerStats = {
            totalCustomers: totalCustomers,
            stats: [
              { label: ' Mới', value: `${newPercentage}%`, color: '#4D2900' },
              { label: ' Hoạt động', value: `${activePercentage}%`, color: '#BA9468' },
              { label: ' Không hoạt động', value: `${inactivePercentage}%`, color: '#9F8888' }
            ]
          };
        }
        
        // Lấy thống kê doanh thu vẫn giữ nguyên
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