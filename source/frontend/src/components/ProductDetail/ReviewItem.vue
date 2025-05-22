<template>
    <article class="review-item" :class="{'review-hidden': localReview.hidden}">
      <!-- Header chứa avatar và thông tin người dùng -->
      <div class="review-header">
        <!-- Avatar -->
        <div class="avatar-container">
          <img
            :src="review.avatar"
            class="reviewer-avatar"
            alt="Reviewer avatar"
            @error="handleAvatarError"
          />
        </div>
        
        <!-- Thông tin người dùng -->
        <div class="reviewer-info-container">
          <!-- Hàng 1: Tên và thời gian -->
          <div class="reviewer-info-row">
            <h3 class="reviewer-name">{{ review.name }}</h3>
            <span class="review-date">{{ review.date }}</span>
            
            <!-- Thêm nút 3 chấm và dropdown menu -->
            <div v-if="isLoggedIn && (isCurrentUserReview || isStaff)" class="review-options">
              <button class="options-button" @click.stop.prevent="toggleOptionsMenu($event)">
                <i class="fas fa-ellipsis-v"></i>
              </button>
              
              <!-- Dropdown menu-->
              <div v-show="showOptionsMenu" class="auth-container options-menu">
                <!-- Hiển thị tùy chọn dựa trên vai trò và quyền -->
                <template v-if="isCurrentUserReview">
                  <button class="auth-button login-button" @click.stop="editReview">
                    <i class="fas fa-edit"></i> Sửa đánh giá
                  </button>
                  <button class="auth-button register-button" @click.stop="confirmDeleteReview">
                    <i class="fas fa-trash"></i> Xóa đánh giá
                  </button>
                </template>
                
                <template v-else-if="isStaff && !localReview.hidden">
                  <button class="auth-button login-button" @click.stop="hideReview">
                    <i class="fas fa-eye-slash"></i> Ẩn đánh giá
                  </button>
                  <button class="auth-button register-button" @click.stop="confirmDeleteReview">
                    <i class="fas fa-trash"></i> Xóa đánh giá
                  </button>
                </template>
              </div>
            </div>
          </div>
          
          <!-- Hàng 2: Đánh giá sao -->
          <div class="star-rating">
            <i v-for="index in 5" :key="index" 
              :class="[index <= review.rating ? 'fas fa-star filled-star' : 'far fa-star empty-star']">
            </i>
          </div>
        </div>
      </div>
  
      <!-- Nội dung đánh giá -->
      <div class="review-content">
        <p class="review-text">{{ displayContent }}</p>
        
        <button class="read-more-button" v-if="isLongContent" @click="toggleExpandContent">
          {{ expanded ? 'Thu gọn' : 'Đọc thêm' }}
        </button>
      </div>
  
      <!-- Các nút tương tác -->
      <div class="review-actions">
        <button class="reply-button">Reply</button>
  
        <div class="like-container">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/46c6c4363e26327da7eca6cb690eed8fb44c85b5?placeholderIfAbsent=true"
            class="like-icon"
            alt="Like icon"
          />
          <span class="like-count">{{ review.likes }}</span>
        </div>
  
        <div class="dislike-container">
          <div class="dislike-icon"></div>
          <span class="dislike-count">{{ review.dislikes }}</span>
        </div>
      </div>
  
      <img
        src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/32244c8306a6f69c324168528b78d17c211378d7?placeholderIfAbsent=true"
        class="divider"
        alt="Divider"
      />
      
      <!-- Modal chỉnh sửa đánh giá -->
      <div v-if="showEditModal" class="edit-modal-overlay" @click.self="cancelEdit">
        <div class="edit-modal">
          <h3 class="edit-modal-title">Chỉnh sửa đánh giá</h3>
          
          <div class="edit-rating">
            <span>Đánh giá: </span>
            <div class="star-rating-edit">
              <i v-for="index in 5" 
                 :key="index" 
                 :class="[index <= editRating ? 'fas fa-star filled-star' : 'far fa-star empty-star']"
                 @click="setEditRating(index)">
              </i>
            </div>
          </div>
          
          <textarea 
            v-model="editContent" 
            class="edit-textarea" 
            placeholder="Nhập nội dung đánh giá...">
          </textarea>
          
          <div class="edit-actions">
            <button class="edit-cancel" @click="cancelEdit">Hủy</button>
            <button class="edit-save" @click="saveEdit">Lưu</button>
          </div>
        </div>
      </div>

    </article>
</template>
  
<script>
import AuthenticationService from '@/services/AuthenticationService';
import ReviewService from '@/services/ReviewService';
import eventBus from '@/eventBus.js';
import { useToast } from 'vue-toastification';

export default {
    name: 'ReviewItem',
    props: {
        review: {
          type: Object,
          required: true
        }
    },
    data() {
        return {
          expanded: false,
          showOptionsMenu: false,
          isLoggedIn: false,
          currentUser: null,
          isStaff: false,
          showEditModal: false,
          editRating: 0,
          editContent: '',
          localReview: null // đánh giá hiện tại.
        };
    },
    setup() {
      const toast = useToast();
      return {
        toast
      };
    },
    created() {
      this.localReview = { 
        ...this.review,
        hidden: this.review.hidden || false
      };
      
      this.isLoggedIn = AuthenticationService.isLoggedIn();
      
      if (this.isLoggedIn) {
        this.currentUser = AuthenticationService.getCurrentUser();
        this.isStaff = this.currentUser && (this.currentUser.role === 'staff' || this.currentUser.role === 'admin');
      }
      
      document.addEventListener('click', this.closeOptionsMenu);
    },
    beforeUnmount() {
      document.removeEventListener('click', this.closeOptionsMenu);
    },
    computed: {
        isLongContent() {
            const reviewText = this.localReview.content || this.localReview.comment || '';
            return reviewText.length > 200;
        },
        displayContent() {
            const reviewText = this.localReview.content || this.localReview.comment || '';
            if (!reviewText) return 'Không có nội dung đánh giá';
            
            return this.expanded || !this.isLongContent 
                ? reviewText 
                : reviewText.substring(0, 200) + '...';
        },
        isCurrentUserReview() {
          if (!this.currentUser || !this.review.userId) return false;
          return this.currentUser.id === this.review.userId;
        }
    },
    methods: {
      async hideReview() {
        try {
          this.showOptionsMenu = false;
          
          await ReviewService.hideReview(this.review.id);
          
          this.localReview = {
            ...this.localReview,
            hidden: true
          };
          
          this.$emit('visibility-changed', {
            id: this.review.id,
            hidden: true
          });
          
          this.toast.success("Đã ẩn đánh giá!", {
            timeout: 3000
          });
        } catch (error) {
          console.error('Lỗi khi ẩn đánh giá:', error);
          this.toast.error("Không thể ẩn đánh giá. Vui lòng thử lại sau.", {
            timeout: 3000
          });
        }
      },
        toggleExpandContent() {
          this.expanded = !this.expanded;
        },
        handleAvatarError(e) {
          e.target.src = 'https://ui-avatars.com/api/?name=' + 
            encodeURIComponent(this.review.name) + '&background=4d2900&color=fff';
        },
        toggleOptionsMenu(event) {
          if (event) {
            event.stopPropagation();
            event.preventDefault();
          }
          
          this.showOptionsMenu = !this.showOptionsMenu;
          
          console.log('Menu state after toggle:', this.showOptionsMenu);
        },
        closeOptionsMenu() {
          if (this.showOptionsMenu) {
            this.showOptionsMenu = false;
          }
        },
        
        editReview() {
          this.editRating = this.review.rating;
          this.editContent = this.review.content || this.review.comment || '';
          this.showEditModal = true;
          this.showOptionsMenu = false;
        },
        
        cancelEdit() {
          this.showEditModal = false;
        },
        
        async saveEdit() {
          try {
            await ReviewService.updateReview(this.review.id, {
              rating: this.editRating,
              comment: this.editContent
            });
            
            this.localReview = {
              ...this.localReview,
              rating: this.editRating,
              content: this.editContent,
              comment: this.editContent
            };
            
            this.showEditModal = false;
            
            this.$emit('review-updated', {
              id: this.review.id,
              rating: this.editRating,
              content: this.editContent,
              comment: this.editContent
            });
            
            this.toast.success("Đã cập nhật đánh giá thành công!", {
              timeout: 3000
            });
            
          } catch (error) {
            console.error('Lỗi khi cập nhật đánh giá:', error);
            this.toast.error("Không thể cập nhật đánh giá. Vui lòng thử lại sau.", {
              timeout: 3000
            });
          }
        },
        
        setEditRating(rating) {
          this.editRating = rating;
        },
        
        async toggleReviewVisibility(hide) {
          try {
            this.showOptionsMenu = false;
            
            if (hide) {
              await ReviewService.hideReview(this.review.id);
            } else {
              await ReviewService.unhideReview(this.review.id);
            }
            
            this.localReview = {
              ...this.localReview,
              hidden: hide
            };
            
            this.$emit('visibility-changed', {
              id: this.review.id,
              hidden: hide
            });
            
            eventBus.emit('show-alert', {
              show: true,
              type: 'success',
              title: 'Thành công',
              message: hide ? 'Đã ẩn đánh giá' : 'Đã hiện đánh giá',
              autoClose: true
            });
            
          } catch (error) {
            console.error('Lỗi khi thay đổi trạng thái đánh giá:', error);
            eventBus.emit('show-alert', {
              show: true,
              type: 'error',
              title: 'Lỗi',
              message: 'Không thể thay đổi trạng thái đánh giá. Vui lòng thử lại sau.',
              autoClose: true
            });
          }
        },
        
        confirmDeleteReview() {
          // Đóng menu tùy chọn
          this.showOptionsMenu = false;
          
          // Hiển thị hộp thoại xác nhận
          eventBus.emit('show-alert', {
            show: true,
            type: 'warning',
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa đánh giá này không?',
            autoClose: false,
            showChoices: true,
            confirmText: 'Xóa',
            cancelText: 'Hủy',
            choices: [
              {
                text: 'Xóa',
                onClick: () => this.deleteReview()
              },
              {
                text: 'Hủy',
                onClick: () => {}
              }
            ]
          });
        },

        async deleteReview() {
          try {
            // Gọi API để xóa đánh giá
            await ReviewService.deleteReview(this.review.id);

            this.showConfirmDelete = false;
            
            try {
              eventBus.emit('close-alert');
            } catch (error) {
              console.error('Error when emitting close-alert:', error);
            }
            
            // Thông báo thành công
            this.toast.success("Đã xóa đánh giá thành công!", {
              timeout: 3000
            });
            
            // Phát sự kiện để cập nhật danh sách đánh giá
            this.$emit('review-deleted', this.review.id);
            
          } catch (error) {
            console.error('Lỗi khi xóa đánh giá:', error);
            
            // Đóng hộp thoại xác nhận ngay cả khi có lỗi (thêm dòng này)
            eventBus.emit('close-alert');
            
            // Thông báo lỗi
            this.toast.error("Không thể xóa đánh giá. Vui lòng thử lại sau.", {
              timeout: 3000
            });
          }
        }
    },
    watch: {
      review: {
        handler(newValue) {
          this.localReview = { ...newValue };
        },
        deep: true
      }
    }
};
</script>
  
<style scoped>
  .review-item {
    border: 1px solid #f0f0f0;
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 8px;
    background-color: rgb(244, 235, 225);
    position: relative;
  }
  
  /* Header chứa avatar và thông tin người dùng */
  .review-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
  }
  
  .avatar-container {
    flex-shrink: 0;
    margin-right: 15px;
  }
  
  .reviewer-avatar {
    width: 50px;
    height: 50px;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
    display: block;
  }
  
  /* Container chứa thông tin người dùng (tên, thời gian, rating) */
  .reviewer-info-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
  }
  
  /* Hàng 1: Tên và thời gian */
  .reviewer-info-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    position: relative;
  }
  
  .reviewer-name {
    color: rgba(0, 0, 0, 1);
    font-family: Raleway, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 14px;
    margin: 0;
  }
  
  .review-date {
    color: rgb(159, 155, 155);
    font-size: 12px;
    margin-right: auto;
  }
  
  /* Nút 3 chấm và menu dropdown */
  .review-options {
    position: relative;
    margin-left: auto;
    z-index: 50; /* Tăng z-index */
  }
  
  /* Thay bằng đoạn CSS này để tạo hình tròn hoàn hảo */
.options-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  width: 30px;  /* Chiều rộng cụ thể */
  height: 30px; /* Chiều cao bằng với chiều rộng */
  border-radius: 50%;
  font-size: 14px;
  transition: all 0.2s;
  z-index: 51;
  display: flex;        /* Sử dụng flexbox để căn giữa icon */
  align-items: center;
  justify-content: center;
}
  
  .options-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .options-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: black;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 180px;
  z-index: 100; /* Đảm bảo hiển thị trên cùng */
  overflow: hidden;
  border: 1px solid black;
  }
  
  .auth-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .auth-button {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .auth-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .login-button {
    /* Styles for login button (edit review) */
  }
  
  .register-button {
    color: #e53935;
  }
  
  .register-button:hover {
    background-color: rgba(229, 57, 53, 0.05);
  }
  
  /* Hàng 2: Đánh giá sao */
  .star-rating {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  
  .filled-star {
    color: #FFD700; /* Màu vàng */
  }

  .empty-star {
    color: #D3D3D3; /* Màu xám nhạt */
  }
  
  /* Phần nội dung đánh giá */
  .review-content {
    margin-left: 65px; /* Căn lề trái bằng với width avatar + margin */
    margin-bottom: 15px;
  }
  
  .review-text {
    color: rgba(0, 0, 0, 1);
    font-family: Raleway, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 5px;
  }
  
  .read-more-button {
    color: rgba(76, 41, 0, 1);
    font-size: 14px;
    font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 500;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: block;
    margin-top: 5px;
  }
  
  /* Phần actions */
  .review-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-left: 65px; /* Căn lề trái bằng với width avatar + margin */
    margin-top: 10px;
  }
  
  .reply-button {
    color: rgba(217, 217, 217, 1);
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
  }
  
  .like-container, .dislike-container {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  
  .like-icon {
    width: 20px;
    object-fit: contain;
  }
  
  .divider {
    width: 100%;
    margin-top: 18px;
  }
  
  /* Modal chỉnh sửa */
  .edit-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  
  .edit-modal {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 20px 20px rgba(0, 0, 0, 0.15);
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .edit-modal-title {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
  }
  
  .edit-rating {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .star-rating-edit {
    display: flex;
    gap: 5px;
  }
  
  .star-rating-edit i {
    cursor: pointer;
    font-size: 20px;
    transition: transform 0.2s;
  }
  
  .star-rating-edit i:hover {
    transform: scale(1.2);
  }
  
  .edit-textarea {
    width: 100%;
    min-height: 100px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 15px;
    font-family: inherit;
    resize: vertical;
  }
  
  .edit-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .edit-cancel, .edit-save {
    padding: 8px 15px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .edit-cancel {
    background-color: #f1f1f1;
    color: #333;
  }
  
  .edit-save {
    background-color: #4d2900;
    color: white;
  }
  
  .edit-cancel:hover {
    background-color: #e1e1e1;
  }
  
  .edit-save:hover {
    background-color: #3a1e00;
  }
  
  /* Media queries */
  @media (max-width: 991px) {
    .review-content, .review-actions {
      margin-left: 0;
    }
    
    .review-header {
      flex-direction: column;
    }
    
    .avatar-container {
      margin-bottom: 10px;
    }
    
    .reviewer-info-row {
      flex-wrap: wrap;
    }
  }
  
  /* Style cho dropdown menu*/
  .options-menu.auth-container {
    max-width: none;
    width: 160px; /* Giảm từ 270px xuống 200px */
    height: auto;
    padding: 6px 0; /* Giảm padding từ 15px xuống 10px */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 6px; /* Giảm border-radius từ 8px xuống 6px */
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.2); /* Giảm độ đậm của shadow */
    gap: 4px; /* Giảm gap từ 13px xuống 8px */
    background-color: #fffaf5;
    position: absolute;
    margin-top: 5px;
    top: 100%;
    right: 0;
    z-index: 1000;
  }
  
  .options-menu .auth-button {
    width: 150px;
    height: 32px;
    border-radius: 6px;
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  
  .options-menu .login-button {
    background-color: #4d2900;
    color: #fffaf5;
  }
  
  .options-menu .register-button {
    margin-top: 2px;
    border: 1.5px solid #4d2900;
    background-color: #fffaf5;
    color: #4d2900;
  }
  
  .options-menu .auth-button i {
    margin-right: 5px;
    font-size: 12px;
  }
  
  @media (max-width: 991px) {
    .options-menu.auth-container {
      width: 120px;
    }
    
    .options-menu .auth-button {
      width: 160px;
      height: 35px;
      font-size: 12px;
    }
  }
  .review-hidden {
  opacity: 0.7;
  border: 1px dashed #e53935;
  position: relative;
}

.hidden-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e53935;
  color: white;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
}
</style>