<template>
  <main class="product-edit-page">
    <div class="container">
      <ProductEditHeader title="Sửa sản phẩm" @close="$emit('close')" />

      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <span>Đang tải thông tin sách...</span>
      </div>

      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="$emit('close')" class="back-button">Đóng</button>
      </div>

      <div v-else class="content-wrapper">
        <ProductImageSection
          :mainImage="getMainImage()"
          :thumbnails="getThumbnails()"
          @upload="handleImageUpload"
        />

        <ProductDetailsForm
          :productName="book.title"
          :authorName="book.author"
          :category="book.category"
          :description="book.description"
          :price="book.price"
          @save="handleSaveChanges"
        />

        <ProductReviewsSection
          :rating="book.rating || 4.5"
          :reviewCount="book.reviewCount || 0"
          :ratingDistribution="ratingDistribution"
          :reviews="book.reviews || []"
        />
      </div>
    </div>
  </main>
</template>

<script>
import ProductEditHeader from "./ProductEditHeader.vue";
import ProductImageSection from "./ProductImageSection.vue";
import ProductDetailsForm from "./ProductDetailsForm.vue";
import ProductReviewsSection from "./ProductReviewsSection.vue";
import BookService from "@/services/BookService";
import eventBus from "@/eventBus";

export default {
  name: "ProductEditPage",
  components: {
    ProductEditHeader,
    ProductImageSection,
    ProductDetailsForm,
    ProductReviewsSection,
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
      ratingDistribution: [
        { stars: 5, count: 0 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ],
    };
  },
  emits: ["close", "book-updated"],
  methods: {
    getMainImage() {
      if (!this.book.image)
        return "https://via.placeholder.com/350x450?text=No+Image";

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
            : "https://via.placeholder.com/350x450?text=No+Image";
        } catch (e) {
          console.error("Lỗi parse chuỗi JSON hình ảnh:", e);
          return this.book.image;
        }
      }

      return this.book.image;
    },

    getThumbnails() {
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

    handleImageUpload(images) {
      console.log("Upload images:", images);
      // Xử lý upload hình ảnh
    },

    async handleSaveChanges(formData) {
      this.loading = true;

      try {
        const updatedData = {
          title: formData.productName,
          author: formData.authorName,
          category: formData.category,
          description: formData.description,
          price: parseFloat(formData.price),
          // Giữ nguyên các trường khác như image
          image: this.book.image,
        };

        await BookService.updateBook(this.book._id, updatedData);

        eventBus.emit("show-alert", {
          show: true,
          type: "success",
          title: "Thành công",
          message: "Cập nhật sách thành công",
          autoClose: true,
        });

        this.$emit("book-updated");
      } catch (error) {
        console.error("Lỗi khi cập nhật sách:", error);

        this.error = "Không thể cập nhật sách. Vui lòng thử lại sau.";

        eventBus.emit("show-alert", {
          show: true,
          type: "error",
          title: "Lỗi",
          message: "Không thể cập nhật sách. Vui lòng thử lại sau.",
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
.product-edit-page {
  width: 100%;
  background-color: #fffdfc;
  padding: 20px;
}

.container {
  width: 100%;
  margin: 0 auto;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.loading-container,
.error-container {
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.back-button {
  background-color: #4d2900;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-family: "Montserrat", sans-serif;
}

@media (max-width: 991px) {
  .content-wrapper {
    gap: 20px;
  }
}
</style>
