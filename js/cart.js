function cartStore() {
  return {
    items: [],
    isCartOpen: false,
    isCheckoutOpen: false,
    feedback: "",
    checkout: {
      name: "",
      phone: "",
      address: "",
      notes: ""
    },
    checkoutTouched: false,

    initCart() {
      try {
        this.items = JSON.parse(localStorage.getItem(CONFIG.CART_STORAGE_KEY) || "[]");
      } catch (error) {
        this.items = [];
      }
    },

    persistCart() {
      localStorage.setItem(CONFIG.CART_STORAGE_KEY, JSON.stringify(this.items));
    },

    openCart() {
      this.isCartOpen = true;
      document.body.classList.add("drawer-open");
      this.refreshIcons();
    },

    closeCart() {
      this.isCartOpen = false;
      document.body.classList.remove("drawer-open");
    },

    openCheckout() {
      if (!this.items.length) return;
      this.checkoutTouched = false;
      this.isCheckoutOpen = true;
      this.refreshIcons();
    },

    closeCheckout() {
      this.isCheckoutOpen = false;
    },

    addToCart(product, variant) {
      if (!variant) {
        this.flash("Selecciona una talla primero.");
        return;
      }

      if (!variant.available || Number(variant.stock) <= 0) {
        this.flash("Esta talla no esta disponible.");
        return;
      }

      const existing = this.items.find((item) => item.productId === product.id && item.variantId === variant.id);

      if (existing) {
        if (existing.quantity >= Number(variant.stock)) {
          this.flash("No hay mas stock para esa talla.");
          return;
        }
        existing.quantity += 1;
      } else {
        this.items.push({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          selectedSize: variant.size,
          variantId: variant.id,
          sku: variant.sku,
          price: Number(variant.price),
          quantity: 1,
          stock: Number(variant.stock)
        });
      }

      this.persistCart();
      this.openCart();
      this.flash(`${product.name} agregado.`);
    },

    incrementItem(item) {
      if (item.quantity >= item.stock) {
        this.flash("Llegaste al stock disponible.");
        return;
      }
      item.quantity += 1;
      this.persistCart();
    },

    decrementItem(item) {
      if (item.quantity <= 1) {
        this.removeItem(item);
        return;
      }
      item.quantity -= 1;
      this.persistCart();
    },

    removeItem(item) {
      this.items = this.items.filter((cartItem) => cartItem.variantId !== item.variantId);
      this.persistCart();
    },

    clearCart() {
      this.items = [];
      this.persistCart();
    },

    cartCount() {
      return this.items.reduce((total, item) => total + Number(item.quantity || 0), 0);
    },

    subtotal(item) {
      return Number(item.price || 0) * Number(item.quantity || 0);
    },

    cartTotal() {
      return this.items.reduce((total, item) => total + this.subtotal(item), 0);
    },

    checkoutValid() {
      return Boolean(
        this.checkout.name.trim() &&
          this.checkout.phone.trim() &&
          this.checkout.address.trim() &&
          this.items.length
      );
    },

    buildWhatsAppMessage() {
      const lines = ["Hola, quiero realizar el siguiente pedido:", ""];

      this.items.forEach((item) => {
        lines.push(`- ${item.name}`);
        lines.push(`  Talla: ${item.selectedSize}`);
        lines.push(`  Cantidad: ${item.quantity}`);
        lines.push(`  Precio: ${formatMoney(item.price)}`);
        lines.push(`  Subtotal: ${formatMoney(this.subtotal(item))}`);
        lines.push("");
      });

      lines.push(`Total: ${formatMoney(this.cartTotal())}`);
      lines.push("");
      lines.push("Cliente:");
      lines.push(this.checkout.name.trim());
      lines.push("");
      lines.push("Telefono:");
      lines.push(this.checkout.phone.trim());
      lines.push("");
      lines.push("Direccion:");
      lines.push(this.checkout.address.trim());
      lines.push("");
      lines.push("Notas:");
      lines.push(this.checkout.notes.trim() || "Sin notas");

      return lines.join("\n");
    },

    sendWhatsAppOrder() {
      this.checkoutTouched = true;
      if (!this.checkoutValid()) return;

      const message = encodeURIComponent(this.buildWhatsAppMessage());
      const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${message}`;
      window.open(url, "_blank", "noopener,noreferrer");
    },

    flash(message) {
      this.feedback = message;
      window.clearTimeout(this.feedbackTimer);
      this.feedbackTimer = window.setTimeout(() => {
        this.feedback = "";
      }, 2200);
    },

    refreshIcons() {
      window.setTimeout(() => {
        if (window.lucide) window.lucide.createIcons();
      }, 0);
    }
  };
}
