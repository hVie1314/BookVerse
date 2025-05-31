<template>
  <div class="action-buttons">
    <button class="delete-button" @click="$emit('delete')">
      <i class="fas fa-trash-alt"></i>
      <span>Xóa người dùng</span>
    </button>
    
    <div class="right-buttons">
      <button class="cancel-button" @click="$emit('cancel')">
        <i class="fas fa-times"></i>
        <span>Hủy bỏ</span>
      </button>
      <button class="save-button" @click="$emit('save')">
        <i class="fas fa-save"></i>
        <span>Lưu thay đổi</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionButtons'
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  justify-content: space-between;
  padding: 0 42px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.right-buttons {
  display: flex;
  gap: 12px;
}

.delete-button, .cancel-button, .save-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-family: Montserrat, sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-button {
  background-color: #FEE2E2;
  color: #EF4444;
  border: 1px solid #FCA5A5;
}

.delete-button:hover {
  background-color: #FEE2E2;
  box-shadow: 0 2px 5px rgba(239, 68, 68, 0.2);
}

.cancel-button {
  background-color: #F3F4F6;
  color: #4B5563;
  border: 1px solid #E5E7EB;
}

.cancel-button:hover {
  background-color: #E5E7EB;
}

.save-button {
  background-color: #4d2900;
  color: white;
  border: none;
}

.save-button:hover {
  background-color: #634000;
  box-shadow: 0 2px 5px rgba(77, 41, 0, 0.3);
}

/* Animaciones para los iconos */
.fas {
  transition: transform 0.2s ease;
}

.delete-button:hover .fas,
.cancel-button:hover .fas,
.save-button:hover .fas {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .right-buttons {
    width: 100%;
  }
  
  .delete-button, .cancel-button, .save-button {
    width: 100%;
  }
}
</style>
