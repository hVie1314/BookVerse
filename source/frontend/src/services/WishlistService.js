import Api from '@/services/Api';
import AuthenticationService from './AuthenticationService';
import eventBus from '@/eventBus.js';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from 'vue-toastification';

const toast = useToast();
export default {
    // Thêm sản phẩm vào wishlist người dùng
    addToUserWishlist(userId, productId) {
        const token = localStorage.getItem('token');
        return Api().post('wishlist/', { 
            userId,
            productId 
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Xóa sản phẩm khỏi wishlist người dùng
    removeFromUserWishlist(userId, productId) {
        const token = localStorage.getItem('token');
        return Api().delete('wishlist/', { 
            headers: { 'Authorization': `Bearer ${token}` },
            data: { userId, productId }
        });
    },
    
    // Lấy wishlist của người dùng theo userId
    getUserWishlist(userId) {
        const token = localStorage.getItem('token');
        return Api().get(`wishlist/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Thêm sản phẩm vào wishlist khách
    addToGuestWishlist(wishlistId, productId) {
        // Sử dụng endpoint đúng: /guest
        return Api().post('wishlist/guest', { 
            wishlistId, 
            productId 
        }).then(response => {
            // Luôn lưu vào localStorage khi thành công
            this.saveGuestWishlistItemToLocal(wishlistId, productId);
            return response;
        }).catch(error => {
            // Xử lý trường hợp API không tồn tại hoặc lỗi
            if (error.response && error.response.status === 404) {
                // Nếu API không tồn tại, lưu vào localStorage và trả về success giả
                this.saveGuestWishlistItemToLocal(wishlistId, productId);
                return Promise.resolve({
                    data: {
                        success: true,
                        data: {}
                    }
                });
            }
            return Promise.reject(error);
        });
    },
    
    // Xóa sản phẩm khỏi wishlist khách
    removeFromGuestWishlist(wishlistId, productId) {
        return Api().delete('wishlist/guest', { 
            data: { wishlistId, productId } 
        }).catch(error => {
            // Xử lý trường hợp API không tồn tại hoặc lỗi
            if (error.response && error.response.status === 404) {
                // Nếu API không tồn tại, xóa từ localStorage và trả về success giả
                this.removeGuestWishlistItemFromLocal(wishlistId, productId);
                return Promise.resolve({
                    data: {
                        success: true,
                        data: {}
                    }
                });
            }
            return Promise.reject(error);
        });
    },
    
    // Lấy wishlist của khách theo wishlistId
    getGuestWishlist(wishlistId) {
        return Api().get(`wishlist/guest/${wishlistId}`).catch(error => {
            // Xử lý trường hợp API không tồn tại hoặc lỗi
            if (error.response && error.response.status === 404) {
                // Nếu API không tồn tại, lấy từ localStorage và trả về kết quả giả
                const items = this.getGuestWishlistFromLocal(wishlistId);
                return Promise.resolve({
                    data: {
                        success: true,
                        data: {
                            products: items.map(productId => ({ productId }))
                        }
                    }
                });
            }
            return Promise.reject(error);
        });
    },
    
    saveGuestWishlistItemToLocal(wishlistId, productId) {
        const items = this.getGuestWishlistFromLocal(wishlistId);
        if (!items.includes(productId)) {
            items.push(productId);
            localStorage.setItem(`wishlist_${wishlistId}`, JSON.stringify(items));
        }
    },

    removeGuestWishlistItemFromLocal(wishlistId, productId) {
        let items = this.getGuestWishlistFromLocal(wishlistId);
        items = items.filter(id => id !== productId);
        localStorage.setItem(`wishlist_${wishlistId}`, JSON.stringify(items));
    },
    
    getGuestWishlistFromLocal(wishlistId) {
        const storedItems = localStorage.getItem(`wishlist_${wishlistId}`);
        return storedItems ? JSON.parse(storedItems) : [];
    },

    // Gộp wishlist khách vào wishlist người dùng sau khi đăng nhập
    mergeGuestWishlistToUserWishlist(userId, wishlistId) {
        const token = localStorage.getItem('token');
        return Api().post('wishlist/merge', { userId, wishlistId }, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch(error => {
            if (error.response && error.response.status === 404) {
                // API không tồn tại, trả về lỗi để kích hoạt merge thủ công
                return Promise.reject(new Error('API_NOT_FOUND'));
            }
            return Promise.reject(error);
        });
    },
    
    // Đảm bảo luôn có cartId cho khách
    ensureGuestWishlistId() {
        let wishlistId = localStorage.getItem('guestWishlistId');
        if (!wishlistId) {
            // Tạo wishlistId với định dạng "guest<uuid>"
            const uuid = uuidv4().replace(/-/g, ''); // Loại bỏ dấu gạch ngang từ UUID
            wishlistId = `guest${uuid}`;
            localStorage.setItem('guestWishlistId', wishlistId);
        }
        return wishlistId;
    },
    
    // Phương thức wrapper để tự động chọn loại wishlist phù hợp
    // Phương thức wrapper để tự động chọn loại wishlist phù hợp
    addToWishlist(productId) {
        if (AuthenticationService.isLoggedIn()) {
            const userId = AuthenticationService.getCurrentUser().id;
            const token = localStorage.getItem('token');
            
            if (!token) {
                toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", {
                    timeout: 2500
                });
                
                return Promise.reject(new Error('Authentication token not found'));
            }
            
            return this.addToUserWishlist(userId, productId)
                .then(response => {
                    eventBus.emit('wishlist-updated');
                    toast.success("Đã thêm sản phẩm vào danh sách yêu thích", {
                        timeout: 2500
                    });
                    return response;
                })
                .catch(error => {
                    if (error.response && error.response.status === 401) {
                        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại", {
                            timeout: 2500
                        });
                    }
                    return Promise.reject(error);
                });
        } else {
            const wishlistId = this.ensureGuestWishlistId();
            return this.addToGuestWishlist(wishlistId, productId)
                .then(response => {
                    eventBus.emit('wishlist-updated');
                    toast.success("Đã thêm sản phẩm vào danh sách yêu thích", {
                        timeout: 2500
                    });
                    return response;
                });
        }
    },
    
    // Xóa sản phẩm khỏi wishlist
    removeFromWishlist(productId) {
        if (AuthenticationService.isLoggedIn()) {
            const userId = AuthenticationService.getCurrentUser().id;
            return this.removeFromUserWishlist(userId, productId)
                .then(response => {
                    eventBus.emit('wishlist-updated');
                    toast.success("Đã xóa sản phẩm khỏi danh sách yêu thích", {
                        timeout: 2500
                    });
                    return response;
                });
        } else {
            const wishlistId = this.ensureGuestWishlistId();
            return this.removeFromGuestWishlist(wishlistId, productId)
                .then(response => {
                    eventBus.emit('wishlist-updated');
                    toast.success("Đã xóa sản phẩm khỏi danh sách yêu thích", {
                        timeout: 2500
                    });
                    return response;
                });
        }
    },

    checkProductInWishlist(productId) {
        if (AuthenticationService.isLoggedIn()) {
            // Giữ nguyên logic cho người dùng đã đăng nhập
            const userId = AuthenticationService.getCurrentUser().id;
            return this.getUserWishlist(userId)
                .then(response => {
                    if (response.data && response.data.success && response.data.data) {
                        const wishlistItems = response.data.data.products || [];
                        return wishlistItems.some(item => {
                            if (typeof item.productId === 'string') {
                                return item.productId === productId;
                            }
                            
                            if (item.productId && item.productId._id) {
                                return item.productId._id === productId;
                            }
                            
                            if (item.productId && item.productId.toString) {
                                return item.productId.toString() === productId.toString();
                            }
                            
                            return false;
                        });
                    }
                    return false;
                })
                .catch(error => {
                    console.error('Lỗi khi kiểm tra sản phẩm trong wishlist:', error);
                    return false;
                });
        } else {
            // Cập nhật logic cho khách - ưu tiên localStorage nếu API lỗi
            const wishlistId = this.ensureGuestWishlistId();
            const localItems = this.getGuestWishlistFromLocal(wishlistId);
            
            // Nếu đã có trong localStorage, trả về kết quả ngay
            if (localItems.includes(productId)) {
                return Promise.resolve(true);
            }
            
            return this.getGuestWishlist(wishlistId)
                .then(response => {
                    if (response.data && response.data.success && response.data.data) {
                        const wishlistItems = response.data.data.products || [];
                        return wishlistItems.some(item => {
                            if (typeof item.productId === 'string') {
                                return item.productId === productId;
                            }
                            
                            if (item.productId && item.productId._id) {
                                return item.productId._id === productId;
                            }
                            
                            return false;
                        });
                    }
                    return false;
                })
                .catch(error => {
                    console.error('Lỗi khi kiểm tra sản phẩm trong wishlist khách:', error);
                    // Trả về kết quả từ localStorage nếu API lỗi
                    return localItems.includes(productId);
                });
        }
    },

    getWishlist() {
        if (AuthenticationService.isLoggedIn()) {
            const userId = AuthenticationService.getCurrentUser().id;
            return this.getUserWishlist(userId);
        } else {
            const wishlistId = this.ensureGuestWishlistId();
            return this.getGuestWishlist(wishlistId);
        }
    },

    // Phương thức merge - cập nhật để xử lý tốt hơn với API lỗi
    async mergeWishlistAfterLogin(userId) {
        const guestWishlistId = localStorage.getItem('guestWishlistId');
        
        if (!guestWishlistId) {
            console.log('Không tìm thấy guestWishlistId, không cần merge');
            return Promise.resolve({ data: { success: true, message: 'Không có wishlist guest để merge' } });
        }
        
        // Lấy danh sách từ localStorage
        const localItems = this.getGuestWishlistFromLocal(guestWishlistId);
        
        try {
            // Kiểm tra danh sách từ API trước
            const guestWishlistResponse = await this.getGuestWishlist(guestWishlistId);
            
            // Kiểm tra xem wishlist có trống không
            if ((!guestWishlistResponse.data || !guestWishlistResponse.data.success || 
                !guestWishlistResponse.data.data || !guestWishlistResponse.data.data.products || 
                guestWishlistResponse.data.data.products.length === 0) && localItems.length === 0) {
                
                console.log('Wishlist guest trống hoặc không tồn tại, không cần merge');
                // Xóa wishlistId từ localStorage và trả về thành công
                localStorage.removeItem('guestWishlistId');
                localStorage.removeItem(`wishlist_${guestWishlistId}`);
                return { data: { success: true, message: 'Wishlist trống, không cần merge' } };
            }
            
            // Tiếp tục với merge qua API
            return this.mergeGuestWishlistToUserWishlist(userId, guestWishlistId)
                .then(response => {
                    // Xóa wishlistId và dữ liệu của khách sau khi merge thành công
                    localStorage.removeItem('guestWishlistId');
                    localStorage.removeItem(`wishlist_${guestWishlistId}`);
                    eventBus.emit('wishlist-updated');
                    return response;
                })
                .catch(error => {
                    console.error('Lỗi khi merge wishlist qua API:', error);
                    
                    // Nếu API lỗi, thực hiện merge thủ công
                    if (localItems.length > 0) {
                        console.log('Thực hiện merge thủ công với', localItems.length, 'sản phẩm');
                        
                        // Merge từng sản phẩm vào wishlist người dùng
                        const addPromises = localItems.map(productId => 
                            this.addToUserWishlist(userId, productId).catch(e => {
                                console.log('Lỗi khi thêm sản phẩm vào wishlist:', e);
                                return null;
                            })
                        );
                        
                        return Promise.all(addPromises).then(() => {
                            // Xóa wishlist khách sau khi merge thủ công
                            localStorage.removeItem('guestWishlistId');
                            localStorage.removeItem(`wishlist_${guestWishlistId}`);
                            eventBus.emit('wishlist-updated');
                            
                            return { 
                                data: { 
                                    success: true, 
                                    message: 'Đã merge wishlist thủ công' 
                                } 
                            };
                        });
                    }
                    
                    // Nếu không có sản phẩm trong localStorage, bỏ qua
                    localStorage.removeItem('guestWishlistId');
                    return { 
                        data: { 
                            success: true, 
                            message: 'Không có sản phẩm để merge' 
                        } 
                    };
                });
        } catch (error) {
            console.error('Lỗi khi kiểm tra wishlist guest:', error);
            
            // Nếu có lỗi khi kiểm tra API nhưng vẫn có dữ liệu trong localStorage
            if (localItems.length > 0) {
                console.log('Thực hiện merge thủ công với', localItems.length, 'sản phẩm từ localStorage');
                
                const addPromises = localItems.map(productId => 
                    this.addToUserWishlist(userId, productId).catch(e => {
                        console.log('Lỗi khi thêm sản phẩm vào wishlist:', e);
                        return null;
                    })
                );
                
                return Promise.all(addPromises).then(() => {
                    localStorage.removeItem('guestWishlistId');
                    localStorage.removeItem(`wishlist_${guestWishlistId}`);
                    eventBus.emit('wishlist-updated');
                    
                    return { 
                        data: { 
                            success: true, 
                            message: 'Đã merge wishlist thủ công từ localStorage' 
                        } 
                    };
                });
            }
            
            // Xóa guestWishlistId để tránh lỗi lặp lại
            localStorage.removeItem('guestWishlistId');
            localStorage.removeItem(`wishlist_${guestWishlistId}`);
            
            // Trả về thành công mặc dù có lỗi
            return { 
                data: { 
                    success: true, 
                    message: 'Đã xóa guestWishlistId do lỗi' 
                } 
            };
        }
    },

}