<template>
    <div class="auth-container">
        <!-- Hiển thị khi chưa đăng nhập -->
        <div v-if="!isLoggedIn" class="auth-button">
            <button @click="$emit('login')" class="auth-button login-button">Đăng nhập</button>
            <button @click="$emit('register')" class="auth-button register-button">Đăng ký</button>
        </div>
      
        <!-- Hiển thị khi đã đăng nhập -->
        <div v-else class="auth-button">
            <button @click="$emit('profile')" class="auth-button login-button">Thông tin cá nhân</button>
            <button @click="$emit('logout')" class="auth-button register-button">Đăng xuất</button>
        </div>
    </div>
</template>
  
<style scoped>
    .auth-container {
        max-width: none;
        margin-left: auto;
        margin-right: auto;
        width: 321px;
        height: 139px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        gap: 13px;
        background-color: #fffaf5;
        position: relative;
        z-index: 1000;
    }

    .auth-button {
        width: 270px;
        height: 47px;
        border-radius: 8px;
        font-family: "Montserrat", sans-serif;
        font-size: 15px;
        font-weight: 900;
        line-height: 39px;
        cursor: pointer;
        border: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .login-button {
        background-color: #4d2900;
        color: #fffaf5;
    }

    .register-button {
        margin-top: 5px;
        border: 2px solid #4d2900;
        background-color: #fffaf5;
        color: #4d2900;
    }

    @media (max-width: 991px) {
    .auth-container {
            max-width: 991px;
            width: 100%;
            padding: 20px;
        }

        .auth-button {
            width: 100%;
        }
    }

    @media (max-width: 640px) {
        .auth-container {
            max-width: 640px;
            padding: 16px;
        }

        .auth-button {
            width: 100%;
        }
    }
</style>
  
<script>
    export default {
        name: "AuthButtons",
        props: {
            isLoggedIn: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["login", "register", "profile", "logout"],
    };
</script>
  