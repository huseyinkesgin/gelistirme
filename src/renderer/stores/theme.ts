import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'amber' | 'blue' | 'green' | 'purple' | 'red';

interface ThemeConfig {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  fontSize: 'sm' | 'base' | 'lg';
  compactMode: boolean;
  animations: boolean;
  highContrast: boolean;
}

export const useThemeStore = defineStore('theme', () => {
  // State
  const config = ref<ThemeConfig>({
    mode: 'light',
    colorScheme: 'amber',
    fontSize: 'base',
    compactMode: false,
    animations: true,
    highContrast: false
  });

  // Getters
  const isDark = computed(() => {
    if (config.value.mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return config.value.mode === 'dark';
  });

  const currentTheme = computed(() => ({
    ...config.value,
    isDark: isDark.value
  }));

  const cssVariables = computed(() => {
    const scheme = config.value.colorScheme;
    const dark = isDark.value;
    
    // Color schemes
    const colors = {
      amber: {
        primary: dark ? '#fbbf24' : '#f59e0b',
        primaryHover: dark ? '#f59e0b' : '#d97706',
        primaryLight: dark ? '#fef3c7' : '#fffbeb',
        secondary: dark ? '#6b7280' : '#9ca3af',
        accent: dark ? '#10b981' : '#059669'
      },
      blue: {
        primary: dark ? '#3b82f6' : '#2563eb',
        primaryHover: dark ? '#2563eb' : '#1d4ed8',
        primaryLight: dark ? '#dbeafe' : '#eff6ff',
        secondary: dark ? '#6b7280' : '#9ca3af',
        accent: dark ? '#10b981' : '#059669'
      },
      green: {
        primary: dark ? '#10b981' : '#059669',
        primaryHover: dark ? '#059669' : '#047857',
        primaryLight: dark ? '#d1fae5' : '#ecfdf5',
        secondary: dark ? '#6b7280' : '#9ca3af',
        accent: dark ? '#f59e0b' : '#d97706'
      },
      purple: {
        primary: dark ? '#8b5cf6' : '#7c3aed',
        primaryHover: dark ? '#7c3aed' : '#6d28d9',
        primaryLight: dark ? '#e9d5ff' : '#f3e8ff',
        secondary: dark ? '#6b7280' : '#9ca3af',
        accent: dark ? '#f59e0b' : '#d97706'
      },
      red: {
        primary: dark ? '#ef4444' : '#dc2626',
        primaryHover: dark ? '#dc2626' : '#b91c1c',
        primaryLight: dark ? '#fecaca' : '#fef2f2',
        secondary: dark ? '#6b7280' : '#9ca3af',
        accent: dark ? '#10b981' : '#059669'
      }
    };

    const selectedColors = colors[scheme];
    
    return {
      '--color-primary': selectedColors.primary,
      '--color-primary-hover': selectedColors.primaryHover,
      '--color-primary-light': selectedColors.primaryLight,
      '--color-secondary': selectedColors.secondary,
      '--color-accent': selectedColors.accent,
      '--font-size-base': config.value.fontSize === 'sm' ? '14px' : 
                         config.value.fontSize === 'lg' ? '18px' : '16px',
      '--spacing-unit': config.value.compactMode ? '0.75rem' : '1rem',
      '--animation-duration': config.value.animations ? '0.2s' : '0s'
    };
  });

  // Actions
  const setMode = (mode: ThemeMode) => {
    config.value.mode = mode;
    applyTheme();
  };

  const setColorScheme = (scheme: ColorScheme) => {
    config.value.colorScheme = scheme;
    applyTheme();
  };

  const setFontSize = (size: 'sm' | 'base' | 'lg') => {
    config.value.fontSize = size;
    applyTheme();
  };

  const setCompactMode = (compact: boolean) => {
    config.value.compactMode = compact;
    applyTheme();
  };

  const setAnimations = (enabled: boolean) => {
    config.value.animations = enabled;
    applyTheme();
  };

  const setHighContrast = (enabled: boolean) => {
    config.value.highContrast = enabled;
    applyTheme();
  };

  const toggleMode = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(config.value.mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  const applyTheme = () => {
    const root = document.documentElement;
    
    // Dark mode class
    if (isDark.value) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // High contrast class
    if (config.value.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Compact mode class
    if (config.value.compactMode) {
      root.classList.add('compact');
    } else {
      root.classList.remove('compact');
    }
    
    // Animations class
    if (!config.value.animations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
    
    // CSS variables
    Object.entries(cssVariables.value).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Color scheme class
    root.className = root.className.replace(/color-scheme-\w+/g, '');
    root.classList.add(`color-scheme-${config.value.colorScheme}`);
    
    // Font size class
    root.className = root.className.replace(/font-size-\w+/g, '');
    root.classList.add(`font-size-${config.value.fontSize}`);
  };

  const loadTheme = () => {
    try {
      const saved = localStorage.getItem('theme-config');
      if (saved) {
        const savedConfig = JSON.parse(saved);
        config.value = { ...config.value, ...savedConfig };
      }
    } catch (error) {
      console.error('Theme load error:', error);
    }
    applyTheme();
  };

  const saveTheme = () => {
    try {
      localStorage.setItem('theme-config', JSON.stringify(config.value));
    } catch (error) {
      console.error('Theme save error:', error);
    }
  };

  const resetTheme = () => {
    config.value = {
      mode: 'light',
      colorScheme: 'amber',
      fontSize: 'base',
      compactMode: false,
      animations: true,
      highContrast: false
    };
    applyTheme();
    saveTheme();
  };

  const getPresetThemes = () => {
    return [
      {
        name: 'Varsayılan',
        config: {
          mode: 'light' as ThemeMode,
          colorScheme: 'amber' as ColorScheme,
          fontSize: 'base' as const,
          compactMode: false,
          animations: true,
          highContrast: false
        }
      },
      {
        name: 'Koyu Tema',
        config: {
          mode: 'dark' as ThemeMode,
          colorScheme: 'amber' as ColorScheme,
          fontSize: 'base' as const,
          compactMode: false,
          animations: true,
          highContrast: false
        }
      },
      {
        name: 'Mavi Tema',
        config: {
          mode: 'light' as ThemeMode,
          colorScheme: 'blue' as ColorScheme,
          fontSize: 'base' as const,
          compactMode: false,
          animations: true,
          highContrast: false
        }
      },
      {
        name: 'Kompakt',
        config: {
          mode: 'light' as ThemeMode,
          colorScheme: 'amber' as ColorScheme,
          fontSize: 'sm' as const,
          compactMode: true,
          animations: true,
          highContrast: false
        }
      },
      {
        name: 'Yüksek Kontrast',
        config: {
          mode: 'light' as ThemeMode,
          colorScheme: 'amber' as ColorScheme,
          fontSize: 'lg' as const,
          compactMode: false,
          animations: false,
          highContrast: true
        }
      }
    ];
  };

  const applyPreset = (preset: any) => {
    config.value = { ...preset.config };
    applyTheme();
    saveTheme();
  };

  // Watch for system theme changes
  const setupSystemThemeWatcher = () => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (config.value.mode === 'system') {
          applyTheme();
        }
      });
    }
  };

  // Watch for config changes and save
  watch(config, saveTheme, { deep: true });

  // Initialize
  const initialize = () => {
    loadTheme();
    setupSystemThemeWatcher();
  };

  return {
    // State
    config,
    
    // Getters
    isDark,
    currentTheme,
    cssVariables,
    
    // Actions
    setMode,
    setColorScheme,
    setFontSize,
    setCompactMode,
    setAnimations,
    setHighContrast,
    toggleMode,
    applyTheme,
    loadTheme,
    saveTheme,
    resetTheme,
    getPresetThemes,
    applyPreset,
    initialize
  };
});