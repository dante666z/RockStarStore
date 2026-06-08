# RockStar Store

Tienda digital mobile-first construida con HTML5, CSS3, Bootstrap 5, JavaScript ES6+ y Alpine.js. Incluye home, tienda separada, catalogo dinamico por color y talla, modal de producto con vistas frente/espalda, carrito persistente, checkout y pedido por WhatsApp.

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

El spreadsheet debe tener exactamente 3 hojas relacionadas:

```txt
Products
└── ProductColors
    └── Variants
```

- `Products` contiene una fila por diseno.
- `ProductColors` contiene los colores y las vistas trasera/frontal.
- `Variants` contiene las combinaciones vendibles de color y talla.

### Products

```txt
id | slug | name | description | category | badge | featured | featured_order | show_home | home_order | status
```

Las imagenes no se almacenan en esta hoja. Frente y espalda pertenecen a un color especifico.

### ProductColors

```txt
id | product_id | color | color_hex | color_order | back_image | front_image | status
```

- `product_id` relaciona el color con `Products`.
- `color_order` determina cual color se muestra primero.
- `back_image` y `front_image` deben contener solamente el ID del archivo de Google Drive.
- Ambas imagenes son opcionales, pero se recomienda cargar por lo menos una.
- La vista trasera tiene prioridad sobre la frontal.

### Variants

```txt
id | product_id | color_id | product_size | price | stock | sku | available
```

- `product_id` relaciona la variante con `Products`.
- `color_id` relaciona la variante con `ProductColors`.
- Cada fila representa una combinacion vendible de producto, color y talla.
- Frente y espalda son vistas del articulo y no generan variantes o SKU separados.
- Apps Script transforma `product_size` a `size` en el JSON final.

## Google Drive

Las imagenes deben estar compartidas como "Cualquier persona con el enlace puede ver".

El frontend construye las miniaturas asi:

```js
https://drive.google.com/thumbnail?id=FILE_ID&sz=w1000
```

Si la miniatura falla, el frontend intenta la URL alternativa construida por `getDriveViewUrl()`:

```js
https://drive.google.com/uc?export=view&id=FILE_ID
```

Las URLs de Drive se centralizan en `getDriveImageUrl()` y `getDriveViewUrl()` dentro de `js/utils.js`.

La prioridad visual es:

```txt
back_image -> front_image -> CONFIG.PLACEHOLDER_IMAGE
```

Si ambas imagenes faltan o fallan al cargar, el frontend usa el placeholder general.

## Apps Script

El mini backend esta en `apps-script/Code.gs`. Usa:

- `SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)`
- hojas `Products`, `ProductColors` y `Variants`
- `CacheService`
- cache de 4 horas
- clave de cache `PRODUCTS_CACHE_V2`
- endpoint normal `/exec`
- endpoint refresh `/exec?refresh=true&key=rockStar2026`

Apps Script agrupa cada diseno con sus colores, imagenes y tallas. El JSON incluye:

- `products`, `featuredProducts` y `homeProducts`
- `colors` dentro de cada producto
- `images` y `variants` dentro de cada color
- arreglo plano `variants` para filtros y precios
- `dataWarnings` para relaciones incorrectas o imagenes faltantes
- `meta.counts` con totales de productos, colores y variantes

Durante la migracion, cada producto conserva un campo `image` calculado desde el primer color para mantener compatibilidad temporal con el frontend actual.

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

Flujo actual:

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

Flujo actual de seleccion:

```txt
card del producto
↓
modal de detalle
↓
seleccion de color
↓
vista trasera / "Voltear playera"
↓
seleccion de talla
↓
carrito y checkout
↓
WhatsApp
```

El modal abre con el primer color configurado y prioriza la imagen trasera. Cuando existen ambas vistas, el boton `Ver frente` / `Ver espalda` ejecuta un giro 3D tipo carta. Al cambiar de color se restablece la vista trasera y se limpia la talla seleccionada.

El carrito usa `rockstar_cart_v2` y guarda color, talla, SKU e imagen principal del color.

## Agregar Productos

1. Agrega el producto en `Products` con `status` igual a `active`.
2. Agrega uno o mas colores en `ProductColors` usando el `product_id`.
3. Sube las imagenes a Google Drive y coloca sus IDs en `back_image` y `front_image`.
4. Define el primer color mediante `color_order`.
5. Agrega las tallas en `Variants` usando `product_id` y `color_id`.
6. Usa `available` como `TRUE` o `FALSE`.
7. Usa el endpoint refresh para regenerar la cache.

Antes de consumir el nuevo endpoint en el frontend, valida:

```json
"counts": {
  "products": 5,
  "colors": 10,
  "variants": 40
}
```

Tambien se espera:

```json
"dataWarnings": []
```

## Desarrollo Local

Puedes abrir `index.html` directamente en el navegador. Si prefieres servidor local:

```bash
python3 -m http.server 8080
```

Luego abre:

```txt
http://localhost:8080
```
