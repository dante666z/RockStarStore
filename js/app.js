function appStore(page = "home") {
  let featuredCarousel = null;
  let productCarousel = null;
  const mutateCarouselDom = (callback) => {
    if (window.Alpine?.mutateDom) return window.Alpine.mutateDom(callback);
    return callback();
  };

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
    isProductViewerOpen: false,
    activeProduct: null,
    activeColorIndex: 0,
    activeView: "back",
    selectedModalVariant: null,
    productModalTrigger: null,
    productViewerTrigger: null,
    productViewerStandalone: false,
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
      this.initFeaturedCarousel();
      this.initSectionReveals();
    },

    async loadCatalog() {
      this.loading = true;
      this.error = "";
      try {
        const catalog = await fetchCatalog();
        this.products = catalog.products || [];
        this.featuredProducts = catalog.featuredProducts || [];
        this.homeProducts = (catalog.homeProducts?.length ? catalog.homeProducts : this.products).slice(
          0,
          CONFIG.HOME_PRODUCTS_LIMIT
        );
        this.categories = catalog.categories || this.buildCategories(this.products);
      } catch (error) {
        this.error = "No pudimos cargar el catalogo. Intenta de nuevo en un momento.";
      } finally {
        this.loading = false;
        this.$nextTick(() => this.refreshIcons());
      }
    },

    buildCategories(products) {
      return [...new Set(products.map((product) => product.category).filter(Boolean))];
    },

    initFeaturedCarousel() {
      if (this.page !== "home") return;

      this.$nextTick(() => {
        featuredCarousel?.destroy(true);
        featuredCarousel = null;

        if (!window.Splide || !this.$refs.featuredCarousel || !this.featuredProducts.length) return;

        featuredCarousel = new Splide(this.$refs.featuredCarousel, {
          type: "slide",
          perPage: 1,
          perMove: 1,
          rewind: true,
          rewindByDrag: true,
          speed: 620,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          autoplay: this.featuredProducts.length > 1,
          interval: 3200,
          pauseOnHover: true,
          pauseOnFocus: true,
          resetProgress: true,
          arrows: false,
          pagination: this.featuredProducts.length > 1,
          drag: this.featuredProducts.length > 1,
          flickMaxPages: 1,
          keyboard: false,
          label: "Productos destacados"
        });

        mutateCarouselDom(() => featuredCarousel.mount());
      });
    },

    startFeaturedCarousel() {
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      featuredCarousel?.Components?.Autoplay?.play();
    },

    stopFeaturedCarousel() {
      featuredCarousel?.Components?.Autoplay?.pause();
    },

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },

    closeMobileMenu() {
      this.mobileMenuOpen = false;
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
        this.initProductCarousel();
        this.refreshIcons();
      });
    },

    closeProductModal() {
      if (!this.isProductModalOpen) return;
      this.closeProductViewer(false);
      this.destroyProductCarousel();
      this.isProductModalOpen = false;
      this.activeProduct = null;
      this.selectedModalVariant = null;
      document.body.classList.remove("product-modal-open");
      this.startFeaturedCarousel();
      window.setTimeout(() => this.productModalTrigger?.focus?.(), 0);
    },

    openProductViewer(event = null) {
      if (!this.activeProduct || !this.activeColor()) return;
      this.productViewerTrigger = event?.currentTarget || document.activeElement;
      this.productViewerStandalone = false;
      this.showProductViewer();
    },

    openProductViewerFromCard(product, event = null) {
      const colors = productColors(product);
      if (!product || !colors.length) return;
      this.activeProduct = product;
      this.activeColorIndex = Math.max(
        0,
        colors.findIndex((color) => color.id === product.default_color_id)
      );
      this.resetProductView();
      this.productViewerTrigger = event?.currentTarget || document.activeElement;
      this.productViewerStandalone = true;
      this.showProductViewer();
    },

    showProductViewer() {
      this.isProductViewerOpen = true;
      document.body.classList.add("product-viewer-open");
      this.$nextTick(() => {
        this.$refs.productViewerClose?.focus();
        this.refreshIcons();
      });
    },

    closeProductViewer(restoreFocus = true) {
      if (!this.isProductViewerOpen) return;
      this.isProductViewerOpen = false;
      document.body.classList.remove("product-viewer-open");
      const wasStandalone = this.productViewerStandalone;
      this.productViewerStandalone = false;
      if (wasStandalone) {
        this.activeProduct = null;
        this.activeColorIndex = 0;
        this.activeView = "back";
      }
      if (restoreFocus) {
        window.setTimeout(() => this.productViewerTrigger?.focus?.(), 0);
      }
    },

    handleEscape() {
      this.closeMobileMenu();
      if (this.isProductViewerOpen) {
        this.closeProductViewer();
        return;
      }
      this.closeProductModal();
    },

    modalColors() {
      return productColors(this.activeProduct);
    },

    activeColor() {
      return this.modalColors()[this.activeColorIndex] || null;
    },

    selectProductColor(index) {
      if (!this.modalColors()[index]) return;
      if (productCarousel && productCarousel.index !== index) {
        productCarousel.go(index);
        return;
      }
      this.applyProductColor(index);
    },

    applyProductColor(index) {
      if (!this.modalColors()[index] || index === this.activeColorIndex) return;
      this.activeColorIndex = index;
      this.selectedModalVariant = null;
      this.resetProductView();
      this.$nextTick(() => this.refreshIcons());
    },

    initProductCarousel() {
      this.destroyProductCarousel();

      const colors = this.modalColors();
      if (!window.Splide || !this.$refs.productCarousel || !colors.length) return;

      const hasMultipleColors = colors.length > 1;
      productCarousel = new Splide(this.$refs.productCarousel, {
        type: hasMultipleColors ? "loop" : "slide",
        start: this.activeColorIndex,
        perPage: 1,
        perMove: 1,
        padding: "12rem",
        speed: 520,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        arrows: hasMultipleColors,
        pagination: false,
        drag: hasMultipleColors,
        dragMinThreshold: { mouse: 0, touch: 14 },
        flickMaxPages: 1,
        waitForTransition: false,
        noDrag: ".no-drag",
        keyboard: false,
        slideFocus: false,
        label: "Colores del producto",
        breakpoints: {
          640: {
            arrows: false,
            padding: "5rem",
            dragMinThreshold: { mouse: 0, touch: 18 }
          }
        }
      });

      productCarousel.on("moved", (newIndex) => {
        this.applyProductColor(newIndex);
      });
      mutateCarouselDom(() => productCarousel.mount());
      this.refreshIcons();
    },

    destroyProductCarousel() {
      if (productCarousel) {
        mutateCarouselDom(() => productCarousel.destroy(true));
      }
      productCarousel = null;
    },

    nextProductColor() {
      const colors = this.modalColors();
      if (colors.length <= 1) return;
      if (productCarousel) {
        productCarousel.go(">");
        return;
      }
      this.selectProductColor((this.activeColorIndex + 1) % colors.length);
    },

    prevProductColor() {
      const colors = this.modalColors();
      if (colors.length <= 1) return;
      if (productCarousel) {
        productCarousel.go("<");
        return;
      }
      this.selectProductColor((this.activeColorIndex - 1 + colors.length) % colors.length);
    },

    resetProductView() {
      const color = this.activeColor();
      this.activeView = color?.back_image ? "back" : color?.front_image ? "front" : "back";
    },

    canFlipProduct() {
      return this.canFlipColor(this.activeColor());
    },

    canFlipColor(color) {
      return Boolean(color?.back_image && color?.front_image);
    },

    flipProductView() {
      if (!this.canFlipProduct()) return;
      this.activeView = this.activeView === "back" ? "front" : "back";
    },

    colorBackImage(color) {
      return getDriveImageUrl(color?.back_image || color?.front_image);
    },

    colorFrontImage(color) {
      return getDriveImageUrl(color?.front_image || color?.back_image);
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
      if (!this.isProductModalOpen || this.isProductViewerOpen) return;
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
      this.trapFocus(event);
    },

    trapProductViewerFocus(event) {
      if (!this.isProductViewerOpen || event.key !== "Tab") return;
      this.trapFocus(event);
    },

    trapFocus(event) {
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
