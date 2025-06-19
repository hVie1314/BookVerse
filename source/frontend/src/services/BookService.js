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
        
        const url = `book/page/${page}/limit/${limit}`;
        // Xây dựng params cho API request
        const params = {
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
        
        // Thêm hỗ trợ lọc sản phẩm mới nhập
        if (filters.recentlyAdded) {
            params.recentlyAdded = true;
        }
        
        if (filters.startDate) {
            params.startDate = filters.startDate;
        }
        
        console.log(`Gọi API lấy danh sách sách với params:`, params);
        
        return Api().get(url, { 
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
        // Đảm bảo params là object
        const searchParams = params || {};
        
        // Log thông tin tìm kiếm để debug
        console.log('Tìm kiếm sách với tham số:', searchParams);
        
        return Api().get('book/search', { params: searchParams })
            .then(response => {
            console.log('Kết quả tìm kiếm sách:', response.data);
            return response;
            })
            .catch(error => {
            console.error('Lỗi khi tìm kiếm sách:', error);
            throw error;
            });
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
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token không hợp lệ hoặc không tồn tại');
            return Promise.reject(new Error('Token không hợp lệ hoặc không tồn tại'));
        }

        console.log('Tạo sách mới với dữ liệu: ', bookData);

        return Api().post('book/', bookData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Cập nhật thông tin sách (chỉ admin/staff)
    updateBook(id, bookData) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token không hợp lệ hoặc không tồn tại');
            return Promise.reject(new Error('Token không hợp lệ hoặc không tồn tại'));
        }
        return Api().put(`book/${id}`, bookData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Xóa sách (chỉ admin/staff)
    deleteBook(id) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token không hợp lệ hoặc không tồn tại');
            return Promise.reject(new Error('Token không hợp lệ hoặc không tồn tại'));
        }
        
        return Api().delete(`book/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
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
    },

    // Thêm vào cuối file, trước dấu đóng ngoặc cuối cùng

    // Lấy đánh giá của sách
    getBookReviews(bookId) {
        // Kiểm tra tham số đầu vào
        if (!bookId) {
            console.error('BookID không hợp lệ:', bookId);
            return Promise.reject(new Error('BookID không hợp lệ'));
        }
        
        // Đảm bảo cung cấp token nếu cần
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        console.log(`Gọi API lấy đánh giá của sách với ID: ${bookId}`);
        return Api().get(`review/${bookId}`, { headers })
            .then(response => {
                console.log('Kết quả API đánh giá sách:', response.data);
                return response;
            })
            .catch(error => {
                console.error(`Lỗi khi lấy đánh giá sách ID ${bookId}:`, error.response?.data || error.message);
                
                // Trong môi trường phát triển, trả về dữ liệu giả nếu API lỗi
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Sử dụng dữ liệu mẫu cho đánh giá sách');
                    return {
                        data: {
                            ratingStats: [
                                { rating: 1, count: 1 },
                                { rating: 2, count: 2 },
                                { rating: 3, count: 3 },
                                { rating: 4, count: 8 },
                                { rating: 5, count: 5 }
                            ],
                            averageRating: 3.7,
                            totalReviews: 19,
                            reviews: Array(5).fill().map((_, i) => ({
                                _id: `review-${i}`,
                                userId: `user-${i}`,
                                bookId: bookId,
                                rating: Math.min(5, Math.floor(Math.random() * 5) + 1),
                                comment: `Đây là một đánh giá mẫu ${i+1} cho sách này.`,
                                createdAt: new Date(Date.now() - i * 86400000).toISOString(),
                                user: {
                                    username: `user${i+1}`,
                                    avatar: `https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i+1}.jpg`
                                }
                            }))
                        }
                    };
                }
                
                throw error;
            });
    },
    // Upload ảnh sách
    uploadImage(formData) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'multipart/form-data'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return Api().post('upload/image', formData, { headers });
    }
}