# Notas De Fases - RockStar Store

## Estado Actual

Fase 3 implementada: frontend conectado a Apps Script y catalogo real desde Google Sheets.

Archivos activos principales:

- `index.html`
- `tienda.html`
- `css/theme.css`
- `css/main.css`
- `css/animations.css`
- `js/`
- `assets/diseno/`
- `assets/page/`

## Fase 1 Implementada

- Home estatica.
- Tienda estatica.
- Header full width.
- Logo del footer en header con link a `index.html`.
- Hero full width.
- Banners full width.
- Tienda, Sobre nosotros y Contacto centradas.
- Footer full width.
- Productos estaticos con imagen default `./assets/page/banner_logo.png`.
- Animaciones de entrada por seccion con `data-reveal`.
- En Fase 1 hubo script inline temporal con `IntersectionObserver` en `index.html` y `tienda.html`.

## Fase 2 Implementada

- Carpeta `js/` restaurada desde el stash base funcional.
- `js/config.js` configurado con `ENABLE_MOCK_DATA: true` y `API_URL: ""`.
- `js/utils.js`, `js/theme.js`, `js/mock-data.js`, `js/api.js`, `js/cart.js` y `js/app.js` agregados.
- Alpine.js conectado en `index.html` y `tienda.html`.
- Productos renderizados desde `MOCK_CATALOG`.
- Carrusel automatico de destacados desde `featuredProducts`.
- Filtros funcionales de tienda por categoria y talla.
- Tema claro/oscuro persistente.
- Carrito persistente, checkout modal y pedido por WhatsApp restaurados desde el stash funcional.
- Contacto por WhatsApp en home.
- `IntersectionObserver` inline retirado de `index.html` y `tienda.html`.
- Animaciones centralizadas en `initSectionReveals()` dentro de `js/app.js`.

## Fase 3 Implementada - Conexion Real Con Apps Script

Apps Script ya esta conectado al frontend.

Objetivo completado: reemplazar mock data por catalogo real desde Google Sheets via Apps Script.

Hecho:

1. Apps Script publicado como Web App.
2. `SPREADSHEET_ID` configurado en `apps-script/Code.gs`.
3. Google Sheets confirmado con hojas `Products` y `Variants`.
4. Endpoint `/exec` probado correctamente en Postman.
5. URL `/exec` colocada en `js/config.js`.
6. `ENABLE_MOCK_DATA` cambiado a `false`.
7. Apps Script compatible con `variant.size || variant.product_size`.

Endpoint publicado:

```txt
https://script.google.com/macros/s/AKfycbxJJ3cqk2NY7pcOqQEktkamIz-4G7CRp8bGDKCb9EztDZPi-68jaDPgiyqzmTfkNuNZrQ/exec
```

Configuracion actual:

```js
ENABLE_MOCK_DATA: false
API_URL: "https://script.google.com/macros/s/AKfycbxJJ3cqk2NY7pcOqQEktkamIz-4G7CRp8bGDKCb9EztDZPi-68jaDPgiyqzmTfkNuNZrQ/exec"
```

Pendiente de validacion visual: probar home, tienda, categorias, variantes, stock, destacados, home products, imagenes de Drive y pedido por WhatsApp con datos reales.

## Fase 4 Pendiente - Pulido Visual Y UX

Objetivo: refinar la experiencia final despues de confirmar datos reales.

SEO tecnico base implementado:

- Meta robots, theme color y color scheme.
- Open Graph y Twitter Card base.
- JSON-LD en home y tienda.
- `robots.txt`.
- Documento `SEO_ENTREGA.md` con pendientes al tener dominio final.

Pendientes sugeridos:

1. Revisar dark mode completo en home, tienda, carrito y checkout.
2. Usar logos blancos reales para header/footer si se agregan assets dedicados.
3. Pulir microinteracciones de carrito, checkout, filtros y botones.
4. Mejorar validaciones visibles en formularios.
5. Agregar estado activo de navegacion.
6. Revisar responsive fino en mobile, tablet y desktop ancho.
7. Completar canonical, sitemap y URLs absolutas cuando exista dominio final.
8. Completar enlaces reales de politicas, terminos y redes sociales.
9. Revisar accesibilidad basica: labels, focus states, contraste y navegacion por teclado.

## Fase 5 Propuesta - Colores Por Diseno Y Modal De Producto

Objetivo: permitir que cada diseno/producto tenga varias opciones de color, cada una con su imagen correspondiente, y que el cliente seleccione color + talla antes de agregar al carrito.

Nota importante de negocio:

- Actualmente el stock no se actualiza automaticamente desde el sitio al cerrar pedidos por WhatsApp.
- Por ahora el stock seguira siendo un dato informativo/de disponibilidad cargado desde Sheets.
- La seleccion real para el carrito debe basarse en la combinacion `color + talla`, pero sin descontar inventario automaticamente.

Modelo recomendado en Google Sheets:

1. Mantener hoja `Products` como el diseno base:
   - `id`
   - `slug`
   - `name`
   - `description`
   - `category`
   - `image` como imagen base que se ve en cards de home/tienda
   - `badge`
   - `featured`
   - `featured_order`
   - `show_home`
   - `home_order`
   - `status`
2. Extender hoja `Variants` para que cada fila represente una combinacion vendible:
   - `id`
   - `product_id`
   - `color`
   - `color_hex`
   - `color_order`
   - `image` imagen especifica de ese color
   - `size`
   - `price`
   - `stock` informativo
   - `sku`
   - `available`

Ejemplo de `Variants`:

```txt
id | product_id | color | color_hex | color_order | image | size | price | stock | sku | available
101 | 1 | Blanco | #ffffff | 1 | drive_id_blanco | S | 35 | 4 | ASSC-BLA-S | true
102 | 1 | Blanco | #ffffff | 1 | drive_id_blanco | M | 35 | 2 | ASSC-BLA-M | true
103 | 1 | Negro | #050505 | 2 | drive_id_negro | S | 35 | 5 | ASSC-NEG-S | true
```

Cambios necesarios en Apps Script:

1. Actualizar `transformVariants()` para leer `color`, `color_hex`, `color_order` e `image`.
2. Mantener compatibilidad si faltan datos:
   - Si no hay `color`, usar `Default` o `Unico`.
   - Si no hay `color_hex`, dejar vacio o usar un color neutro.
   - Si no hay `image` en la variante, usar `product.image`.
3. En `buildResponse()`, ademas de `variants`, construir `product.colors`.
4. Agrupar colores por `product_id + color`.
5. Ordenar colores por `color_order`.
6. Dentro de cada color, ordenar tallas con `naturalSort`.
7. Probar el endpoint `/exec?refresh=true&key=...` para limpiar cache despues del cambio.

Forma esperada del JSON para el frontend:

```js
{
  id: 1,
  name: "Antisocial Social Club",
  image: "drive_id_base",
  variants: [
    {
      id: 101,
      color: "Blanco",
      color_hex: "#ffffff",
      color_order: 1,
      image: "drive_id_blanco",
      size: "S",
      price: 35,
      stock: 4,
      sku: "ASSC-BLA-S",
      available: true
    }
  ],
  colors: [
    {
      name: "Blanco",
      hex: "#ffffff",
      order: 1,
      image: "drive_id_blanco",
      variants: []
    }
  ]
}
```

Cambios necesarios en frontend:

1. Cambiar cards de producto:
   - Mostrar imagen base del producto.
   - Cambiar accion principal de `Agregar` a `Ver mas` cuando el producto tenga colores/opciones.
   - Mantener precio minimo con `priceLabel(product)`.
2. Crear modal de producto:
   - Imagen principal del color seleccionado.
   - Carrusel controlado con flechas izquierda/derecha.
   - Selector de color con swatches usando `color_hex`.
   - Selector de talla filtrado por el color actual.
   - Boton `Agregar al carrito` deshabilitado hasta seleccionar color + talla.
3. Estado nuevo sugerido en `js/app.js`:
   - `isProductModalOpen`
   - `activeProduct`
   - `activeColorIndex`
   - `selectedModalVariant`
4. Funciones nuevas sugeridas:
   - `openProductModal(product)`
   - `closeProductModal()`
   - `productColors(product)`
   - `activeColor()`
   - `nextProductColor()`
   - `prevProductColor()`
   - `selectProductColor(index)`
   - `selectModalVariant(variant)`
   - `addModalSelectionToCart()`
5. Ajustar filtros de talla:
   - El filtro por talla debe revisar variantes disponibles, sin importar color.
   - Si se decide filtrar tambien por color mas adelante, se agregaria un filtro nuevo.
6. Actualizar `js/mock-data.js` con ejemplos que incluyan colores para poder probar sin API real.
7. Actualizar `js/utils.js` si se necesita:
   - Imagen de producto base.
   - Imagen por color.
   - Precio minimo considerando todas las variantes.

Cambios necesarios en carrito y WhatsApp:

1. Ajustar `addToCart(product, variant)` para guardar:
   - `selectedColor`
   - `selectedColorHex`
   - `selectedSize`
   - `image` de la variante/color seleccionado
   - `sku`
2. Seguir agrupando por `variantId`, porque cada variante representa color + talla.
3. Mostrar color en el drawer del carrito.
4. Mostrar color en el resumen del checkout.
5. Incluir color en el mensaje de WhatsApp:

```txt
- Antisocial Social Club
  Color: Negro
  Talla: M
  Cantidad: 1
  Precio: USD 35.00
```

Orden recomendado de implementacion:

1. Preparar columnas nuevas en Google Sheets.
2. Cargar 1 o 2 productos de prueba con varios colores.
3. Actualizar Apps Script y validar JSON.
4. Actualizar `mock-data.js` para pruebas locales.
5. Crear modal de producto y flujo de seleccion color + talla.
6. Cambiar cards de home/tienda para abrir modal.
7. Ajustar carrito y WhatsApp para incluir color.
8. Probar tema claro/oscuro, responsive, home, tienda, carrito y checkout.
9. Hacer prueba completa con endpoint real y cache refresh.

## Stash Base

Existe un stash:

```txt
stash@{0}: base funcional sin conexion con appscript
```

Contiene:

- `index.html`
- `tienda.html`
- `js/api.js`
- `js/app.js`
- `js/cart.js`
- `js/config.js`
- `js/mock-data.js`
- `js/theme.js`
- `js/utils.js`

## Configuracion Actual

Fase 3 trabaja con:

```js
ENABLE_MOCK_DATA: false
API_URL: "https://script.google.com/macros/s/AKfycbxJJ3cqk2NY7pcOqQEktkamIz-4G7CRp8bGDKCb9EztDZPi-68jaDPgiyqzmTfkNuNZrQ/exec"
```
