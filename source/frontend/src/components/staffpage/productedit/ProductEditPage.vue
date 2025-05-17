<!-- filepath: d:\Workspace\Software-engineering\project\BookVerse\source\frontend\src\components\staffpage\productedit\ProductEditPage.vue -->
<template>
  <div class="product-create-container">
    <!-- Header giống ProductCreate -->
    <div class="product-create-header">
      <h2 class="product-create-title">CHỈNH SỬA SẢN PHẨM</h2>
      <button class="close-button" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <span>Đang tải thông tin sách...</span>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="$emit('close')" class="back-button">Đóng</button>
    </div>

    <template v-else>
      <!-- Layout 2 cột giống ProductCreate -->
      <div class="product-create-content">
        <!-- Cột trái: Hiển thị ảnh và upload -->
        <div class="left-column">
          <!-- Hiển thị ảnh chính -->
          <div class="image-preview-container">
            <img
              :src="
                getMainImage() ||
                'https://via.placeholder.com/350x450?text=Thêm+ảnh+sản+phẩm'
              "
              alt="Ảnh sản phẩm"
              class="image-preview"
            />
          </div>

          <!-- Phần hiển thị thumbnail các ảnh -->
          <div class="image-thumbnails" v-if="getThumbnails().length > 0">
            <div
              v-for="(url, index) in getThumbnails()"
              :key="index"
              class="thumbnail-item"
              :class="{ active: currentMainImageIndex === index }"
              @click="setMainImage(index)"
            >
              <img :src="url" alt="Thumbnail" class="thumbnail-img" />
              <button class="remove-image-btn" @click.stop="removeImage(index)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Phần tải lên hình ảnh -->
          <div class="upload-section">
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              style="display: none"
              @change="handleFileSelected"
              multiple
            />
            <button class="upload-button" @click="$refs.fileInput.click()">
              <i class="fas fa-cloud-upload-alt"></i> Tải lên hình ảnh
            </button>
          </div>

          <!-- Phần thêm URL hình ảnh -->
          <div class="image-url-input">
            <div class="url-input-wrapper">
              <input
                type="text"
                v-model="newImageUrl"
                placeholder="Nhập URL hình ảnh"
                class="form-input"
                @keyup.enter="addImageUrl"
              />
              <button class="add-url-button" @click="addImageUrl">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Cột phải: Form thông tin sản phẩm -->
        <div class="right-column">
          <div class="form-group">
            <label class="label_input_create_product"
              >Tên sách <span class="required">*</span></label
            >
            <input
              type="text"
              v-model="editedBook.title"
              placeholder="Nhập tên sách"
              class="form-input"
              :class="{ error: errors.title }"
            />
            <div v-if="errors.title" class="error-message">
              {{ errors.title }}
            </div>
          </div>

          <div class="form-group">
            <label class="label_input_create_product"
              >Tác giả <span class="required">*</span></label
            >
            <input
              type="text"
              v-model="editedBook.author"
              placeholder="Nhập tên tác giả"
              class="form-input"
              :class="{ error: errors.author }"
            />
            <div v-if="errors.author" class="error-message">
              {{ errors.author }}
            </div>
          </div>

          <div class="form-group">
            <label class="label_input_create_product"
              >Thể loại <span class="required">*</span></label
            >
            <div class="category-select">
              <select
                v-model="editedBook.category"
                class="form-input form_category"
                :class="{ error: errors.category }"
              >
                <option value="" disabled>Chọn thể loại</option>
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>
            <div v-if="errors.category" class="error-message">
              {{ errors.category }}
            </div>
          </div>

          <div class="form-group">
            <label class="label_input_create_product"
              >Giá (VNĐ) <span class="required">*</span></label
            >
            <input
              type="number"
              v-model="editedBook.price"
              placeholder="Nhập giá sách"
              class="form-input"
              :class="{ error: errors.price }"
              min="0"
            />
            <div v-if="errors.price" class="error-message">
              {{ errors.price }}
            </div>
          </div>

          <div class="form-group">
            <label class="label_input_create_product"
              >Mô tả <span class="required">*</span></label
            >
            <textarea
              v-model="editedBook.description"
              placeholder="Nhập mô tả sách"
              class="form-textarea form_category"
              :class="{ error: errors.description }"
              rows="5"
            ></textarea>
            <div v-if="errors.description" class="error-message">
              {{ errors.description }}
            </div>
          </div>

          <div class="form-actions">
            <button
              class="submit-button"
              @click="handleSaveChanges"
              :disabled="loading"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-save"></i>
              {{ loading ? "Đang lưu..." : "Cập nhật sản phẩm" }}
            </button>
            <button
              class="cancel-button"
              @click="$emit('close')"
              :disabled="loading"
            >
              <i class="fas fa-times"></i> Hủy
            </button>
          </div>
        </div>
      </div>

      <!-- Phần đánh giá - sử dụng RatingSection từ ProductDetail -->
      <div class="reviews-section">
        <h2 class="rating-title">Đánh giá sản phẩm</h2>
        
        <!-- Hiển thị tóm tắt đánh giá -->
        <div class="rating-summary-row">
          <div class="rating-summary-box">
            <div class="average-rating-container">
              <h3 class="average-rating">{{ averageRating.toFixed(1) }}</h3>
              <div class="star-total">
                <i v-for="index in 5" 
                  :key="`total-star-${index}`" 
                  :class="[
                    index <= Math.floor(averageRating) ? 'fas fa-star filled-star' : 'far fa-star empty-star'
                  ]"
                ></i>
              </div>
              <p class="total-reviews">{{ bookReviews.length }} đánh giá</p>
            </div>
            
            <div class="ratings-breakdown">
              <div class="rating-row" v-for="star in 5" :key="`star-${star}`">
                <div class="star-label-container">
                  <span class="star-label">{{ star }}</span>
                  <div class="progress-container">
                    <div 
                      class="progress-bar" 
                      :style="`width: ${getPercentage(star)}%`">
                    </div>
                  </div>
                </div>
                <span class="count-label">{{ getStarCount(star) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sử dụng ReviewList từ ProductDetail -->
        <ReviewList 
          :bookId="book._id" 
          class="edit-review-list" 
        />
      </div>
    </template>
  </div>
</template>

<script>
import BookService from "@/services/BookService";
import ReviewService from "@/services/ReviewService";
import ReviewList from "@/components/ProductDetail/ReviewList.vue";
import eventBus from "@/eventBus";

export default {
  name: "ProductEditPage",
  components: {
    ReviewList
  },
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      error: null,
      editedBook: {
        title: "",
        author: "",
        description: "",
        category: "",
        price: 0,
      },
      categories: [],
      imageUrls: [],
      newImageUrl: "",
      currentMainImageIndex: 0,
      uploadedFiles: [],
      errors: {
        title: "",
        author: "",
        price: "",
        description: "",
        category: "",
        image: "",
      },
      bookReviews: [],
      averageRating: 0,
      reviewsLoading: false
    };
  },
  created() {
    this.initializeForm();
    this.fetchCategories();
    this.fetchBookReviews();
  },
  emits: ["close", "book-updated"],
  methods: {
    initializeForm() {
      // Khởi tạo form với dữ liệu sách
      this.editedBook = {
        title: this.book.title || "",
        author: this.book.author || "",
        description: this.book.description || "",
        category: this.book.category || "",
        price: this.book.price || 0,
      };

      // Xử lý hình ảnh
      this.imageUrls = this.getThumbnails();
      
      // Khởi tạo giá trị đánh giá
      this.averageRating = this.book.rating || 0;
    },

    async fetchCategories() {
      try {
        const response = await BookService.getCategories();
        if (response.data && response.data.success) {
          if (Array.isArray(response.data.data)) {
            this.categories = response.data.data;
          } else if (
            response.data.data &&
            Array.isArray(response.data.data.categories)
          ) {
            this.categories = response.data.data.categories;
          } else {
            this.categories =
              response.data.categories ||
              (response.data.data && response.data.data.categories) ||
              [];
          }

          this.categories = this.categories.map((cat) => {
            if (typeof cat === "string") return cat;
            return cat.categoryName || cat.name || "Danh mục không xác định";
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    },
    
    // Fetch reviews riêng để có thông tin chính xác
    async fetchBookReviews() {
      if (!this.book._id) return;
      
      this.reviewsLoading = true;
      try {
        const response = await ReviewService.getAllReviews(this.book._id);
        
        // Truy cập đúng vào dữ liệu reviews
        let reviews = [];
        if (response.data && response.data.success && response.data.data && response.data.data.reviews) {
          reviews = response.data.data.reviews;
        } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
          reviews = response.data.data;
        }
        
        this.bookReviews = reviews;
        
        // Tính rating trung bình từ reviews thực tế
        if (reviews.length > 0) {
          const sum = reviews.reduce((total, review) => total + review.rating, 0);
          this.averageRating = sum / reviews.length;
        }
      } catch (error) {
        console.error('Lỗi khi lấy đánh giá sách:', error);
      } finally {
        this.reviewsLoading = false;
      }
    },

    getMainImage() {
      if (this.imageUrls.length > 0) {
        return this.imageUrls[this.currentMainImageIndex];
      }

      if (!this.book.image) return null;
      
      // Xử lý trường hợp image là chuỗi JSON
      if (
        typeof this.book.image === "string" &&
        this.book.image.startsWith("[") &&
        this.book.image.endsWith("]")
      ) {
        try {
          const jsonStr = this.book.image.replace(/'/g, '"');
          const images = JSON.parse(jsonStr);
          return Array.isArray(images) && images.length > 0
            ? images[0]
            : null;
        } catch (e) {
          console.error("Lỗi parse chuỗi JSON hình ảnh:", e);
          return this.book.image;
        }
      }
      
      return this.book.image;
    },

    getThumbnails() {
      if (this.imageUrls.length > 0) {
        return this.imageUrls;
      }

      if (!this.book.image) return [];
      
      // Xử lý trường hợp image là chuỗi JSON
      if (
        typeof this.book.image === "string" &&
        this.book.image.startsWith("[") &&
        this.book.image.endsWith("]")
      ) {
        try {
          const jsonStr = this.book.image.replace(/'/g, '"');
          const images = JSON.parse(jsonStr);
          return Array.isArray(images) ? images : [];
        } catch (e) {
          console.error("Lỗi parse chuỗi JSON hình ảnh:", e);
          return [this.book.image];
        }
      }
      
      return [this.book.image];
    },

    setMainImage(index) {
      this.currentMainImageIndex = index;
    },

    removeImage(index) {
      this.imageUrls.splice(index, 1);
      if (this.currentMainImageIndex >= this.imageUrls.length) {
        this.currentMainImageIndex = Math.max(0, this.imageUrls.length - 1);
      }
    },

    addImageUrl() {
      if (!this.newImageUrl.trim()) {
        return;
      }

      let url = this.newImageUrl.trim();

      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      try {
        new URL(url);
        if (!this.imageUrls.includes(url)) {
          this.imageUrls.push(url);
        }
        this.newImageUrl = "";
      } catch (e) {
        eventBus.emit("show-alert", {
          show: true,
          type: "error",
          title: "URL không hợp lệ",
          message: "Vui lòng nhập URL hình ảnh hợp lệ",
          autoClose: true,
        });
      }
    },

    handleFileSelected(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match("image.*")) {
          eventBus.emit("show-alert", {
            show: true,
            type: "error",
            title: "Lỗi file",
            message: "Vui lòng chỉ chọn file hình ảnh",
            autoClose: true,
          });
          continue;
        }

        this.uploadedFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }

      event.target.value = "";
    },
    
    // Methods để hiển thị phân phối đánh giá
    getStarCount(star) {
      return this.bookReviews.filter(review => review.rating === star).length;
    },
    
    getPercentage(star) {
      if (this.bookReviews.length === 0) return 0;
      const count = this.getStarCount(star);
      return (count / this.bookReviews.length) * 100;
    },

    validateForm() {
      let isValid = true;
      this.errors = {
        title: "",
        author: "",
        price: "",
        description: "",
        category: "",
        image: "",
      };

      if (!this.editedBook.title.trim()) {
        this.errors.title = "Vui lòng nhập tên sách";
        isValid = false;
      }

      if (!this.editedBook.author.trim()) {
        this.errors.author = "Vui lòng nhập tên tác giả";
        isValid = false;
      }

      if (!this.editedBook.price || this.editedBook.price <= 0) {
        this.errors.price = "Vui lòng nhập giá hợp lệ";
        isValid = false;
      }

      if (!this.editedBook.description.trim()) {
        this.errors.description = "Vui lòng nhập mô tả sách";
        isValid = false;
      }

      if (!this.editedBook.category) {
        this.errors.category = "Vui lòng chọn thể loại";
        isValid = false;
      }

      if (this.imageUrls.length === 0) {
        this.errors.image = "Vui lòng thêm ít nhất một hình ảnh";
        eventBus.emit("show-alert", {
          show: true,
          type: "error",
          title: "Thiếu hình ảnh",
          message: "Vui lòng thêm ít nhất một hình ảnh cho sản phẩm",
          autoClose: true,
        });
        isValid = false;
      }

      return isValid;
    },

    async uploadImages() {
      if (this.uploadedFiles.length === 0) {
        return [];
      }

      try {
        const uploadedUrls = [];
        for (const file of this.uploadedFiles) {
          const formData = new FormData();
          formData.append("image", file);
          const response = await BookService.uploadImage(formData);
          const imageUrl = response.data.imageUrl || response.data.imageUrls[0];
          if (imageUrl) {
            uploadedUrls.push(imageUrl);
          }
        }
        return uploadedUrls;
      } catch (error) {
        console.error("Lỗi khi upload ảnh:", error);
        throw new Error("Không thể upload một số hình ảnh");
      }
    },

    getExternalUrls() {
      return this.imageUrls.filter((url) => !url.startsWith("data:"));
    },

    async handleSaveChanges() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;

      try {
        // Upload ảnh mới nếu có
        const uploadedUrls = await this.uploadImages();
        const externalUrls = this.getExternalUrls();
        const allImageUrls = [...uploadedUrls, ...externalUrls];

        // Chuẩn bị dữ liệu cập nhật
        const updatedData = {
          title: this.editedBook.title,
          author: this.editedBook.author,
          category: this.editedBook.category,
          description: this.editedBook.description,
          price: parseFloat(this.editedBook.price),
          image:
            allImageUrls.length > 0
              ? `[${allImageUrls.map((url) => `'${url}'`).join(", ")}]`
              : this.book.image,
        };

        // Gọi API cập nhật sách
        await BookService.updateBook(this.book._id, updatedData);

        // Thông báo thành công
        eventBus.emit("show-alert", {
          show: true,
          type: "success",
          title: "Thành công",
          message: "Cập nhật sách thành công",
          autoClose: true,
        });

        // Thông báo cho component cha
        this.$emit("book-updated");
      } catch (error) {
        console.error("Lỗi khi cập nhật sách:", error);
        eventBus.emit("show-alert", {
          show: true,
          type: "error",
          title: "Lỗi",
          message:
            error.response?.data?.message ||
            "Không thể cập nhật sách. Vui lòng thử lại sau.",
          autoClose: true,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Giữ nguyên CSS của ProductCreate */
.product-create-container {
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 25px;
  width: 100%;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
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
  font-family: "Montserrat", sans-serif;
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
  margin-bottom: 40px;
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

.image-thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
  max-height: 100px;
  overflow-y: auto;
}

.thumbnail-item {
  position: relative;
  width: 60px;
  height: 60px;
  border: 2px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.thumbnail-item.active {
  border-color: #4d2900;
  transform: scale(1.05);
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.thumbnail-item:hover .remove-image-btn {
  opacity: 1;
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

.image-url-input {
  margin-top: 15px;
}

.url-input-wrapper {
  display: flex;
  gap: 10px;
}

.add-url-button {
  background-color: #4d2900;
  color: white;
  border: none;
  border-radius: 5px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-url-button:hover {
  background-color: #6e3d00;
}

.form-group {
  margin-bottom: 20px;
}

.label_input_create_product {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8px;
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

.form_category.form-input,
.form_category.form-textarea {
  padding-right: 40px;
  background-color: #ccc9c9;
  color: #4d2900;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
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

.required {
  color: #e74c3c;
  margin-left: 2px;
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

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4d2900;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.back-button {
  background-color: #4d2900;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-family: 'Montserrat', sans-serif;
}

/* CSS cho phần đánh giá */
.reviews-section {
  margin-top: 40px;
  border-top: 2px solid #eee;
  padding-top: 20px;
  width: 100%; /* Đảm bảo sử dụng chiều rộng đầy đủ */
}

.rating-title {
  color: #4D2900;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  width: 100%;
}

.rating-summary-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 30px;
  width: 100%; /* Đảm bảo sử dụng chiều rộng đầy đủ */
}

.rating-summary-box {
  display: flex;
  gap: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  width: 100%; /* Chiếm toàn bộ chiều rộng */
  max-width: none; /* Xóa giới hạn chiều rộng */
}

.average-rating-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 30px;
  border-right: 1px solid #eee;
}

.average-rating {
  color: #2E2E2E;
  font-size: 40px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.star-total {
  display: flex;
  margin-top: 10px;
  gap: 5px;
}

.filled-star {
  color: #FFD700;
  font-size: 20px;
}

.empty-star {
  color: #D3D3D3;
  font-size: 20px;
}

.total-reviews {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  text-align: center;
}

.ratings-breakdown {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.rating-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 15px;
}

.star-label-container {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.star-label {
  min-width: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.progress-container {
  flex: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #FFD700;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.count-label {
  font-size: 14px;
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

.edit-review-list {
  max-width: 100%;
  margin-top: 20px;
}

@media (max-width: 991px) {
  .product-create-content {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    width: 100%;
  }
  
  .rating-summary-box {
    flex-direction: column;
    gap: 20px;
  }
  
  .average-rating-container {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 20px;
  }
}

.edit-review-list {
  max-width: 100% !important;
  width: 100% !important;
  margin: 20px 0 !important; /* Bỏ auto margins */
}

.edit-review-list :deep(.rating-section) {
  width: 100% !important; 
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

.edit-review-list :deep(.reviews-list) {
  width: 100% !important;
  max-width: 100% !important;
}

.edit-review-list :deep(.review-item) {
  width: 100%;
  box-sizing: border-box;
  max-width: none;
}

/* Đảm bảo responsive cho rating summary */
@media (max-width: 991px) {
  .rating-summary-box {
    flex-direction: column;
    gap: 20px;
  }
  
  .average-rating-container {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 20px;
  }
}
</style>