<template>
  <div class="product-create-container">
    <div class="product-create-header">
      <h2 class="product-create-title">THÊM SẢN PHẨM</h2>
      <button class="close-button" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="product-create-content">
      <div class="left-column">
        <div class="image-preview-container">
          <img 
            :src="previewImage || 'https://via.placeholder.com/350x450?text=Thêm+ảnh+sản+phẩm'" 
            alt="Ảnh sản phẩm" 
            class="image-preview"
          />
        </div>
        
        <div class="upload-section">
          <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            style="display:none" 
            @change="handleFileSelected" 
          />
          <button class="upload-button" @click="$refs.fileInput.click()">
            <i class="fas fa-cloud-upload-alt"></i> Tải lên hình ảnh
          </button>
        </div>
      </div>
      
      <div class="right-column">
        <div class="form-group">
          <label>Tên sách <span class="required">*</span></label>
          <input 
            type="text" 
            v-model="book.title" 
            placeholder="Nhập tên sách" 
            class="form-input"
            :class="{ 'error': errors.title }"
          />
          <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
        </div>
        
        <div class="form-group">
          <label>Tác giả <span class="required">*</span></label>
          <input 
            type="text" 
            v-model="book.author" 
            placeholder="Nhập tên tác giả" 
            class="form-input"
            :class="{ 'error': errors.author }"
          />
          <div v-if="errors.author" class="error-message">{{ errors.author }}</div>
        </div>
        
        <div class="form-group">
          <label>Thể loại <span class="required">*</span></label>
          <div class="category-select">
            <select 
              v-model="selectedCategory" 
              class="form-input"
              :class="{ 'error': errors.category }"
            >
              <option value="" disabled>Chọn thể loại</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <i class="fas fa-chevron-down dropdown-icon"></i>
          </div>
          <div v-if="errors.category" class="error-message">{{ errors.category }}</div>
        </div>
        
        <div class="form-group">
          <label>Giá (VNĐ) <span class="required">*</span></label>
          <input 
            type="number" 
            v-model="book.price" 
            placeholder="Nhập giá sách" 
            class="form-input"
            :class="{ 'error': errors.price }"
            min="0"
          />
          <div v-if="errors.price" class="error-message">{{ errors.price }}</div>
        </div>
        
        <div class="form-group">
          <label>Mô tả <span class="required">*</span></label>
          <textarea 
            v-model="book.description" 
            placeholder="Nhập mô tả sách" 
            class="form-textarea"
            :class="{ 'error': errors.description }"
            rows="5"
          ></textarea>
          <div v-if="errors.description" class="error-message">{{ errors.description }}</div>
        </div>
        
        <div class="form-actions">
          <button class="submit-button" @click="submitForm" :disabled="loading">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i> {{ loading ? 'Đang lưu...' : 'Lưu sản phẩm' }}
          </button>
          <button class="cancel-button" @click="$emit('close')" :disabled="loading">
            <i class="fas fa-times"></i> Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookService from '@/services/BookService';
import eventBus from '@/eventBus.js';

export default {
  name: 'ProductCreate',
  data() {
    return {
      book: {
        title: '',
        author: '',
        description: '',
        price: 0,
        // Giá trị mặc định theo yêu cầu
        stock: 'Còn hàng',
        sold: 0,
        image: ""
      },
      selectedCategory: '',
      categories: [],
      previewImage: null,
      imageFile: null,
      errors: {
        title: '',
        author: '',
        price: '',
        description: '',
        category: ''
      },
      loading: false
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await BookService.getCategories();
        
        if (response.data && response.data.success) {
          // Xử lý các cấu trúc dữ liệu khác nhau
          if (Array.isArray(response.data.data)) {
            this.categories = response.data.data;
          } else if (response.data.data && Array.isArray(response.data.data.categories)) {
            this.categories = response.data.data.categories;
          } else {
            this.categories = response.data.categories || 
                             (response.data.data && response.data.data.categories) || 
                             [];
          }
          
          // Chuyển đổi dữ liệu danh mục thành mảng chuỗi đơn giản
          this.categories = this.categories.map(cat => {
            if (typeof cat === 'string') return cat;
            return cat.categoryName || cat.name || 'Danh mục không xác định';
          });
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        eventBus.emit('show-alert', {
          show: true,
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể tải danh mục sản phẩm',
          autoClose: true
        });
      }
    },
    
    handleFileSelected(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Kiểm tra file có phải ảnh không
      if (!file.type.match('image.*')) {
        eventBus.emit('show-alert', {
          show: true,
          type: 'error',
          title: 'Lỗi file',
          message: 'Vui lòng chọn file hình ảnh',
          autoClose: true
        });
        return;
      }
      
      this.imageFile = file;
      
      // Tạo preview ảnh
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    validateForm() {
      let isValid = true;
      this.errors = {
        title: '',
        author: '',
        price: '',
        description: '',
        category: ''
      };
      
      if (!this.book.title.trim()) {
        this.errors.title = 'Vui lòng nhập tên sách';
        isValid = false;
      }
      
      if (!this.book.author.trim()) {
        this.errors.author = 'Vui lòng nhập tên tác giả';
        isValid = false;
      }
      
      if (!this.book.price || this.book.price <= 0) {
        this.errors.price = 'Vui lòng nhập giá hợp lệ';
        isValid = false;
      }
      
      if (!this.book.description.trim()) {
        this.errors.description = 'Vui lòng nhập mô tả sách';
        isValid = false;
      }
      
      if (!this.selectedCategory) {
        this.errors.category = 'Vui lòng chọn thể loại';
        isValid = false;
      }
      
      return isValid;
    },
    
    async uploadImage() {
      if (!this.imageFile) {
        return null;
      }
      
      try {
        // Tạo formData để upload file
        const formData = new FormData();
        formData.append('image', this.imageFile);
        
        // Gọi API upload ảnh
        const response = await BookService.uploadImage(formData);
        
        // Trả về URL của ảnh hoặc mảng URL nếu nhiều ảnh
        return response.data.imageUrl || response.data.imageUrls[0];
      } catch (error) {
        console.error('Lỗi khi upload ảnh:', error);
        throw new Error('Không thể upload ảnh');
      }
    },
    
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }
      
      this.loading = true;
      
      try {
        let imageUrl = null;
        
        // Upload ảnh nếu có
        if (this.imageFile) {
          imageUrl = await this.uploadImage();
        }
        
        // Chuẩn bị dữ liệu sách
        const bookData = {
          title: this.book.title,
          author: this.book.author,
          category: this.selectedCategory,
          description: this.book.description,
          price: parseFloat(this.book.price),
          stock: 'Còn hàng', // Giá trị mặc định
          sold: 0,   // Giá trị mặc định
          image: imageUrl ? `['${imageUrl}']` : "" // Định dạng image theo yêu cầu API
        };
        
        console.log('Gửi dữ liệu sách mới:', bookData);
        
        // Gọi API tạo sách mới với access token
        const response = await BookService.createBook(bookData);
        
        console.log('Kết quả API tạo sách:', response.data);
        
        // Thông báo tạo sách thành công
        eventBus.emit('show-alert', {
          show: true,
          type: 'success',
          title: 'Thành công',
          message: 'Thêm sách mới thành công',
          autoClose: true
        });
        
        // Thông báo cho component cha về việc tạo sách thành công
        this.$emit('book-created');
      } catch (error) {
        console.error('Lỗi khi tạo sách mới:', error);
        
        eventBus.emit('show-alert', {
          show: true,
          type: 'error',
          title: 'Lỗi',
          message: error.response?.data?.message || 'Không thể tạo sách mới. Vui lòng thử lại sau.',
          autoClose: true
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.product-create-container {
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 25px;
  width: 100%;
  box-sizing: border-box;
}

.product-create-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 2px solid #4d2900;
  padding-bottom: 15px;
}

.product-create-title {
  color: #4d2900;
  font-size: 24px;
  font-weight: 900;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  color: #4d2900;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: rgba(77, 41, 0, 0.1);
}

.product-create-content {
  display: flex;
  gap: 30px;
}

.left-column {
  width: 35%;
}

.right-column {
  width: 65%;
}

.image-preview-container {
  background-color: #fff;
  border: 2px dashed #ccc;
  border-radius: 5px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 15px;
}

.image-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.upload-section {
  display: flex;
  justify-content: center;
}

.upload-button {
  background-color: #4d2900;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;
}

.upload-button:hover {
  background-color: #6e3d00;
}

.required {
  color: #e74c3c;
  margin-left: 2px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #4d2900;
  outline: none;
}

.form-input.error {
  border-color: #e74c3c;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  resize: vertical;
  min-height: 120px;
  box-sizing: border-box;
}

.form-textarea:focus {
  border-color: #4d2900;
  outline: none;
}

.form-textarea.error {
  border-color: #e74c3c;
}

.category-select {
  position: relative;
}

.dropdown-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.submit-button {
  background-color: #4d2900;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 25px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: #6e3d00;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 12px 25px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: #e5e5e5;
}

@media (max-width: 991px) {
  .product-create-content {
    flex-direction: column;
  }
  
  .left-column, .right-column {
    width: 100%;
  }
}
</style>