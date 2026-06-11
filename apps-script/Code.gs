const CONFIG = {
  SPREADSHEET_ID: "1P2QnVxyNW8q9TyQRV_2potK_M6mNpD7acqRgPM6wCKQ",
  PRODUCTS_SHEET: "Products",
  COLORS_SHEET: "ProductColors",
  VARIANTS_SHEET: "Variants",
  CACHE_KEY: "PRODUCTS_CACHE_V2",
  CACHE_TIME: 4 * 60 * 60, // 4 horas
  REFRESH_KEY: "rockStar2026"
};

function doGet(e) {
  const cache = CacheService.getScriptCache();

  const shouldRefresh =
    e &&
    e.parameter &&
    String(e.parameter.refresh || "").toLowerCase().trim() === "true";

  const refreshKey =
    e &&
    e.parameter &&
    e.parameter.key
      ? String(e.parameter.key).trim()
      : "";

  const isRefreshAllowed =
    shouldRefresh &&
    (
      !CONFIG.REFRESH_KEY ||
      refreshKey.toLowerCase() === CONFIG.REFRESH_KEY.toLowerCase()
    );
  Logger.log("===== REQUEST INFO =====");
  Logger.log("shouldRefresh: " + shouldRefresh);
  Logger.log("refreshKey recibido: " + refreshKey);
  Logger.log("isRefreshAllowed: " + isRefreshAllowed);

  if (shouldRefresh && !isRefreshAllowed) {
    Logger.log("Refresh solicitado, pero clave inválida o no autorizada.");
  }

  if (isRefreshAllowed) {
    Logger.log("Refresh autorizado. Eliminando caché...");
    cache.remove(CONFIG.CACHE_KEY);
  }

  const cached = cache.get(CONFIG.CACHE_KEY);

  if (cached && !isRefreshAllowed) {
    Logger.log("Respuesta servida desde caché.");

    const cachedData = JSON.parse(cached);

    cachedData.meta = {
      ...(cachedData.meta || {}),
      fromCache: true,
      refreshed: false,
      servedAt: new Date().toISOString()
    };
    
    Logger.log("===== INFO CACHE =====");
    Logger.log("objCache: " + JSON.stringify(cachedData, null, 2));

    return jsonResponse(cachedData);
  }

  try {
    Logger.log("Leyendo datos desde Google Sheets...");

    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

    const productsSheet = ss.getSheetByName(CONFIG.PRODUCTS_SHEET);
    const colorsSheet = ss.getSheetByName(CONFIG.COLORS_SHEET);
    const variantsSheet = ss.getSheetByName(CONFIG.VARIANTS_SHEET);

    if (!productsSheet) {
      throw new Error("No existe la hoja: " + CONFIG.PRODUCTS_SHEET);
    }

    if (!colorsSheet) {
      throw new Error("No existe la hoja: " + CONFIG.COLORS_SHEET);
    }

    if (!variantsSheet) {
      throw new Error("No existe la hoja: " + CONFIG.VARIANTS_SHEET);
    }

    const productsData = getSheetData(productsSheet);
    const colorsData = getSheetData(colorsSheet);
    const variantsData = getSheetData(variantsSheet);

    Logger.log("Productos leídos: " + productsData.length);
    Logger.log("Colores leídos: " + colorsData.length);
    Logger.log("Variantes leídas: " + variantsData.length);

    const products = transformProducts(productsData);
    const colors = transformProductColors(colorsData);
    const variants = transformVariants(variantsData);

    Logger.log("Productos activos transformados: " + products.length);
    Logger.log("Colores activos transformados: " + colors.length);
    Logger.log("Variantes transformadas: " + variants.length);

    const result = buildResponse(products, colors, variants);

    Logger.log("Productos finales: " + result.products.length);
    Logger.log("Productos destacados: " + result.featuredProducts.length);
    Logger.log("Productos home: " + result.homeProducts.length);
    Logger.log("Categorías: " + result.categories.join(", "));
    Logger.log("Advertencias de datos: " + result.dataWarnings.length);

    const response = {
      ...result,
      meta: {
        fromCache: false,
        refreshed: isRefreshAllowed,
        generatedAt: new Date().toISOString(),
        cacheTimeSeconds: CONFIG.CACHE_TIME,
        counts: {
          products: result.products.length,
          colors: result.products.reduce(
            (total, product) => total + product.colors.length,
            0
          ),
          variants: result.products.reduce(
            (total, product) => total + product.variants.length,
            0
          )
        }
      }
    };

    Logger.log("===== INFO SHEETS =====");
    Logger.log("objSHeets: " + JSON.stringify(response, null, 2));

    cache.put(CONFIG.CACHE_KEY, JSON.stringify(response), CONFIG.CACHE_TIME);

    Logger.log("Nueva respuesta guardada en caché.");

    return jsonResponse(response);

  } catch (error) {
    Logger.log("ERROR: " + error.message);

    return jsonResponse({
      error: true,
      message: error.message,
      meta: {
        fromCache: false,
        generatedAt: new Date().toISOString()
      }
    });
  }
}

function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();

  if (!data || data.length < 2) {
    Logger.log("La hoja " + sheet.getName() + " no tiene datos suficientes.");
    return [];
  }

  const headers = data[0].map(header => normalizeHeader(header));
  const rows = data.slice(1);

  return rows
    .filter(row => row.some(cell => cell !== "" && cell !== null))
    .map(row => {
      const obj = {};

      headers.forEach((header, index) => {
        if (!header) return;
        obj[header] = row[index];
      });

      return obj;
    });
}

function transformProducts(products) {
  return products
    .filter(product => {
      const status = String(product.status || "").toLowerCase().trim();
      return status === "active" || status === "activo";
    })
    .map(product => ({
      id: toNumber(product.id),
      slug: toStringValue(product.slug),
      name: toStringValue(product.name),
      description: toStringValue(product.description),
      category: toStringValue(product.category),
      badge: toStringValue(product.badge),
      featured: toBoolean(product.featured),
      featured_order: toNumber(product.featured_order),
      show_home: toBoolean(product.show_home),
      home_order: toNumber(product.home_order),
      status: toStringValue(product.status)
    }))
    .filter(product => product.id);
}

function transformProductColors(colors) {
  return colors
    .filter(color => {
      const status = String(color.status || "").toLowerCase().trim();
      return status === "active" || status === "activo";
    })
    .map(color => ({
      id: toNumber(color.id),
      product_id: toNumber(color.product_id),
      name: toStringValue(color.color),
      hex: toStringValue(color.color_hex),
      order: toNumber(color.color_order),
      back_image: toStringValue(color.back_image),
      front_image: toStringValue(color.front_image),
      status: toStringValue(color.status)
    }))
    .filter(color => color.id && color.product_id);
}

function transformVariants(variants) {
  return variants
    .map(variant => ({
      id: toNumber(variant.id),
      product_id: toNumber(variant.product_id),
      color_id: toNumber(variant.color_id),
      size: toStringValue(variant.size || variant.product_size),
      price: toNumber(variant.price),
      stock: toNumber(variant.stock),
      sku: toStringValue(variant.sku),
      available: toBoolean(variant.available)
    }))
    .filter(variant => variant.id && variant.product_id && variant.color_id);
}

function buildResponse(products, colors, variants) {
  const dataWarnings = [];
  const productById = new Map(products.map(product => [product.id, product]));
  const colorById = new Map(colors.map(color => [color.id, color]));

  colors.forEach(color => {
    if (!productById.has(color.product_id)) {
      dataWarnings.push(
        "Color " + color.id + " referencia product_id inexistente o inactivo: " + color.product_id
      );
    }

    if (!color.back_image && !color.front_image) {
      dataWarnings.push("Color " + color.id + " no tiene imagen trasera ni frontal.");
    }
  });

  variants.forEach(variant => {
    const color = colorById.get(variant.color_id);

    if (!productById.has(variant.product_id)) {
      dataWarnings.push(
        "Variante " + variant.id + " referencia product_id inexistente o inactivo: " + variant.product_id
      );
    }

    if (!color) {
      dataWarnings.push(
        "Variante " + variant.id + " referencia color_id inexistente o inactivo: " + variant.color_id
      );
    } else if (color.product_id !== variant.product_id) {
      dataWarnings.push(
        "Variante " + variant.id + " no coincide con el product_id de su color."
      );
    }
  });

  const productsWithVariants = products.map(product => {
    const productColors = colors
      .filter(color => color.product_id === product.id)
      .sort((a, b) => sortByOrder(a.order, b.order))
      .map(color => {
        const colorVariants = variants
          .filter(variant =>
            variant.product_id === product.id &&
            variant.color_id === color.id
          )
          .sort((a, b) => naturalSort(a.size, b.size))
          .map(variant => ({
            ...variant,
            color: color.name,
            color_hex: color.hex
          }));

        return {
          ...color,
          default_image: color.back_image || color.front_image || "",
          images: buildColorImages(color),
          variants: colorVariants
        };
      });

    const productVariants = productColors.flatMap(color => color.variants);
    const defaultColor = productColors[0] || null;

    return {
      ...product,
      // Compatibilidad temporal con el frontend actual.
      image: defaultColor ? defaultColor.default_image : "",
      default_color_id: defaultColor ? defaultColor.id : 0,
      colors: productColors,
      variants: productVariants
    };
  });

  const featuredProducts = productsWithVariants
    .filter(product => product.featured)
    .sort((a, b) => sortByOrder(a.featured_order, b.featured_order));

  const homeProducts = productsWithVariants
    .filter(product => product.show_home)
    .sort((a, b) => sortByOrder(a.home_order, b.home_order))
    .slice(0, 6);

  const categories = Array.from(
    new Set(
      productsWithVariants
        .map(product => product.category)
        .filter(Boolean)
    )
  ).sort();

  return {
    products: productsWithVariants,
    featuredProducts,
    homeProducts,
    categories,
    dataWarnings
  };
}

function buildColorImages(color) {
  const images = [];

  if (color.back_image) {
    images.push({
      view: "back",
      label: "Espalda",
      image: color.back_image,
      is_default: true
    });
  }

  if (color.front_image) {
    images.push({
      view: "front",
      label: "Frente",
      image: color.front_image,
      is_default: !color.back_image
    });
  }

  return images;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeHeader(header) {
  return String(header || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function toStringValue(value) {
  return value === null || value === undefined
    ? ""
    : String(value).trim();
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const normalized = String(value)
    .replace(",", ".")
    .trim();

  const number = Number(normalized);

  return isNaN(number) ? 0 : number;
}

function toBoolean(value) {
  if (value === true) return true;
  if (value === false) return false;

  const normalized = String(value || "")
    .toLowerCase()
    .trim();

  return [
    "true",
    "1",
    "yes",
    "si",
    "sí",
    "activo",
    "active"
  ].includes(normalized);
}

function sortByOrder(a, b) {
  const orderA = Number(a) || 999999;
  const orderB = Number(b) || 999999;

  return orderA - orderB;
}

function naturalSort(a, b) {
  const order = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  const indexA = order.indexOf(String(a).toUpperCase());
  const indexB = order.indexOf(String(b).toUpperCase());

  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }

  if (indexA !== -1) return -1;
  if (indexB !== -1) return 1;

  return String(a).localeCompare(String(b));
}
