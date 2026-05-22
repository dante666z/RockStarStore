async function fetchCatalog() {
  if (CONFIG.ENABLE_MOCK_DATA || !CONFIG.API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return MOCK_CATALOG;
  }

  const response = await fetch(CONFIG.API_URL, {
    method: "GET",
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Catalog API error: ${response.status}`);
  }

  return response.json();
}
