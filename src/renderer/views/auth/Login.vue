<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full mx-auto space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isLogin ? 'Giriş Yapın' : 'Kayıt Olun' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Emlak Portföy Yönetim Sistemi
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-2">
          <div v-if="!isLogin" class="grid grid-cols-2 gap-2">
            <input v-model="form.ad" type="text" required
              class="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Ad">
            <input v-model="form.soyad" type="text" required
              class="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Soyad">
          </div>
          <div>
            <input v-model="form.email" type="email" required
              class="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="E-posta adresi">
          </div>
          <div>
            <input v-model="form.password" type="password" required
              class="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Şifre">
          </div>
          <div v-if="!isLogin">
            <input v-model="form.passwordConfirm" type="password" required
              class="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Şifre Tekrar">
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50">
            <span v-if="loading">{{ isLogin ? 'Giriş yapılıyor...' : 'Kayıt oluşturuluyor...' }}</span>
            <span v-else>{{ isLogin ? 'Giriş Yap' : 'Kayıt Ol' }}</span>
          </button>
        </div>

        <div class="text-center">
          <button type="button" @click="toggleMode" class="text-amber-600 hover:text-amber-500 text-sm">
            {{ isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useNotificationStore } from '../../stores/notification';

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const isLogin = ref(true);
const form = ref({
  ad: '',
  soyad: '',
  email: '',
  password: '',
  passwordConfirm: ''
});

const loading = computed(() => authStore.loading);
const canLogin = computed(() => authStore.canLogin);

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  // Form'u temizle
  form.value = {
    ad: '',
    soyad: '',
    email: '',
    password: '',
    passwordConfirm: ''
  };
};

const handleSubmit = async () => {
  try {
    if (!canLogin.value) {
      notificationStore.error('Giriş Engellendi', 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.');
      return;
    }

    if (!isLogin.value && form.value.password !== form.value.passwordConfirm) {
      notificationStore.error('Doğrulama Hatası', 'Şifreler eşleşmiyor!');
      return;
    }

    let result;
    if (isLogin.value) {
      result = await authStore.login({
        email: form.value.email,
        password: form.value.password
      });
    } else {
      result = await authStore.register({
        ad: form.value.ad,
        soyad: form.value.soyad,
        email: form.value.email,
        password: form.value.password,
        passwordConfirm: form.value.passwordConfirm
      });
    }

    if (result.success) {
      // Giriş başarılı bildirim
      notificationStore.success(
        isLogin.value ? 'Giriş Başarılı' : 'Kayıt Başarılı',
        isLogin.value ? 'Hoş geldiniz!' : 'Hesabınız başarıyla oluşturuldu.'
      );

      // IPC üzerinden ana sürece giriş başarılı bilgisini gönder
      window.electronAPI.auth.loginSuccess();

      // Ana sayfaya yönlendir
      router.push('/');
    } else {
      notificationStore.error(
        'İşlem Başarısız',
        result.message || 'Bir hata oluştu'
      );
    }
  } catch (error) {
    console.error('İşlem hatası:', error);
    notificationStore.systemError(error, 'Bir sistem hatası oluştu');
  }
};
</script>