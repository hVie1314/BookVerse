<template>
  <section class="product-form">
    <div class="form-fields">
      <div class="form-group">
        <label for="product-name" class="form-label">Tên sản phẩm</label>
        <div class="input-wrapper">
          <input
            type="text"
            id="product-name"
            v-model="formData.productName"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="author-name" class="form-label">Tên tác giả</label>
        <div class="input-wrapper">
          <input
            type="text"
            id="author-name"
            v-model="formData.authorName"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="category" class="form-label">Thể loại</label>
        <div class="select-wrapper">
          <div class="category-text">{{ formData.category }}</div>
          <div class="dropdown-icon">
            <svg width="24" height="24" viewBox="0 0 43 41" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 17L21.5 24L28 17" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Mô tả</label>
        <div class="textarea-wrapper">
          <textarea
            id="description"
            v-model="formData.description"
            class="form-textarea"
          ></textarea>
        </div>
      </div>

      <div class="form-group">
        <label for="price" class="form-label">Giá bán</label>
        <div class="input-wrapper">
          <input
            type="text"
            id="price"
            v-model="formData.price"
            class="form-input"
          />
        </div>
      </div>
    </div>

    <button class="save-button" @click="saveChanges">
      <svg width="24" height="24" viewBox="0 0 31 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M24.1963 14C24.9437 14 25.6605 14.3065 26.1891 14.8521L30.1746 18.9661C30.7031 19.5117 31 20.2516 31 21.0232V41.6364C31 44.0464 29.1074 46 26.7727 46H4.22727C1.89264 46 0 44.0464 0 41.6364V18.3636C0 15.9537 1.89264 14 4.22727 14H24.1963ZM4.22727 16.9091C3.44909 16.9091 2.81818 17.5603 2.81818 18.3636V41.6364C2.81818 42.4397 3.44909 43.0909 4.22727 43.0909H5.63636V34.3636C5.63636 31.9536 7.529 30 9.86364 30H21.1364C23.4711 30 25.3636 31.9536 25.3636 34.3636V43.0909H26.7727C27.551 43.0909 28.1818 42.4397 28.1818 41.6364V22.4777C28.1818 21.7062 27.8849 20.9662 27.3564 20.4207L24.78 17.7611C24.2514 17.2156 23.5346 16.9091 22.7873 16.9091H22.5455V19.8182C22.5455 22.2281 20.6529 24.1818 18.3182 24.1818H12.6818C10.3472 24.1818 8.45455 22.2281 8.45455 19.8182V16.9091H4.22727ZM22.5455 43.0909V34.3636C22.5455 33.5603 21.9146 32.9091 21.1364 32.9091H9.86364C9.08545 32.9091 8.45455 33.5603 8.45455 34.3636V43.0909H22.5455ZM11.2727 16.9091H19.7273V19.8182C19.7273 20.6215 19.0964 21.2727 18.3182 21.2727H12.6818C11.9036 21.2727 11.2727 20.6215 11.2727 19.8182V16.9091Z" fill="white"></path>
      </svg>
      <span>Lưu thay đổi</span>
    </button>
  </section>
</template>

<script>
export default {
  name: 'ProductDetailsForm',
  props: {
    productName: {
      type: String,
      default: ''
    },
    authorName: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formData: {
        productName: this.productName,
        authorName: this.authorName,
        category: this.category,
        description: this.description,
        price: this.price
      }
    }
  },
  emits: ['save'],
  methods: {
    saveChanges() {
      this.$emit('save', this.formData);
    }
  }
}
</script>

<style scoped>
.product-form {
  flex: 1;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.form-label {
  color: #4d2900;
  font-family: Montserrat, sans-serif;
  font-size: 18px;
}

.input-wrapper {
  border-width: 1px;
  border-style: solid;
  border-color: #ccc9c9;
  padding: 13px 21px;
}

.form-input {
  width: 100%;
  font-size: 18px;
  font-family: Montserrat, sans-serif;
  border: none;
  outline: none;
}

.select-wrapper {
  border-width: 1px;
  border-style: solid;
  border-color: #ccc9c9;
  padding: 13px 21px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #d4d2d2;
  cursor: pointer;
}

.category-text {
  color: #4d2900;
  font-family: Montserrat, sans-serif;
  font-size: 18px;
}

.textarea-wrapper {
  border-width: 1px;
  border-style: solid;
  border-color: #ccc9c9;
  padding: 13px 21px;
  background-color: #d4d2d2;
  min-height: 174px;
}

.form-textarea {
  width: 100%;
  height: 100%;
  font-size: 18px;
  font-family: Montserrat, sans-serif;
  background-color: transparent;
  resize: none;
  border: none;
  outline: none;
}

.save-button {
  margin-top: 30px;
  width: 257px;
  height: 61px;
  background-color: #4d2900;
  color: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: Montserrat, sans-serif;
  font-size: 20px;
  font-weight: 900;
  border: none;
  cursor: pointer;
}
</style>