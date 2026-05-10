# RockStar Catalog API

Mini backend en Google Apps Script para publicar el catalogo desde Google Sheets.

## Configuracion

En `Code.gs`, completa:

```js
const CONFIG = {
  SPREADSHEET_ID: "TU_SPREADSHEET_ID",
  PRODUCTS_SHEET: "Products",
  VARIANTS_SHEET: "Variants",
  CACHE_KEY: "PRODUCTS_CACHE_V1",
  CACHE_TIME: 4 * 60 * 60,
  REFRESH_KEY: "rockStar2026"
};
```

El frontend solo necesita la URL `/exec` publicada. El `SPREADSHEET_ID` vive aqui porque Apps Script es quien lee Sheets.

## Endpoints

Normal:

```txt
https://script.google.com/macros/s/.../exec
```

Refresh cache:

```txt
https://script.google.com/macros/s/.../exec?refresh=true&key=rockStar2026
```
