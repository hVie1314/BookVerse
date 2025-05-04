import Api from '@/services/Api';

export default {
    // Lấy tất cả sách
    getAllBooks() {
        return Api().get('book/');
    },
    
    // Lấy sách theo ID
    getBookById(id) {
        console.log(`Gọi API lấy thông tin sách với ID: ${id}`);
        // Đảm bảo id không phải là undefined hoặc null
        if (!id) {
            console.error('BookID không hợp lệ:', id);
            return Promise.reject(new Error('BookID không hợp lệ'));
        }
        
        // Đảm bảo cung cấp token nếu cần
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return Api().get(`book/${id}`, { headers })
            .then(response => {
                console.log('Kết quả API sách:', response.data);
                return response;
            })
            .catch(error => {
                console.error(`Lỗi khi lấy thông tin sách ID ${id}:`, error.response?.data || error.message);
                throw error;
            });
    },
    
    // Tìm kiếm sách theo từ khóa, danh mục, tác giả, giá...
    searchBooks(params) {
        return Api().get('book/search', { params });
    },
    
    // Lấy danh sách danh mục
    getCategories() {
        return Api().get('book/category');
    },
    
    // Lấy sách bán chạy nhất
    getTopSellingBooks(limit) {
        return Api().get(`book/top/${limit}`);
    },
    
    // Lấy sách mới thêm gần đây
    getRecentlyAddedBooks(limit) {
        return Api().get(`book/recently-added/${limit}`);
    },
    // Thêm sách mới (chỉ admin/staff)
    createBook(bookData) {
        return Api().post('book/', bookData);
    },
    
    // Cập nhật thông tin sách (chỉ admin/staff)
    updateBook(id, bookData) {
        return Api().put(`book/${id}`, bookData);
    },
    
    // Xóa sách (chỉ admin/staff)
    deleteBook(id) {
        return Api().delete(`book/${id}`);
    },

    // Lấy sách liên quan
    getRelatedBooks(bookId, limit = 20) {
        console.log(`Gọi API lấy sách liên quan với ID: ${bookId}, limit: ${limit}`);
        return Api().get(`book/related/${bookId}/${limit}`);
    },
    
    // Lấy đánh giá trung bình của sách
    getBookRating(bookId) {
        return Api().get(`book/rating/${bookId}`);
    }
}