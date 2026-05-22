function appStore(page = "home") {
  return {
    ...themeController(),
    ...cartStore(),
    page,
    products: [],
    featuredProducts: [],
    homeProducts: [],
    categories: [],
    loading: true,
    error: "",
    selectedCategory: "Todos",
    selectedSize: "Todos",
    selectedVariants: {},
    featuredIndex: 0,
    featuredTimer: null,
    contactTouched: false,
    contactForm: {
      name: "",
      phone: "",
      email: "",
      message: ""
    },

    async init() {
      this.initTheme();
      this.initCart();
      await this.loadCatalog();
      this.startFeaturedCarousel();
      this.initSectionReveals();
    },

    async loadCatalog() {
      this.loading = true;
      this.error = "";
      try {
        const catalog = await fetchCatalog();
        this.products = catalog.products || [];
        this.featuredProducts = catalog.featuredProducts || [];
        this.featuredIndex = 0;
        this.homeProducts = (catalog.homeProducts || []).slice(0, CONFIG.HOME_PRODUCTS_LIMIT);
        this.categories = catalog.categories || this.buildCategories(this.products);
      } catch (error) {
        this.error = "No pudimos cargar el catalogo. Intenta de nuevo en un momento.";
      } finally {
        this.loading = false;
      }
    },

    buildCategories(products) {
      return [...new Set(products.map((product) => product.category).filter(Boolean))];
    },

    startFeaturedCarousel() {
      this.stopFeaturedCarousel();
      if (this.page !== "home" || this.featuredProducts.length <= 1) return;

      this.featuredTimer = window.setInterval(() => {
        this.nextFeatured();
      }, 3200);
    },

    stopFeaturedCarousel() {
      if (!this.featuredTimer) return;
      window.clearInterval(this.featuredTimer);
      this.featuredTimer = null;
    },

    nextFeatured() {
      if (!this.featuredProducts.length) return;
      this.featuredIndex = (this.featuredIndex + 1) % this.featuredProducts.length;
    },

    goToFeatured(index) {
      this.featuredIndex = index;
      this.startFeaturedCarousel();
    },

    featuredTrackStyle() {
      return `transform: translateX(-${this.featuredIndex * 100}%);`;
    },

    initSectionReveals() {
      this.$nextTick(() => {
        const sections = document.querySelectorAll("[data-reveal]");

        if (!("IntersectionObserver" in window)) {
          sections.forEach((section) => section.classList.add("is-visible"));
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            });
          },
          {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px"
          }
        );

        sections.forEach((section) => observer.observe(section));
      });
    },

    contactValid() {
      return Boolean(
        this.contactForm.name.trim() &&
          this.contactForm.phone.trim() &&
          this.contactForm.email.trim() &&
          this.contactForm.message.trim() &&
          this.emailValid(this.contactForm.email)
      );
    },

    emailValid(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
    },

    buildContactMessage() {
      return [
        "Hola, quiero contactar a RockStar Store:",
        "",
        "Nombre:",
        this.contactForm.name.trim(),
        "",
        "Telefono:",
        this.contactForm.phone.trim(),
        "",
        "Correo:",
        this.contactForm.email.trim(),
        "",
        "Mensaje:",
        this.contactForm.message.trim()
      ].join("\n");
    },

    sendContactWhatsApp() {
      this.contactTouched = true;
      if (!this.contactValid()) {
        this.flash("Completa todos los campos de contacto.");
        return;
      }

      const message = encodeURIComponent(this.buildContactMessage());
      const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${message}`;
      window.open(url, "_blank", "noopener,noreferrer");
    },

    availableSizes(product) {
      return (product.variants || []).map((variant) => variant.size);
    },

    allSizes() {
      return [
        ...new Set(
          this.products.flatMap((product) => (product.variants || []).map((variant) => variant.size))
        )
      ];
    },

    categoryOptions() {
      return ["Todos", ...this.categories];
    },

    sizeOptions() {
      return ["Todos", ...this.allSizes()];
    },

    setCategory(category) {
      this.selectedCategory = category;
    },

    setSize(size) {
      this.selectedSize = size;
    },

    clearFilters() {
      this.selectedCategory = "Todos";
      this.selectedSize = "Todos";
    },

    filteredProducts() {
      return this.products.filter((product) => {
        const categoryMatch = this.selectedCategory === "Todos" || product.category === this.selectedCategory;
        const sizeMatch =
          this.selectedSize === "Todos" ||
          (product.variants || []).some(
            (variant) => variant.size === this.selectedSize && variant.available && Number(variant.stock) > 0
          );
        return categoryMatch && sizeMatch;
      });
    },

    selectedVariant(product) {
      const variantId = this.selectedVariants[product.id];
      return (product.variants || []).find((variant) => variant.id === variantId);
    },

    selectVariant(product, variant) {
      if (!variant.available || Number(variant.stock) <= 0) return;
      this.selectedVariants[product.id] = variant.id;
    },

    isVariantSelected(product, variant) {
      return this.selectedVariants[product.id] === variant.id;
    },

    productHasStock(product) {
      return activeVariants(product).length > 0;
    },

    priceLabel(product) {
      return formatMoney(minVariantPrice(product));
    },

    imageFor(product) {
      return productImage(product);
    },

    handleImageError(event) {
      onImageError(event);
    }
  };
}

document.addEventListener("alpine:init", () => {
  Alpine.data("appStore", appStore);
});
