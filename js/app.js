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
    isProductModalOpen: false,
    activeProduct: null,
    activeColorIndex: 0,
    activeView: "back",
    selectedModalVariant: null,
    productModalTrigger: null,
    featuredIndex: 0,
    featuredTimer: null,
    mobileMenuOpen: false,
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
        this.homeProducts = (catalog.homeProducts?.length ? catalog.homeProducts : this.products).slice(
          0,
          CONFIG.HOME_PRODUCTS_LIMIT
        );
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

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },

    closeMobileMenu() {
      this.mobileMenuOpen = false;
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

        window.setTimeout(() => {
          sections.forEach((section) => {
            if (!section.classList.contains("is-visible")) {
              section.classList.add("is-visible");
              observer.unobserve(section);
            }
          });
        }, 1200);
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

    openProductModal(product, event = null) {
      if (!product) return;
      this.activeProduct = product;
      this.activeColorIndex = Math.max(
        0,
        productColors(product).findIndex((color) => color.id === product.default_color_id)
      );
      this.selectedModalVariant = null;
      this.resetProductView();
      this.productModalTrigger = event?.currentTarget || document.activeElement;
      this.isProductModalOpen = true;
      document.body.classList.add("product-modal-open");
      this.stopFeaturedCarousel();
      this.$nextTick(() => {
        this.$refs.productModalClose?.focus();
        this.refreshIcons();
      });
    },

    closeProductModal() {
      if (!this.isProductModalOpen) return;
      this.isProductModalOpen = false;
      this.activeProduct = null;
      this.selectedModalVariant = null;
      document.body.classList.remove("product-modal-open");
      this.startFeaturedCarousel();
      window.setTimeout(() => this.productModalTrigger?.focus?.(), 0);
    },

    modalColors() {
      return productColors(this.activeProduct);
    },

    activeColor() {
      return this.modalColors()[this.activeColorIndex] || null;
    },

    selectProductColor(index) {
      if (!this.modalColors()[index] || index === this.activeColorIndex) return;
      this.activeColorIndex = index;
      this.selectedModalVariant = null;
      this.resetProductView();
    },

    nextProductColor() {
      const colors = this.modalColors();
      if (colors.length <= 1) return;
      this.selectProductColor((this.activeColorIndex + 1) % colors.length);
    },

    prevProductColor() {
      const colors = this.modalColors();
      if (colors.length <= 1) return;
      this.selectProductColor((this.activeColorIndex - 1 + colors.length) % colors.length);
    },

    adjacentColor(offset) {
      const colors = this.modalColors();
      if (colors.length <= 1) return null;
      return colors[(this.activeColorIndex + offset + colors.length) % colors.length];
    },

    resetProductView() {
      const color = this.activeColor();
      this.activeView = color?.back_image ? "back" : color?.front_image ? "front" : "back";
    },

    canFlipProduct() {
      const color = this.activeColor();
      return Boolean(color?.back_image && color?.front_image);
    },

    flipProductView() {
      if (!this.canFlipProduct()) return;
      this.activeView = this.activeView === "back" ? "front" : "back";
    },

    modalBackImage() {
      const color = this.activeColor();
      return getDriveImageUrl(color?.back_image || color?.front_image);
    },

    modalFrontImage() {
      const color = this.activeColor();
      return getDriveImageUrl(color?.front_image || color?.back_image);
    },

    colorPreviewImage(color) {
      return getDriveImageUrl(colorDefaultImage(color));
    },

    modalVariants() {
      return this.activeColor()?.variants || [];
    },

    selectModalVariant(variant) {
      if (!variant?.available || Number(variant.stock) <= 0) return;
      this.selectedModalVariant = variant;
    },

    isModalVariantSelected(variant) {
      return this.selectedModalVariant?.id === variant.id;
    },

    modalPriceLabel() {
      if (this.selectedModalVariant) return formatMoney(this.selectedModalVariant.price);
      const variants = this.modalVariants();
      if (!variants.length) return formatMoney(0);
      return formatMoney(Math.min(...variants.map((variant) => Number(variant.price || 0))));
    },

    addModalSelectionToCart() {
      if (!this.activeProduct || !this.selectedModalVariant) {
        this.flash("Selecciona una talla primero.");
        return;
      }

      this.addToCart(this.activeProduct, this.selectedModalVariant, this.activeColor());
      this.closeProductModal();
    },

    handleProductModalKey(event) {
      if (!this.isProductModalOpen) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        this.nextProductColor();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        this.prevProductColor();
      }
    },

    trapProductModalFocus(event) {
      if (!this.isProductModalOpen || event.key !== "Tab") return;
      const modal = event.currentTarget;
      const focusable = [...modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )].filter((element) => element.offsetParent !== null);

      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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
