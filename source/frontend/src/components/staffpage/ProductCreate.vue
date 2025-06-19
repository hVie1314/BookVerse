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
        <!-- Hiển thị ảnh chính -->
        <div class="image-preview-container">
          <img
            :src="
              currentMainImage ||
              'https://via.placeholder.com/350x450?text=Thêm+ảnh+sản+phẩm'
            "
            alt="Ảnh sản phẩm"
            class="image-preview"
          />
        </div>

        <!-- Phần hiển thị thumbnail các ảnh -->
        <div class="image-thumbnails" v-if="imageUrls.length > 0">
          <div
            v-for="(url, index) in imageUrls"
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

        <!-- Phần tải lên hình ảnh
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
        </div> -->

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

      <div class="right-column">
        <!-- Các trường nhập liệu khác giữ nguyên -->
        <div class="form-group">
          <label class="label_input_create_product"
            >Tên sách <span class="required">*</span></label
          >
          <input
            type="text"
            v-model="book.title"
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
            v-model="book.author"
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
              v-model="selectedCategory"
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
          <label class="label_input_create_product">
            Giá (VNĐ) <span class="required">*</span>
          </label>
          <input
            type="number"
            class="form-input"
            v-model.number="book.price"
            :class="{ error: errors.price }"
            placeholder="Nhập giá sách"
            min="0"
          />
          <div v-if="errors.price" class="error-message">
            {{ errors.price }}
          </div>
        </div>

        <div class="form-group">
          <label class="label_input_create_product">
            Số lượng tồn kho
          </label>
          <input
            type="number"
            class="form-input"
            v-model.number="book.stock"
            min="0"
            placeholder="Nhập số lượng tồn kho"
          />
        </div>

        <div class="form-group">
          <label class="label_input_create_product">
            Số lượng đã bán
          </label>
          <input
            type="number"
            class="form-input"
            v-model.number="book.sold"
            readonly
            disabled
            title="Số lượng đã bán mặc định là 0 khi tạo sản phẩm mới"
          />
          <div class="note-message">
            <i class="fas fa-info-circle"></i>
            Số lượng đã bán mặc định là 0 khi tạo sản phẩm mới
          </div>
        </div>

        <div class="form-group">
          <label class="label_input_create_product">
            Mô tả <span class="required">*</span>
          </label>
          <textarea
            v-model="book.description"
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
          <button class="submit-button" @click="submitForm" :disabled="loading">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ loading ? "Đang lưu..." : "Lưu sản phẩm" }}
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
  </div>
</template>

<script>
import BookService from "@/services/BookService";
import eventBus from "@/eventBus.js";
import { useToast } from "vue-toastification";

export default {
  name: "ProductCreate",
  data() {
    return {
      book: {
        title: "",
        author: "",
        description: "",
        price: 0,
        // Giá trị mặc định theo yêu cầu
        stock: 0,
        sold: 0,
        image: "",
      },
      selectedCategory: "",
      categories: [],
      previewImage: null,
      imageFile: null,
      uploadedFiles: [], // Mảng chứa các file đã upload
      imageUrls: [], // Mảng chứa các URL của hình ảnh
      newImageUrl: "", // URL hình ảnh mới nhập
      currentMainImageIndex: 0,
      errors: {
        title: "",
        author: "",
        price: "",
        description: "",
        category: "",
        image: "",
      },
      loading: false,
    };
  },
  computed: {
    // Lấy ảnh chính hiển thị (ảnh đầu tiên hoặc ảnh được chọn)
    currentMainImage() {
      if (this.imageUrls.length > 0) {
        return this.imageUrls[this.currentMainImageIndex];
      }
      return this.previewImage;
    },
  },
  setup() {
    const toast = useToast();
    return { toast };
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

          // Chuyển đổi dữ liệu danh mục thành mảng chuỗi đơn giản
          this.categories = this.categories.map((cat) => {
            if (typeof cat === "string") return cat;
            return cat.categoryName || cat.name || "Danh mục không xác định";
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        eventBus.emit("show-alert", {
          show: true,
          type: "error",
          title: "Lỗi",
          message: "Không thể tải danh mục sản phẩm",
          autoClose: true,
        });
      }
    },

    // Đặt ảnh chính hiển thị theo index
    setMainImage(index) {
      this.currentMainImageIndex = index;
    },

    // Xóa ảnh khỏi danh sách
    removeImage(index) {
      this.imageUrls.splice(index, 1);
      if (this.currentMainImageIndex >= this.imageUrls.length) {
        this.currentMainImageIndex = Math.max(0, this.imageUrls.length - 1);
      }
    },

    // Thêm URL ảnh mới vào danh sách
    addImageUrl() {
      if (!this.newImageUrl.trim()) {
        return;
      }

      // Thêm log để debug
      console.log("Thêm URL hình ảnh:", this.newImageUrl);

      // Kiểm tra URL hợp lệ
      let url = this.newImageUrl.trim();

      // Thêm protocol nếu URL không có
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      try {
        new URL(url);

        // Thêm vào danh sách nếu chưa có
        if (!this.imageUrls.includes(url)) {
          this.imageUrls.push(url);
          console.log(
            "Đã thêm URL vào danh sách, total:",
            this.imageUrls.length
          );
        }

        // Xóa trường nhập liệu
        this.newImageUrl = "";
      } catch (e) {
        console.error("URL không hợp lệ:", e);
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
      console.log("Số file đã chọn:", files?.length || 0);

      if (!files || files.length === 0) return;

      // Xử lý từng file được chọn
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log("Xử lý file:", file.name, file.type);

        // Kiểm tra file có phải ảnh không
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

        // Thêm file vào danh sách để upload
        this.uploadedFiles.push(file);

        // Tạo preview ảnh
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          this.imageUrls.push(imageUrl);
          console.log(
            "Đã thêm file preview vào danh sách, total:",
            this.imageUrls.length
          );

          // Nếu đây là ảnh đầu tiên, đặt làm previewImage để tương thích với code cũ
          if (this.uploadedFiles.length === 1 && !this.previewImage) {
            this.previewImage = imageUrl;
            this.imageFile = file;
          }
        };
        reader.readAsDataURL(file);
      }

      // Reset input file để có thể chọn cùng một file nhiều lần
      event.target.value = "";
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

      if (!this.book.title.trim()) {
        this.errors.title = "Vui lòng nhập tên sách";
        isValid = false;
      }

      if (!this.book.author.trim()) {
        this.errors.author = "Vui lòng nhập tên tác giả";
        isValid = false;
      }

      if (!this.book.price || this.book.price <= 0) {
        this.errors.price = "Vui lòng nhập giá hợp lệ";
        isValid = false;
      }

      if (!this.book.description.trim()) {
        this.errors.description = "Vui lòng nhập mô tả sách";
        isValid = false;
      }

      if (!this.selectedCategory) {
        this.errors.category = "Vui lòng chọn thể loại";
        isValid = false;
      }

      return isValid;
    },

    async uploadImages() {
      if (this.uploadedFiles.length === 0) {
        return [];
      }

      try {
        // Upload từng file một và thu thập URL
        const uploadedUrls = [];

        for (const file of this.uploadedFiles) {
          // Tạo formData để upload file
          const formData = new FormData();
          formData.append("image", file);

          // Gọi API upload ảnh
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

    // Lọc các URL base64 ra khỏi mảng imageUrls
    getExternalUrls() {
      return this.imageUrls.filter((url) => !url.startsWith("data:"));
    },

    // Sửa phương thức submitForm()
  // Tìm và thay thế phương thức submitForm với phiên bản đã sửa sau:
async submitForm() {
  if (!this.validateForm()) {
    return;
  }

  this.loading = true;

  try {
    // 1. Upload các file ảnh đã chọn
    const uploadedUrls = await this.uploadImages();

    // 2. Kết hợp URL đã upload và URL bên ngoài
    const externalUrls = this.getExternalUrls();
    console.log("External URLs:", externalUrls);
    const allImageUrls = [...uploadedUrls, ...externalUrls];
    console.log("Tất cả URLs:", allImageUrls);

    // 3. Chuẩn bị dữ liệu sách
    const bookData = {
      title: this.book.title,
      author: this.book.author,
      category: this.selectedCategory,
      description: this.book.description,
      price: parseFloat(this.book.price),
      stock: this.book.stock || 0, // Sử dụng giá trị mặc định nếu không có
      sold: 0,
      image:
        allImageUrls.length > 0
          ? `[${allImageUrls.map((url) => `'${url}'`).join(", ")}]`
          : "",
    };

    console.log("Chuỗi image cuối cùng:", bookData.image);
    console.log("Gửi dữ liệu sách mới:", bookData);

    // 4. Gọi API tạo sách mới với access token
    const response = await BookService.createBook(bookData);

    // Kiểm tra response trước khi truy cập thuộc tính
    console.log("Kết quả API tạo sách:", response.data);

    // 5. Không kiểm tra response.data.success nữa mà xử lý trực tiếp
    // Nếu đến được đây nghĩa là API call thành công và sách đã được tạo
    this.toast.success("Tạo sách thành công!", {
      timeout: 1500,
      closeOnClick: true,
    });

    // 6. Thông báo cho component cha về việc tạo sách thành công
    this.$emit("book-created");
    
    // 7. Reset form
    this.resetForm();
  } catch (error) {
    console.error("Lỗi khi tạo sách mới:", error);

    eventBus.emit("show-alert", {
      show: true,
      type: "error",
      title: "Lỗi",
      message:
        error.response?.data?.message ||
        "Không thể tạo sách mới. Vui lòng thử lại sau.",
      autoClose: true,
    });
  } finally {
    this.loading = false;
  }
},

// Thêm phương thức resetForm để xóa form sau khi thêm sách thành công
resetForm() {
  this.book = {
    title: "",
    author: "",
    description: "",
    price: 0,
    stock: 0,
    sold: 0,
    image: "",
  };
  this.selectedCategory = "";
  this.imageUrls = [];
  this.uploadedFiles = [];
  this.newImageUrl = "";
  this.previewImage = null;
  this.currentMainImageIndex = 0;
  this.errors = {
    title: "",
    author: "",
    price: "",
    description: "",
    category: "",
    image: "",
  };
}
  },
};
</script>

<style scoped>
/* Thêm vào CSS để ẩn icon mặc định của select */
.form_category.form-input {
  /* Các thuộc tính CSS hiện tại */
  padding-right: 40px;
  background-color: #ccc9c9;
  color: #4d2900;

  /* Thêm thuộc tính này để ẩn icon mặc định */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.form_category.form-textarea {
  padding-right: 40px; /* Thêm khoảng cách bên phải cho textarea */
  background-color: #ccc9c9;
  color: #4d2900;
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

.label_input_create_product {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.product-create-container {
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 25px;
  width: 100%;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif; /* Thêm font-family chung */
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

.form-input,

.form-textarea {
  font-family: "Montserrat", sans-serif; /* Thêm font-family cho form */
}

.note-message {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.note-message i {
  color: #4d2900;
}

input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
  color: #999;
  border-color: #ddd;
}

@media (max-width: 991px) {
  .product-create-content {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    width: 100%;
  }
}
</style>