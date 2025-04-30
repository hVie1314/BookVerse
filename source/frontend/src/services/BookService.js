import Api from '@/services/Api';

export default {
    // Lấy tất cả sách
    getAllBooks() {
        return Api().get('book/');
    },
    
    // Lấy sách theo ID
    getBookById(id) {
        return Api().get(`book/${id}`);
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
    }
}