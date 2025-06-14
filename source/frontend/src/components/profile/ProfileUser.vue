<template>
  <div class="profile-user-container">
    <Alert
      v-model:show="alert.show"
      :type="alert.type"
      :title="alert.title"
      :message="alert.message"
    />
    <Nav />
    <main class="profile-main">
      <div v-if="loading" class="loading-container">
        <i class="fa-solid fa-spinner fa-spin"></i> Đang tải thông tin...
      </div>
      <div v-else-if="error" class="error-message">
        {{ error }}
        <div class="error-actions">
          <button @click="$router.push('/login')" class="action-button">
            Đăng nhập
          </button>
          <button @click="$router.push('/')" class="action-button">
            Về trang chủ
          </button>
        </div>
      </div>
      <ProfilePage
        v-else
        :user="userInfo"
        :maintain-editing="maintainEditing"
        @update-profile="updateUserProfile"
      />
    </main>
    <Footer />
  </div>
</template>

<script>
import Nav from "../navbar/Nav.vue";
import Footer from "../footer/footer.vue";
import ProfilePage from "./ProfilePage.vue";
import UserService from "@/services/UserService";
import AuthenticationService from "@/services/AuthenticationService";
import Alert from "@/components/Alert.vue";

export default {
  name: "ProfileUser",
  components: {
    Nav,
    Footer,
    ProfilePage,
    Alert,
  },
  data() {
    return {
      userInfo: null,
      loading: true,
      error: null,
      alert: {
        show: false,
        type: "success",
        title: "Thông báo",
        message: "",
      },
      maintainEditing: false,
    };
  },
  created() {
    this.maintainEditing = false;
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        this.loading = true;
        const currentUser = AuthenticationService.getCurrentUser();

        if (!currentUser || !currentUser.id) {
          this.error = "Vui lòng đăng nhập để xem thông tin cá nhân";
          this.loading = false;
          return;
        }

        const response = await UserService.getUserById(currentUser.id);
        console.log("User data response:", response);

        if (response.data && response.data.success) {
          this.userInfo = response.data.data || response.data.user;
        } else if (response.data && response.data.user) {
          this.userInfo = response.data.user;
        } else if (response.data) {
          this.userInfo = response.data;
        } else {
          this.error = "Không thể tải thông tin người dùng";
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        this.error = "Đã xảy ra lỗi khi tải thông tin người dùng";
      } finally {
        this.loading = false;
      }
    },

    async isValidImageUrl(url) {
      if (!url) return true;

      const pattern = new RegExp(
        "^(https?:\\/\\/)?" +
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
          "((\\d{1,3}\\.){3}\\d{1,3}))" +
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
          "(\\?[;&a-z\\d%_.~+=-]*)?" +
          "(\\#[-a-z\\d_]*)?$",
        "i"
      );

      if (!pattern.test(url)) {
        return false;
      }

      try {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
          setTimeout(() => resolve(false), 5000);
        });
      } catch (error) {
        return false;
      }
    },

    async updateUserProfile(updatedData) {
      try {
        const currentUser = AuthenticationService.getCurrentUser();

        if (!currentUser || !currentUser.id) {
          this.alert = {
            show: true,
            type: "error",
            title: "Lỗi xác thực",
            message: "Vui lòng đăng nhập để cập nhật thông tin",
          };
          this.loading = false;
          return;
        }

        if (updatedData.avatar) {
          const isValidImage = await this.isValidImageUrl(updatedData.avatar);
          if (!isValidImage) {
            this.maintainEditing = true;
            this.alert = {
              show: true,
              type: "error",
              title: "Lỗi hình ảnh",
              message:
                "URL hình ảnh không hợp lệ. Vui lòng kiểm tra lại đường dẫn.",
            };
            this.loading = false;
            return;
          }
        }

        const allowedFields = ["password", "address", "avatar"];
        const filteredData = {
          userId: currentUser.id,
          ...updatedData,
        };

        for (const field of allowedFields) {
          if (updatedData[field] !== undefined) {
            filteredData[field] = updatedData[field];
          }
        }

        if (Object.keys(filteredData).length === 0) {
          this.maintainEditing = true;
          this.alert = {
            show: true,
            type: "error",
            title: "Không có thay đổi",
            message: "Không có thông tin nào được thay đổi",
          };
          this.loading = false;
          return;
        }

        this.loading = true;
        const response = await UserService.updateUserInfo(
          currentUser.id,
          filteredData
        );

        if (response && response.data) {
          this.maintainEditing = false;
          this.userInfo = { ...this.userInfo, ...filteredData };
          const updatedUserData = { ...currentUser, ...filteredData };
          localStorage.setItem("userData", JSON.stringify(updatedUserData));

          this.alert = {
            show: true,
            type: "success",
            title: "Cập nhật thành công",
            message: "Thông tin tài khoản của bạn đã được cập nhật",
          };
        } else {
          this.maintainEditing = true;
          this.alert = {
            show: true,
            type: "error",
            title: "Cập nhật thất bại",
            message: "Không thể cập nhật thông tin người dùng",
          };
        }
      } catch (error) {
        console.error("Error updating user profile:", error);
        this.maintainEditing = true;
        this.alert = {
          show: true,
          type: "error",
          title: "Lỗi hệ thống",
          message: "Đã xảy ra lỗi khi cập nhật thông tin",
        };
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.profile-user-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: rgb(244, 235, 225);
}

.profile-main {
  width: 100%;
  flex: 1;
  margin-top: 50px;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.loading-container,
.error-message {
  width: 100%;
  max-width: 800px;
  padding: 30px;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  font-size: 18px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.loading-container {
  color: #4d2900;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  min-height: 200px;
}

.error-message {
  color: #ff3333;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.error-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.action-button {
  background-color: #4d2900;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: #724e4e;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .profile-main {
    margin-top: 30px;
    margin-bottom: 30px;
    padding: 0 15px;
  }
}
</style>