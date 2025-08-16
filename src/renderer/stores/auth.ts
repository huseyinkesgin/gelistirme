import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: string;
  ad: string;
  soyad: string;
  email: string;
  roller: string[];
  son_giris_tarihi?: Date;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  ad: string;
  soyad: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const loginAttempts = ref(0);
  const lastLoginAttempt = ref<Date | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value);
  const userName = computed(() => {
    if (!user.value) return '';
    return `${user.value.ad} ${user.value.soyad}`;
  });
  const userInitials = computed(() => {
    if (!user.value) return '';
    return `${user.value.ad.charAt(0)}${user.value.soyad.charAt(0)}`.toUpperCase();
  });
  const hasRole = computed(() => (role: string) => {
    return user.value?.roller.includes(role) || false;
  });
  const canLogin = computed(() => {
    // Rate limiting: max 5 attempts per 15 minutes
    if (loginAttempts.value >= 5 && lastLoginAttempt.value) {
      const timeDiff = Date.now() - lastLoginAttempt.value.getTime();
      return timeDiff > 15 * 60 * 1000; // 15 minutes
    }
    return true;
  });

  // Actions
  const setLoading = (state: boolean) => {
    loading.value = state;
  };

  const setUser = (userData: User) => {
    user.value = userData;
  };

  const setToken = (tokenValue: string) => {
    token.value = tokenValue;
    // Token'ı localStorage'a kaydet
    localStorage.setItem('auth_token', tokenValue);
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    if (!canLogin.value) {
      return {
        success: false,
        message: 'Çok fazla başarısız giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.'
      };
    }

    try {
      setLoading(true);
      
      // Şimdilik mock authentication
      // Gerçek API entegrasyonu daha sonra yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        const userData: User = {
          id: '1',
          ad: 'Admin',
          soyad: 'User',
          email: credentials.email,
          roller: ['admin', 'user'],
          son_giris_tarihi: new Date()
        };
        
        setUser(userData);
        setToken('mock-jwt-token');
        
        // User data'yı localStorage'a kaydet
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        // Login attempts'i sıfırla
        loginAttempts.value = 0;
        lastLoginAttempt.value = null;
        
        return { success: true };
      } else {
        // Başarısız giriş denemesi
        loginAttempts.value++;
        lastLoginAttempt.value = new Date();
        
        return {
          success: false,
          message: 'Geçersiz e-posta veya şifre'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Giriş yapılırken bir hata oluştu'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      
      // Validation
      if (data.password !== data.passwordConfirm) {
        return {
          success: false,
          message: 'Şifreler eşleşmiyor'
        };
      }
      
      if (data.password.length < 6) {
        return {
          success: false,
          message: 'Şifre en az 6 karakter olmalıdır'
        };
      }
      
      // Şimdilik mock registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: Date.now().toString(),
        ad: data.ad,
        soyad: data.soyad,
        email: data.email,
        roller: ['user'],
        son_giris_tarihi: new Date()
      };
      
      setUser(userData);
      setToken('mock-jwt-token');
      
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Kayıt olurken bir hata oluştu'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // API'ye logout isteği gönder (gelecekte)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      clearAuth();
      
      // Router'a yönlendirme yapılacak (component'te)
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Hata olsa bile local auth'u temizle
      clearAuth();
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!token.value) return false;
      
      // Token refresh logic (gelecekte API ile)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Şimdilik mevcut token'ı koru
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuth();
      return false;
    }
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      // localStorage'dan token ve user data'yı kontrol et
      const savedToken = localStorage.getItem('auth_token');
      const savedUserData = localStorage.getItem('user_data');
      
      if (savedToken && savedUserData) {
        try {
          const userData = JSON.parse(savedUserData);
          setUser(userData);
          setToken(savedToken);
          
          // Token'ın geçerliliğini kontrol et (gelecekte API ile)
          const isValid = await refreshToken();
          return isValid;
        } catch (parseError) {
          console.error('Saved user data parse error:', parseError);
          clearAuth();
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Auth status check error:', error);
      clearAuth();
      return false;
    }
  };

  const updateProfile = async (profileData: Partial<User>): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      
      if (!user.value) {
        return { success: false, message: 'Kullanıcı bulunamadı' };
      }
      
      // API'ye profil güncelleme isteği (gelecekte)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Local user data'yı güncelle
      const updatedUser = { ...user.value, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      return { success: true, message: 'Profil başarıyla güncellendi' };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Profil güncellenirken hata oluştu' };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      
      if (newPassword.length < 6) {
        return { success: false, message: 'Yeni şifre en az 6 karakter olmalıdır' };
      }
      
      // API'ye şifre değiştirme isteği (gelecekte)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Şifre başarıyla değiştirildi' };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, message: 'Şifre değiştirilirken hata oluştu' };
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    user,
    token,
    loading,
    loginAttempts,
    lastLoginAttempt,
    
    // Getters
    isAuthenticated,
    userName,
    userInitials,
    hasRole,
    canLogin,
    
    // Actions
    setLoading,
    setUser,
    setToken,
    clearAuth,
    login,
    register,
    logout,
    refreshToken,
    checkAuthStatus,
    updateProfile,
    changePassword
  };
});