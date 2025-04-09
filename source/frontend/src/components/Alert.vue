<template>
    <transition name="fade">
      <div v-if="show" class="alert-container" :class="type">
        <div class="alert-icon">
          <svg v-if="type === 'success'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#4CAF50" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 12L11 15L16 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-if="type === 'error'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#F44336" stroke="#F44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 9L9 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 9L15 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="alert-content">
          <div class="alert-title">{{ title }}</div>
          <div class="alert-message">{{ message }}</div>
        </div>
        <button @click="closeAlert" class="alert-close">×</button>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'Alert-vue',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'success',
        validator: (value) => ['success', 'error'].includes(value)
      },
      title: {
        type: String,
        default: 'Success'
      },
      message: {
        type: String,
        default: 'Operation completed successfully'
      },
      duration: {
        type: Number,
        default: 3000
      },
      autoClose: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      show(newVal) {
        if (newVal && this.autoClose) {
          this.setAutoClose();
        }
      }
    },
    methods: {
      closeAlert() {
        this.$emit('update:show', false);
      },
      setAutoClose() {
        setTimeout(() => {
          this.closeAlert();
        }, this.duration);
      }
    },
    mounted() {
      if (this.show && this.autoClose) {
        this.setAutoClose();
      }
    }
  }
  </script>
  
  <style scoped>
  .alert-container {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: flex-start;
    max-width: 400px;
    min-width: 300px;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: #fff;
    z-index: 9999;
  }
  
  .success {
    border-left: 4px solid #4CAF50;
  }
  
  .error {
    border-left: 4px solid #F44336;
  }
  
  .alert-icon {
    margin-right: 16px;
    flex-shrink: 0;
  }
  
  .alert-content {
    flex: 1;
  }
  
  .alert-title {
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
    color: #333;
  }
  
  .alert-message {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #666;
  }
  
  .alert-close {
    background: none;
    border: none;
    font-size: 24px;
    line-height: 1;
    color: #999;
    cursor: pointer;
    padding: 0;
    margin-left: 12px;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }
  
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  </style>