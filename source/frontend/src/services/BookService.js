import Api from '@/services/Api';

export default {
    // Lấy tất cả sách
    getAllBooks(page = 1, limit = 10, filters = {}, sortOption = 'default') {
        // Kiểm tra tham số đầu vào
        if (isNaN(page) || page <= 0) {
            console.error('Page không hợp lệ:', page);
            page = 1;
        }
        
        if (isNaN(limit) || limit <= 0) {
            console.error('Limit không hợp lệ:', limit);
            limit = 10;
        }
        
        // Đảm bảo cung cấp token nếu cần
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Xây dựng params cho API request
        const params = {
            page,
            limit,
            sort: sortOption
        };
        
        // Thêm các bộ lọc vào params
        if (filters.categories && filters.categories.length > 0) {
            params.categories = filters.categories.join(',');
        }
        
        if (filters.minPrice) {
            params.minPrice = filters.minPrice;
        }
        
        if (filters.maxPrice) {
            params.maxPrice = filters.maxPrice;
        }
        
        if (filters.minRating) {
            params.minRating = filters.minRating;
        }
        
        if (filters.searchQuery) {
            params.search = filters.searchQuery;
        }
        
        console.log(`Gọi API lấy danh sách sách với params:`, params);
        
        return Api().get('book', { 
            params,
            headers
        })
        .then(response => {
            console.log('Kết quả API danh sách sách:', response.data);
            return response;
        })
        .catch(error => {
            console.error(`Lỗi khi lấy danh sách sách:`, error.response?.data || error.message);
            
            // Dữ liệu mẫu cho môi trường development
            if (process.env.NODE_ENV === 'development') {
                return {
                    data: {
                        success: true,
                        data: {
                            books: Array(10).fill().map((_, i) => ({
                                _id: `sample-${i}`,
                                title: `Sách mẫu #${i}`,
                                author: 'Tác giả',
                                price: 100000 + i * 10000,
                                image: `https://picsum.photos/seed/${i}/300/400`
                            })),
                            pagination: {
                                currentPage: page,
                                totalPages: 10,
                                totalBooks: 100
                            }
                        }
                    }
                };
            }
            
            throw error;
        });
    },
    
    // Lấy sách theo ID
    getBookById(id) {
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
        
        console.log(`Gọi API lấy thông tin sách với ID: ${id}`);
        return Api().get(`book/${id}`, { headers })
            .then(response => {
                console.log('Kết quả API sách:', response.data);
                // Kiểm tra nếu sách có dữ liệu ảnh dạng chuỗi mảng
                if (response.data && response.data.book && response.data.book.image) {
                    try {
                        // Nếu image là chuỗi mảng, chuyển thành mảng thực tế
                        if (typeof response.data.book.image === 'string' && 
                            response.data.book.image.startsWith('[') && 
                            response.data.book.image.endsWith(']')) {
                            const imageArray = JSON.parse(response.data.book.image.replace(/'/g, '"'));
                            response.data.book.imageArray = imageArray;
                            response.data.book.mainImage = imageArray[0]; // Lấy ảnh đầu tiên làm ảnh chính
                        } else {
                            response.data.book.mainImage = response.data.book.image;
                        }
                    } catch (error) {
                        console.error('Lỗi xử lý dữ liệu ảnh:', error);
                        response.data.book.mainImage = response.data.book.image;
                    }
                }
                return response;
            })
            .catch(error => {
                console.error(`Lỗi khi lấy thông tin sách ID ${id}:`, error.response?.data || error.message);
                
                // Trong môi trường phát triển, trả về dữ liệu giả nếu API lỗi
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Sử dụng dữ liệu mẫu cho môi trường phát triển');
                    return {
                        data: {
                            book: {
                                _id: id,
                                title: `Sách mẫu #${id.substring(0, 5)}`,
                                author: 'Tác giả không xác định',
                                price: 150000,
                                originalPrice: 180000,
                                category: 'Sách mẫu',
                                description: 'Đây là dữ liệu mẫu được sử dụng khi không thể kết nối đến API.',
                                mainImage: 'https://picsum.photos/seed/' + id + '/300/400',
                                sold: 0,
                                rating: 0
                            }
                        }
                    };
                }
                
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
   // Lấy sách liên quan
getRelatedBooks(bookId, limit = 20) {
    console.log(`Gọi API lấy sách liên quan với ID: ${bookId}, limit: ${limit}`);
    
    // Đảm bảo cung cấp token nếu cần
    const headers = {};
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return Api().get(`book/related/${bookId}/${limit}`, { headers })
        .then(response => {
            console.log('Kết quả API sách liên quan:', response.data);
            return response;
        })
        .catch(error => {
            console.error(`Lỗi khi lấy sách liên quan:`, error.response?.data || error.message);
            throw error;
        });
},
    
    // Lấy đánh giá trung bình của sách
    getBookRating(bookId) {
        return Api().get(`book/rating/${bookId}`);
    }
}