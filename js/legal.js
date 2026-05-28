function legalPage() {
  return {
    ...themeController(),
    mobileMenuOpen: false,

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },

    closeMobileMenu() {
      this.mobileMenuOpen = false;
    }
  };
}
