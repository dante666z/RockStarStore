const MOCK_CATALOG = {
  products: [
    {
      id: "p001",
      slug: "no-excuses",
      name: "No excuses",
      description: "Playera streetwear con corte relajado y grafico frontal.",
      category: "Camisas",
      image: "",
      badge: "Nuevo",
      featured: true,
      featured_order: 1,
      show_home: true,
      home_order: 1,
      status: "active",
      variants: [
        { id: "v001-s", size: "S", price: 20, stock: 5, sku: "NOEX-S", available: true },
        { id: "v001-m", size: "M", price: 20, stock: 8, sku: "NOEX-M", available: true },
        { id: "v001-l", size: "L", price: 20, stock: 0, sku: "NOEX-L", available: true },
        { id: "v001-xl", size: "XL", price: 22, stock: 3, sku: "NOEX-XL", available: true }
      ]
    },
    {
      id: "p002",
      slug: "sad-boyz",
      name: "Sad Boyz",
      description: "Camisa negra de tacto pesado con arte posterior azul.",
      category: "Camisas",
      image: "",
      badge: "Hot",
      featured: true,
      featured_order: 2,
      show_home: true,
      home_order: 2,
      status: "active",
      variants: [
        { id: "v002-s", size: "S", price: 20, stock: 4, sku: "SADB-S", available: true },
        { id: "v002-m", size: "M", price: 20, stock: 2, sku: "SADB-M", available: true },
        { id: "v002-l", size: "L", price: 20, stock: 6, sku: "SADB-L", available: true },
        { id: "v002-xl", size: "XL", price: 20, stock: 0, sku: "SADB-XL", available: false }
      ]
    },
    {
      id: "p003",
      slug: "el-angel-azul",
      name: "El Angel Azul",
      description: "Grafico azul de alto contraste sobre prenda oscura.",
      category: "Camisas",
      image: "",
      badge: "",
      featured: true,
      featured_order: 3,
      show_home: true,
      home_order: 3,
      status: "active",
      variants: [
        { id: "v003-s", size: "S", price: 20, stock: 3, sku: "ANAZ-S", available: true },
        { id: "v003-m", size: "M", price: 20, stock: 3, sku: "ANAZ-M", available: true },
        { id: "v003-l", size: "L", price: 20, stock: 2, sku: "ANAZ-L", available: true },
        { id: "v003-xl", size: "XL", price: 20, stock: 1, sku: "ANAZ-XL", available: true }
      ]
    },
    {
      id: "p004",
      slug: "amiri",
      name: "Amiri",
      description: "Pieza grafica minimalista con angel frontal.",
      category: "Camisas",
      image: "",
      badge: "",
      featured: false,
      featured_order: "",
      show_home: true,
      home_order: 4,
      status: "active",
      variants: [
        { id: "v004-s", size: "S", price: 20, stock: 7, sku: "AMIR-S", available: true },
        { id: "v004-m", size: "M", price: 20, stock: 7, sku: "AMIR-M", available: true },
        { id: "v004-l", size: "L", price: 20, stock: 0, sku: "AMIR-L", available: true },
        { id: "v004-xl", size: "XL", price: 22, stock: 2, sku: "AMIR-XL", available: true }
      ]
    },
    {
      id: "p005",
      slug: "godzilla-drift",
      name: "Godzilla Drift",
      description: "Grafico racing con acentos rojos y azules.",
      category: "Camisas",
      image: "",
      badge: "Drop",
      featured: false,
      featured_order: "",
      show_home: true,
      home_order: 5,
      status: "active",
      variants: [
        { id: "v005-s", size: "S", price: 20, stock: 1, sku: "GODZ-S", available: true },
        { id: "v005-m", size: "M", price: 20, stock: 4, sku: "GODZ-M", available: true },
        { id: "v005-l", size: "L", price: 20, stock: 5, sku: "GODZ-L", available: true },
        { id: "v005-xl", size: "XL", price: 20, stock: 2, sku: "GODZ-XL", available: true }
      ]
    },
    {
      id: "p006",
      slug: "el-azul",
      name: "El Azul",
      description: "Camisa premium con arte posterior azul electrico.",
      category: "Camisas",
      image: "",
      badge: "",
      featured: false,
      featured_order: "",
      show_home: true,
      home_order: 6,
      status: "active",
      variants: [
        { id: "v006-s", size: "S", price: 20, stock: 5, sku: "ELAZ-S", available: true },
        { id: "v006-m", size: "M", price: 20, stock: 5, sku: "ELAZ-M", available: true },
        { id: "v006-l", size: "L", price: 20, stock: 5, sku: "ELAZ-L", available: true },
        { id: "v006-xl", size: "XL", price: 20, stock: 5, sku: "ELAZ-XL", available: true }
      ]
    },
    {
      id: "p007",
      slug: "work-for-your-dreams",
      name: "Work for your dreams",
      description: "Hoodie negro con print posterior oversized.",
      category: "Hoodies",
      image: "",
      badge: "Nuevo",
      featured: false,
      featured_order: "",
      show_home: false,
      home_order: "",
      status: "active",
      variants: [
        { id: "v007-s", size: "S", price: 38, stock: 3, sku: "WORK-S", available: true },
        { id: "v007-m", size: "M", price: 38, stock: 3, sku: "WORK-M", available: true },
        { id: "v007-l", size: "L", price: 40, stock: 2, sku: "WORK-L", available: true },
        { id: "v007-xl", size: "XL", price: 40, stock: 0, sku: "WORK-XL", available: true }
      ]
    },
    {
      id: "p008",
      slug: "deathrow-hoodie",
      name: "Deathrow Hoodie",
      description: "Hoodie claro con grafico rojo de alto impacto.",
      category: "Hoodies",
      image: "",
      badge: "",
      featured: false,
      featured_order: "",
      show_home: false,
      home_order: "",
      status: "active",
      variants: [
        { id: "v008-s", size: "S", price: 38, stock: 2, sku: "DEAT-S", available: true },
        { id: "v008-m", size: "M", price: 38, stock: 4, sku: "DEAT-M", available: true },
        { id: "v008-l", size: "L", price: 40, stock: 2, sku: "DEAT-L", available: true },
        { id: "v008-xl", size: "XL", price: 40, stock: 1, sku: "DEAT-XL", available: true }
      ]
    },
    {
      id: "p009",
      slug: "city-bag",
      name: "City Bag",
      description: "Bolso compacto para uso diario.",
      category: "Bolsos",
      image: "",
      badge: "",
      featured: false,
      featured_order: "",
      show_home: false,
      home_order: "",
      status: "active",
      variants: [
        { id: "v009-u", size: "U", price: 26, stock: 5, sku: "BAG-U", available: true }
      ]
    },
    {
      id: "p010",
      slug: "street-cap",
      name: "Street Cap",
      description: "Accesorio casual con energia Rockstar.",
      category: "Accesorios",
      image: "",
      badge: "",
      featured: false,
      featured_order: "",
      show_home: false,
      home_order: "",
      status: "active",
      variants: [
        { id: "v010-u", size: "U", price: 18, stock: 6, sku: "CAP-U", available: true }
      ]
    }
  ],
  categories: ["Hoodies", "Camisas", "Bolsos", "Sneakers", "Accesorios"],
  meta: {
    fromCache: false,
    refreshed: false,
    generatedAt: new Date().toISOString(),
    cacheTimeSeconds: 14400
  }
};

MOCK_CATALOG.featuredProducts = MOCK_CATALOG.products
  .filter((product) => product.featured)
  .sort((a, b) => Number(a.featured_order || 0) - Number(b.featured_order || 0));

MOCK_CATALOG.homeProducts = MOCK_CATALOG.products
  .filter((product) => product.show_home)
  .sort((a, b) => Number(a.home_order || 0) - Number(b.home_order || 0))
  .slice(0, CONFIG.HOME_PRODUCTS_LIMIT);

MOCK_CATALOG.products.forEach((product, productIndex) => {
  const colorId = `mock-color-${productIndex + 1}`;
  const color = {
    id: colorId,
    product_id: product.id,
    name: "Unico",
    hex: "#111111",
    order: 1,
    back_image: product.image,
    front_image: "",
    default_image: product.image,
    images: product.image
      ? [{ view: "back", label: "Espalda", image: product.image, is_default: true }]
      : [],
    variants: product.variants.map((variant) => ({
      ...variant,
      product_id: product.id,
      color_id: colorId,
      color: "Unico",
      color_hex: "#111111"
    }))
  };

  product.default_color_id = colorId;
  product.colors = [color];
  product.variants = color.variants;
});
