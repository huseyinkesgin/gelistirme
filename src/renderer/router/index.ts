import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useAppStore } from '../stores/app';
import { useNotificationStore } from '../stores/notification';

// Route meta interface
declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    description?: string;
    requiresAuth?: boolean;
    roles?: string[];
    icon?: string;
    breadcrumb?: string[];
    keepAlive?: boolean;
    transition?: string;
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      title: 'Ana Sayfa',
      description: 'Genel bakış ve istatistikler',
      requiresAuth: true,
      icon: 'home',
      keepAlive: true
    }
  },
  
  // Mülk yönetimi rotaları
  {
    path: '/mulkler',
    name: 'Properties',
    component: () => import('../views/properties/PropertyList.vue'),
    meta: {
      title: 'Mülkler',
      description: 'Mülk listesi ve yönetimi',
      requiresAuth: true,
      icon: 'building',
      breadcrumb: ['Ana Sayfa', 'Mülkler']
    }
  },
  {
    path: '/mulkler/yeni',
    name: 'PropertyCreate',
    component: () => import('../views/properties/PropertyCreate.vue'),
    meta: {
      title: 'Yeni Mülk',
      description: 'Yeni mülk ekleme',
      requiresAuth: true,
      breadcrumb: ['Ana Sayfa', 'Mülkler', 'Yeni Mülk']
    }
  },
  {
    path: '/mulkler/:id',
    name: 'PropertyDetail',
    component: () => import('../views/properties/PropertyDetail.vue'),
    meta: {
      title: 'Mülk Detayı',
      description: 'Mülk detay bilgileri',
      requiresAuth: true,
      breadcrumb: ['Ana Sayfa', 'Mülkler', 'Detay']
    }
  },
  {
    path: '/mulkler/:id/duzenle',
    name: 'PropertyEdit',
    component: () => import('../views/properties/PropertyEdit.vue'),
    meta: {
      title: 'Mülk Düzenle',
      description: 'Mülk bilgilerini düzenleme',
      requiresAuth: true,
      breadcrumb: ['Ana Sayfa', 'Mülkler', 'Düzenle']
    }
  },
  
  // Müşteri yönetimi rotaları
  {
    path: '/musteriler',
    name: 'Customers',
    component: () => import('../views/customers/CustomerList.vue'),
    meta: {
      title: 'Müşteriler',
      description: 'Müşteri listesi ve yönetimi',
      requiresAuth: true,
      icon: 'users',
      breadcrumb: ['Ana Sayfa', 'Müşteriler']
    }
  },
  {
    path: '/musteriler/yeni',
    name: 'CustomerCreate',
    component: () => import('../views/customers/CustomerCreate.vue'),
    meta: {
      title: 'Yeni Müşteri',
      description: 'Yeni müşteri ekleme',
      requiresAuth: true,
      breadcrumb: ['Ana Sayfa', 'Müşteriler', 'Yeni Müşteri']
    }
  },
  {
    path: '/musteriler/:id',
    name: 'CustomerDetail',
    component: () => import('../views/customers/CustomerDetail.vue'),
    meta: {
      title: 'Müşteri Detayı',
      description: 'Müşteri detay bilgileri',
      requiresAuth: true,
      breadcrumb: ['Ana Sayfa', 'Müşteriler', 'Detay']
    }
  },
  
  // Randevu yönetimi rotaları
  {
    path: '/randevular',
    name: 'Appointments',
    component: () => import('../views/appointments/AppointmentList.vue'),
    meta: {
      title: 'Randevular',
      description: 'Randevu listesi ve takvim',
      requiresAuth: true,
      icon: 'calendar',
      breadcrumb: ['Ana Sayfa', 'Randevular']
    }
  },
  {
    path: '/randevular/yeni',
    name: 'AppointmentCreate',
    component: () => import('../views/appointments/AppointmentCreate.vue'),
    meta: {
      title: 'Yeni Randevu',
      description: 'Yeni randevu oluşturma',
      requiresAuth: true,
      breadcrumb: ['Ana Sayfa', 'Randevular', 'Yeni Randevu']
    }
  },
  {
    path: '/randevular/takvim',
    name: 'AppointmentCalendar',
    component: () => import('../views/appointments/AppointmentCalendar.vue'),
    meta: {
      title: 'Randevu Takvimi',
      description: 'Takvim görünümü',
      requiresAuth: true,
      breadcrumb: ['Ana Sayfa', 'Randevular', 'Takvim']
    }
  },
  
  // İlan yönetimi rotaları
  {
    path: '/ilanlar',
    name: 'Listings',
    component: () => import('../views/listings/ListingList.vue'),
    meta: {
      title: 'İlanlar',
      description: 'İlan listesi ve yönetimi',
      requiresAuth: true,
      icon: 'megaphone',
      breadcrumb: ['Ana Sayfa', 'İlanlar']
    }
  },
  {
    path: '/ilanlar/yeni',
    name: 'ListingCreate',
    component: () => import('../views/listings/ListingCreate.vue'),
    meta: {
      title: 'Yeni İlan',
      description: 'Yeni ilan oluşturma',
      requiresAuth: true,
      breadcrumb: ['Ana Sayfa', 'İlanlar', 'Yeni İlan']
    }
  },
  
  // Rapor rotaları
  {
    path: '/raporlar',
    name: 'Reports',
    component: () => import('../views/reports/ReportDashboard.vue'),
    meta: {
      title: 'Raporlar',
      description: 'Raporlama ve analiz',
      requiresAuth: true,
      icon: 'chart-bar',
      breadcrumb: ['Ana Sayfa', 'Raporlar']
    }
  },
  {
    path: '/raporlar/satis',
    name: 'SalesReports',
    component: () => import('../views/reports/SalesReports.vue'),
    meta: {
      title: 'Satış Raporları',
      description: 'Satış performans raporları',
      requiresAuth: true,
      roles: ['admin', 'manager'],
      breadcrumb: ['Ana Sayfa', 'Raporlar', 'Satış Raporları']
    }
  },
  {
    path: '/raporlar/finansal',
    name: 'FinancialReports',
    component: () => import('../views/reports/FinancialReports.vue'),
    meta: {
      title: 'Finansal Raporlar',
      description: 'Finansal analiz raporları',
      requiresAuth: true,
      roles: ['admin', 'manager'],
      breadcrumb: ['Ana Sayfa', 'Raporlar', 'Finansal Raporlar']
    }
  },
  
  // Ayarlar rotaları
  {
    path: '/ayarlar',
    name: 'Settings',
    component: () => import('../views/settings/Settings.vue'),
    meta: {
      title: 'Ayarlar',
      description: 'Uygulama ayarları',
      requiresAuth: true,
      icon: 'cog',
      breadcrumb: ['Ana Sayfa', 'Ayarlar']
    }
  },
  {
    path: '/ayarlar/profil',
    name: 'ProfileSettings',
    component: () => import('../views/settings/ProfileSettings.vue'),
    meta: {
      title: 'Profil Ayarları',
      description: 'Kullanıcı profil ayarları',
      requiresAuth: true,
      breadcrumb: ['Ana Sayfa', 'Ayarlar', 'Profil']
    }
  },
  {
    path: '/ayarlar/sistem',
    name: 'SystemSettings',
    component: () => import('../views/settings/SystemSettings.vue'),
    meta: {
      title: 'Sistem Ayarları',
      description: 'Sistem yapılandırması',
      requiresAuth: true,
      roles: ['admin'],
      breadcrumb: ['Ana Sayfa', 'Ayarlar', 'Sistem']
    }
  },
  
  // Kimlik doğrulama rotaları
  {
    path: '/giris',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: {
      title: 'Giriş',
      description: 'Sisteme giriş yapın',
      requiresAuth: false,
      transition: 'fade'
    }
  },
  
  // Hata sayfaları
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../views/errors/NotFound.vue'),
    meta: {
      title: 'Sayfa Bulunamadı',
      description: 'Aradığınız sayfa bulunamadı',
      requiresAuth: false
    }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('../views/errors/Forbidden.vue'),
    meta: {
      title: 'Erişim Reddedildi',
      description: 'Bu sayfaya erişim yetkiniz bulunmamaktadır',
      requiresAuth: false
    }
  },
  {
    path: '/500',
    name: 'ServerError',
    component: () => import('../views/errors/ServerError.vue'),
    meta: {
      title: 'Sunucu Hatası',
      description: 'Bir sunucu hatası oluştu',
      requiresAuth: false
    }
  },
  
  // Catch all route - 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Global navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const appStore = useAppStore();
  const notificationStore = useNotificationStore();
  
  try {
    // Loading state'i başlat
    appStore.setLoading(true);
    
    // Route bilgisini güncelle
    appStore.setCurrentRoute(to.path);
    
    // Authentication kontrolü
    if (to.meta.requiresAuth !== false) {
      // Auth durumunu kontrol et
      const isAuthenticated = authStore.isAuthenticated || await authStore.checkAuthStatus();
      
      if (!isAuthenticated) {
        notificationStore.warning('Giriş Gerekli', 'Bu sayfaya erişmek için giriş yapmalısınız');
        next('/giris');
        return;
      }
      
      // Role kontrolü
      if (to.meta.roles && to.meta.roles.length > 0) {
        const hasRequiredRole = to.meta.roles.some(role => authStore.hasRole.value(role));
        
        if (!hasRequiredRole) {
          notificationStore.error('Erişim Reddedildi', 'Bu sayfaya erişim yetkiniz bulunmamaktadır');
          next('/403');
          return;
        }
      }
    }
    
    // Login sayfasına authenticated kullanıcı erişmeye çalışıyorsa
    if (to.name === 'Login' && authStore.isAuthenticated) {
      next('/');
      return;
    }
    
    // Page title'ı güncelle
    if (to.meta.title) {
      document.title = `${to.meta.title} - Emlak Portföy Yönetim Sistemi`;
    }
    
    next();
  } catch (error) {
    console.error('Navigation error:', error);
    appStore.reportError(error, { route: to.path, from: from.path });
    notificationStore.systemError(error, 'Sayfa yüklenirken hata oluştu');
    next('/500');
  }
});

router.afterEach((to, from) => {
  const appStore = useAppStore();
  
  // Loading state'i bitir
  appStore.setLoading(false);
  
  // Navigation log
  if (appStore.isLoading) {
    appStore.logMessage('info', 'Navigation completed', {
      to: to.path,
      from: from.path,
      title: to.meta.title
    });
  }
});

// Navigation error handler
router.onError((error) => {
  const appStore = useAppStore();
  const notificationStore = useNotificationStore();
  
  console.error('Router error:', error);
  appStore.reportError(error, 'Router navigation error');
  notificationStore.systemError(error, 'Sayfa yönlendirme hatası');
});

export default router;