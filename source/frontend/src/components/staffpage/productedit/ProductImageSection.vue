<template>
  <section class="image-section">
    <img :src="mainImage" alt="Product" class="main-image" />

    <div class="thumbnails-grid">
      <img v-for="(thumbnail, index) in thumbnails.slice(0, 3)"
           :key="index"
           :src="thumbnail"
           alt=""
           class="thumbnail" />

      <div class="video-thumbnail">
        <img :src="thumbnails[3]" alt="" class="thumbnail-image" />
        <div class="overlay"></div>
        <div class="play-button">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="play-icon">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4244 13.8813C22.8208 14.9486 22.8208 17.0514 21.4244 18.1187L15.3178 22.7859C13.563 24.1271 11.0318 22.8759 11.0318 20.6672V11.3327C11.0318 9.12409 13.563 7.87284 15.3178 9.21402L21.4244 13.8813ZM19.805 16L13.6985 11.3327L13.6985 20.6672L19.805 16Z" fill="white"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0007 3.99992C9.37323 3.99992 4.00065 9.3725 4.00065 15.9999C4.00065 22.6273 9.37323 27.9999 16.0007 27.9999C22.6281 27.9999 28.0007 22.6273 28.0007 15.9999C28.0007 9.3725 22.6281 3.99992 16.0007 3.99992ZM1.33398 15.9999C1.33398 7.89974 7.90047 1.33325 16.0007 1.33325C24.1008 1.33325 30.6673 7.89974 30.6673 15.9999C30.6673 24.1001 24.1008 30.6666 16.0007 30.6666C7.90047 30.6666 1.33398 24.1001 1.33398 15.9999Z" fill="white"></path>
          </svg>
        </div>
      </div>
    </div>

    <button class="upload-button" @click="$emit('upload')">
      <svg width="24" height="24" viewBox="0 0 48 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M25.9048 21.75C25.9048 18.1601 28.6337 15.25 32 15.25C35.3662 15.25 38.0952 18.1601 38.0952 21.75V23.375H39.619C42.5646 23.375 44.9524 25.9214 44.9524 29.0625C44.9524 32.2036 42.5646 34.75 39.619 34.75H38.0952C37.2536 34.75 36.5714 35.4775 36.5714 36.375C36.5714 37.2725 37.2536 38 38.0952 38H39.619C44.2478 38 48 33.9986 48 29.0625C48 24.6414 44.9897 20.97 41.0356 20.2521C40.3599 15.5785 36.5719 12 32 12C27.4282 12 23.6401 15.5785 22.9644 20.2521C19.0103 20.97 16 24.6414 16 29.0625C16 33.9986 19.7523 38 24.381 38H25.9048C26.7463 38 27.4286 37.2725 27.4286 36.375C27.4286 35.4775 26.7463 34.75 25.9048 34.75H24.381C21.4354 34.75 19.0476 32.2036 19.0476 29.0625C19.0476 25.9214 21.4354 23.375 24.381 23.375H25.9048V21.75ZM37.6489 27.101L33.0775 22.226C32.4824 21.5914 31.5176 21.5914 30.9225 22.226L26.3511 27.101C25.756 27.7355 25.756 28.7645 26.3511 29.399C26.9462 30.0336 27.911 30.0336 28.5061 29.399L30.4762 27.2981V36.375C30.4762 37.2725 31.1584 38 32 38C32.8416 38 33.5238 37.2725 33.5238 36.375V27.2981L35.4939 29.399C36.089 30.0336 37.0539 30.0336 37.6489 29.399C38.244 28.7645 38.244 27.7355 37.6489 27.101Z" fill="white"></path>
      </svg>
      <span>Tải URL hình ảnh lên</span>
    </button>
  </section>
</template>

<script>
export default {
  name: 'ProductImageSection',
  props: {
    mainImage: {
      type: String,
      required: true
    },
    thumbnails: {
      type: Array,
      required: true
    }
  },
  emits: ['upload']
}
</script>

<style scoped>
.image-section {
  width: 100%;
}

.main-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.thumbnails-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.thumbnail {
  width: 100%;
  height: 104px;
  border-radius: 4px;
  opacity: 0.6;
  object-fit: cover;
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 104px;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  opacity: 0.6;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #1e212c;
  opacity: 0.6;
  border-radius: 4px;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.play-icon {
  width: 32px;
  height: 32px;
}

.upload-button {
  width: 100%;
  background-color: #4d2900;
  color: #ffffff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  font-weight: 900;
  border: none;
  cursor: pointer;
}
</style>