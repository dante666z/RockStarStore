function getDriveImageUrl(fileId, size = CONFIG.DRIVE_IMAGE_SIZE) {
  const cleanFileId = String(fileId || "").trim();
  if (!cleanFileId) return CONFIG.PLACEHOLDER_IMAGE;
  return `https://drive.google.com/thumbnail?id=${cleanFileId}&sz=${size}`;
}

function getDriveViewUrl(fileId) {
  const cleanFileId = String(fileId || "").trim();
  if (!cleanFileId) return CONFIG.PLACEHOLDER_IMAGE;
  return `https://drive.google.com/uc?export=view&id=${cleanFileId}`;
}

function formatMoney(value) {
  return new Intl.NumberFormat(CONFIG.LOCALE, {
    style: "currency",
    currency: CONFIG.CURRENCY,
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") return value;
  return String(value).trim().toLowerCase() === "true";
}

function minVariantPrice(product) {
  const variants = product?.variants || [];
  if (!variants.length) return 0;
  return Math.min(...variants.map((variant) => Number(variant.price || 0)));
}

function activeVariants(product) {
  return (product?.variants || []).filter((variant) => variant.available && Number(variant.stock) > 0);
}

function productImage(product) {
  return getDriveImageUrl(product?.image);
}

function onImageError(event) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = CONFIG.PLACEHOLDER_IMAGE;
  event.currentTarget.classList.add("is-default-image");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
