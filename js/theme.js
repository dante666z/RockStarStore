function themeController() {
  return {
    theme: CONFIG.THEME_DEFAULT,

    initTheme() {
      const savedTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY);
      this.theme = savedTheme || CONFIG.THEME_DEFAULT;
      this.applyTheme();
    },

    applyTheme() {
      document.documentElement.dataset.theme = this.theme;
      localStorage.setItem(CONFIG.THEME_STORAGE_KEY, this.theme);
    },

    toggleTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      this.applyTheme();
    }
  };
}
