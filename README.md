# RockStar Store

Tienda digital mobile-first construida con HTML5, CSS3, Bootstrap 5, JavaScript ES6+ y Alpine.js. Incluye home, tienda separada, catalogo dinamico, variantes por talla, carrito persistente, checkout modal y pedido por WhatsApp.

## Estructura

```txt
index.html
tienda.html
assets/
  diseno/
  page/
css/
js/
data/
apps-script/
```

## Configuracion Frontend

Edita `js/config.js`:

```js
const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbxJJ3cqk2NY7pcOqQEktkamIz-4G7CRp8bGDKCb9EztDZPi-68jaDPgiyqzmTfkNuNZrQ/exec",
  WHATSAPP_NUMBER: "13238023749",
  STORE_NAME: "RockStar Store",
  CURRENCY: "USD",
  LOCALE: "es-MX",
  THEME_DEFAULT: "light",
  ENABLE_MOCK_DATA: false,
  ASSETS_BASE_PATH: "./assets/page",
  PLACEHOLDER_IMAGE: "./assets/page/banner_logo.png",
  DRIVE_IMAGE_SIZE: "w1000"
};
```

Actualmente la tienda usa el catalogo real desde Apps Script. Si necesitas trabajar sin conexion al backend, cambia temporalmente `ENABLE_MOCK_DATA` a `true` y `API_URL` a `""`.

## WhatsApp

El checkout no procesa pagos. El modal construye el pedido y abre:

```txt
https://wa.me/NUMERO?text=MENSAJE
```

El mensaje se codifica con `encodeURIComponent` e incluye productos, talla, cantidad, precio, subtotal, total, cliente, telefono, direccion y notas.

## Google Sheets

El spreadsheet debe tener exactamente 2 hojas.

### Products

```txt
id | slug | name | description | category | image | badge | featured | featured_order | show_home | home_order | status
```

`image` debe ser solo el ID del archivo de Google Drive.

### Variants

```txt
id | product_id | product_size | price | stock | sku | available
```

Apps Script transforma `product_size` a `size` en el JSON final.

## Google Drive

Las imagenes deben estar compartidas como "Cualquier persona con el enlace puede ver".

El frontend construye thumbnails asi:

```js
https://drive.google.com/thumbnail?id=FILE_ID&sz=w1000
```

Si una imagen de Drive falta, viene vacia o falla al cargar, se usa `CONFIG.PLACEHOLDER_IMAGE` como imagen default del producto.

## Apps Script

El mini backend esta en `apps-script/Code.gs`. Usa:

- `SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)`
- `CacheService`
- cache de 4 horas
- endpoint normal `/exec`
- endpoint refresh `/exec?refresh=true&key=rockStar2026`

URL publicada:

```txt
https://script.google.com/macros/s/AKfycbxJJ3cqk2NY7pcOqQEktkamIz-4G7CRp8bGDKCb9EztDZPi-68jaDPgiyqzmTfkNuNZrQ/exec
```

Refresh cache:

```txt
https://script.google.com/macros/s/AKfycbxJJ3cqk2NY7pcOqQEktkamIz-4G7CRp8bGDKCb9EztDZPi-68jaDPgiyqzmTfkNuNZrQ/exec?refresh=true&key=rockStar2026
```

Esta URL `/exec` es la que usa `CONFIG.API_URL`; `ENABLE_MOCK_DATA` queda en `false` para consumir el catalogo real.

El `SPREADSHEET_ID` se configura en Apps Script, no en el frontend.

## Flujo

```txt
index.html
↓
tienda.html
↓
filtros por categoria/talla
↓
seleccion de variante
↓
drawer carrito
↓
modal checkout
↓
WhatsApp
```

## Agregar Productos

1. Agrega el producto en `Products` con `status` igual a `active`.
2. Sube la imagen a Google Drive y pega solo el ID en `image`.
3. Agrega variantes en `Variants` usando `product_id`.
4. Usa `available` como `TRUE` o `FALSE`.
5. Usa el endpoint refresh para regenerar cache.

## Desarrollo Local

Puedes abrir `index.html` directamente en el navegador. Si prefieres servidor local:

```bash
python3 -m http.server 8080
```

Luego abre:

```txt
http://localhost:8080
```
