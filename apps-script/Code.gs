const CONFIG = {
  SPREADSHEET_ID: "1P2QnVxyNW8q9TyQRV_2potK_M6mNpD7acqRgPM6wCKQ",
  PRODUCTS_SHEET: "Products",
  VARIANTS_SHEET: "Variants",
  CACHE_KEY: "PRODUCTS_CACHE_V1",
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
    const variantsSheet = ss.getSheetByName(CONFIG.VARIANTS_SHEET);

    if (!productsSheet) {
      throw new Error("No existe la hoja: " + CONFIG.PRODUCTS_SHEET);
    }

    if (!variantsSheet) {
      throw new Error("No existe la hoja: " + CONFIG.VARIANTS_SHEET);
    }

    const productsData = getSheetData(productsSheet);
    const variantsData = getSheetData(variantsSheet);

    Logger.log("Productos leídos: " + productsData.length);
    Logger.log("Variantes leídas: " + variantsData.length);

    const products = transformProducts(productsData);
    const variants = transformVariants(variantsData);

    Logger.log("Productos activos transformados: " + products.length);
    Logger.log("Variantes transformadas: " + variants.length);

    const result = buildResponse(products, variants);

    Logger.log("Productos finales: " + result.products.length);
    Logger.log("Productos destacados: " + result.featuredProducts.length);
    Logger.log("Productos home: " + result.homeProducts.length);
    Logger.log("Categorías: " + result.categories.join(", "));

    const response = {
      ...result,
      meta: {
        fromCache: false,
        refreshed: isRefreshAllowed,
        generatedAt: new Date().toISOString(),
        cacheTimeSeconds: CONFIG.CACHE_TIME
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
      image: toStringValue(product.image),
      badge: toStringValue(product.badge),
      featured: toBoolean(product.featured),
      featured_order: toNumber(product.featured_order),
      show_home: toBoolean(product.show_home),
      home_order: toNumber(product.home_order),
      status: toStringValue(product.status)
    }))
    .filter(product => product.id);
}

function transformVariants(variants) {
  return variants
    .map(variant => ({
      id: toNumber(variant.id),
      product_id: toNumber(variant.product_id),
      size: toStringValue(variant.size || variant.product_size),
      price: toNumber(variant.price),
      stock: toNumber(variant.stock),
      sku: toStringValue(variant.sku),
      available: toBoolean(variant.available)
    }))
    .filter(variant => variant.id && variant.product_id);
}

function buildResponse(products, variants) {
  const productsWithVariants = products.map(product => {
    const productVariants = variants
      .filter(variant => variant.product_id === product.id)
      .sort((a, b) => naturalSort(a.size, b.size));

    return {
      ...product,
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
    categories
  };
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