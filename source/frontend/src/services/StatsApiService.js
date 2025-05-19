import Api from '@/services/Api';

export default {
    getMonthlyStats(month, year) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token không hợp lệ hoặc không tồn tại');
            return Promise.reject(new Error('Token không hợp lệ hoặc không tồn tại'));
        }
        
        return Api().get(`stats/report?month=${month}&year=${year}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    getRevenueByDateRange(startMonth, startYear, endMonth, endYear) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token không hợp lệ hoặc không tồn tại');
            return Promise.reject(new Error('Token không hợp lệ hoặc không tồn tại'));
        }
        
        return Api().get(`stats/revenue?startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
}