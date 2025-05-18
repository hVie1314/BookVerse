import UserService from './UserService';
import StatsApiService from './StatsApiService';

export default {
  // Lấy thống kê khách hàng
  async getCustomerStats() {
    try {
      // Lấy danh sách khách hàng từ API
      const response = await UserService.getAllCustomers();
      
      if (!response || !response.data) {
        throw new Error('Không có dữ liệu trả về từ API');
      }
      
      // Xử lý cấu trúc phản hồi API
      let customers = [];
      if (response.data.success && Array.isArray(response.data.data)) {
        // Trường hợp API trả về định dạng { success: true, data: [...] }
        customers = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Trường hợp API trả về trực tiếp mảng
        customers = response.data;
      } else {
        console.error('Cấu trúc dữ liệu không đúng định dạng:', response.data);
        throw new Error('Dữ liệu API không đúng định dạng');
      }
      
      const totalCustomers = customers.length;
      
      // Tính ngày hôm nay để so sánh
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Tính số khách hàng mới (tạo trong ngày hôm nay)
      const newCustomers = customers.filter(customer => {
        if (!customer.createdAt) return false;
        const createdAt = new Date(customer.createdAt);
        createdAt.setHours(0, 0, 0, 0);
        return createdAt.getTime() === today.getTime();
      });
      
      // Tính số khách hàng đang hoạt động (updatedAt trùng với ngày hiện tại)
      const activeCustomers = customers.filter(customer => {
        if (!customer.updatedAt) return false;
        const updatedAt = new Date(customer.updatedAt);
        updatedAt.setHours(0, 0, 0, 0);
        return updatedAt.getTime() === today.getTime();
      });
      
      // Số khách hàng không hoạt động
      const inactiveCustomers = totalCustomers - activeCustomers.length - newCustomers.length;
      
      // Tính phần trăm
      const newPercentage = totalCustomers > 0 ? Math.round((newCustomers.length / totalCustomers) * 100) : 0;
      const activePercentage = totalCustomers > 0 ? Math.round((activeCustomers.length / totalCustomers) * 100) : 0;
      const inactivePercentage = totalCustomers > 0 ? 100 - newPercentage - activePercentage : 0;
      
      // Log thông tin để debug
      console.log('Tổng số khách hàng:', totalCustomers);
      console.log('Khách hàng mới:', newCustomers.length);
      console.log('Khách hàng đang hoạt động:', activeCustomers.length);
      console.log('Khách hàng không hoạt động:', inactiveCustomers);
      
      return {
        totalCustomers,
        newCustomers: newCustomers.length,
        activeCustomers: activeCustomers.length,
        inactiveCustomers,
        stats: [
          { label: ' mới', value: `${newPercentage}%`, color: '#4D2900' },
          { label: ' hoạt động', value: `${activePercentage}%`, color: '#BA9468' },
          { label: ' không hoạt động', value: `${inactivePercentage}%`, color: '#9F8888' }
        ]
      };
    } catch (error) {
      console.error('Lỗi khi lấy thống kê khách hàng:', error);
      // Trả về dữ liệu mẫu nếu có lỗi
      return {
        totalCustomers: 0,
        newCustomers: 0,
        activeCustomers: 0,
        inactiveCustomers: 0,
        stats: [
          { label: ' mới', value: '0%', color: '#4D2900' },
          { label: ' hoạt động', value: '0%', color: '#BA9468' },
          { label: ' không hoạt động', value: '0%', color: '#9F8888' }
        ]
      };
    }
  },

  // Lấy thống kê đơn hàng
  async getOrderStats() {
    try {
      // Lấy tháng và năm hiện tại
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      const currentYear = currentDate.getFullYear();
      
      // Gọi API lấy thống kê theo tháng
      const response = await StatsApiService.getMonthlyStats(currentMonth, currentYear);
      
      if (!response || !response.data) {
        throw new Error('Không có dữ liệu trả về từ API');
      }
      
      const data = response.data.success ? response.data.data : response.data;
      
      // Tính toán phần trăm đơn hàng đã hoàn thành
      // Trong thực tế, bạn cần API để cung cấp số đơn hoàn thành và đơn hủy
      const completedOrders = data.orderCount || 0;
      const canceledOrders = 0; // Giả định không có đơn hàng bị hủy
      const totalOrders = completedOrders + canceledOrders;
      
      const completedPercentage = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 100;
      const canceledPercentage = totalOrders > 0 ? Math.round((canceledOrders / totalOrders) * 100) : 0;
      
      return {
        totalOrders,
        completedOrders,
        canceledOrders,
        stats: [
          { label: 'Đã thanh toán', value: `${completedPercentage}%`, color: '#4D2900' },
          { label: 'Đã hủy', value: `${canceledPercentage}%`, color: '#9F8888' }
        ]
      };
    } catch (error) {
      console.error('Lỗi khi lấy thống kê đơn hàng:', error);
      return {
        totalOrders: 0,
        stats: [
          { label: 'Đã thanh toán', value: '0%', color: '#4D2900' },
          { label: 'Đã hủy', value: '0%', color: '#9F8888' }
        ]
      };
    }
  },

  // Lấy thống kê doanh thu
  async getRevenueStats() {
    try {
      // Lấy tháng và năm hiện tại
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      // Gọi API lấy thống kê theo tháng
      const response = await StatsApiService.getMonthlyStats(currentMonth, currentYear);
      
      if (!response || !response.data) {
        throw new Error('Không có dữ liệu trả về từ API');
      }
      
      const data = response.data.success ? response.data.data : response.data;
      
      // Định dạng doanh thu thành chuỗi có dấu phẩy ngăn cách hàng nghìn
      const formattedRevenue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(data.revenue || 0);
      
      // Lấy phần trăm thay đổi doanh thu từ tháng trước
      const trendValue = `${data.revenueChangePercent >= 0 ? '+' : ''}${data.revenueChangePercent}%`;
      
      return {
        totalRevenue: formattedRevenue,
        trendValue
      };
    } catch (error) {
      console.error('Lỗi khi lấy thống kê doanh thu:', error);
      return {
        totalRevenue: '0 ₫',
        trendValue: '+0%'
      };
    }
  },
  
  // Thêm phương thức mới để lấy dữ liệu cho biểu đồ doanh thu
  async getRevenueChartData(months = 3) {
    try {
      const currentDate = new Date();
      const endMonth = currentDate.getMonth() + 1;
      const endYear = currentDate.getFullYear();
      
      // Tính toán startMonth và startYear (mặc định là 3 tháng trước)
      let startMonth = endMonth - months + 1;
      let startYear = endYear;
      if (startMonth <= 0) {
        startMonth += 12;
        startYear -= 1;
      }
      
      const response = await StatsApiService.getRevenueByDateRange(
        startMonth, startYear, endMonth, endYear
      );
      
      if (!response || !response.data) {
        throw new Error('Không có dữ liệu trả về từ API');
      }
      
      const data = response.data.success ? response.data.data : response.data;
      
      // Chuyển đổi dữ liệu sang định dạng phù hợp cho biểu đồ
      return data.map(item => ({
        date: new Date(item.date).toLocaleDateString('vi-VN', {
          day: '2-digit', 
          month: '2-digit'
        }).replace('/', '/'),
        value: item.revenue
      }));
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu biểu đồ doanh thu:', error);
      // Trả về dữ liệu mẫu nếu có lỗi
      return [
        { date: '15/01', value: 2900000 },
        { date: '16/01', value: 15000000 },
        { date: '17/01', value: 18000000 },
        { date: '18/01', value: 25000000 },
        { date: '19/01', value: 22000000 },
        { date: '20/01', value: 20000000 },
        { date: '21/01', value: 28000000 }
      ];
    }
  }
};