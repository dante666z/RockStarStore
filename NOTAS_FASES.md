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

## Fase 5 Propuesta Reformulada - Productos, Colores, Vistas Y Tallas

Estado: Apps Script y frontend implementados. Pendiente validacion visual y funcional completa.

Objetivo: convertir el catalogo actual, donde frente, espalda y color aparecen como productos separados, en un modelo donde cada diseno sea un solo producto y pueda tener tantos colores y tallas como sean necesarios. Cada color podra tener una imagen trasera y una frontal opcionales.

### Reglas De Negocio Acordadas

1. Un producto representa un diseno, por ejemplo `Dead or Alive`.
2. Un producto puede tener una cantidad abierta de colores.
3. Cada color puede tener una cantidad abierta de tallas.
4. Cada color puede tener:
   - Imagen trasera y frontal.
   - Solo imagen trasera.
   - Solo imagen frontal.
5. La imagen trasera tiene prioridad visual.
6. Si no existe imagen trasera, se muestra la imagen frontal.
7. Si no existe ninguna de las dos, se usa el placeholder general del sitio.
8. Frente y espalda son vistas del mismo articulo, no variantes vendibles y no generan SKU o stock independiente.
9. La variante vendible se define por la combinacion `producto + color + talla`.
10. Al cambiar de color en el modal se vuelve a mostrar primero la vista trasera disponible.
11. La opcion `Voltear playera` solo aparece cuando el color tiene imagen trasera y frontal.
12. El stock seguira siendo informativo porque los pedidos se cierran por WhatsApp y el sitio no lo descuenta automaticamente.

Esquema funcional:

```txt
Producto: Dead or Alive
│
├── Color 1: Negro (primer color configurado)
│   ├── Vista principal: Imagen trasera
│   │   └── Si no existe, usar Imagen frontal
│   ├── Opcion "Voltear playera": Imagen frontal
│   └── Tallas: S, M, L, XL... sin limite fijo
│
├── Color 2: Gris
│   ├── Vista principal: Imagen trasera
│   ├── Opcion "Voltear playera": Imagen frontal
│   └── Tallas: S, M, L, XL... sin limite fijo
│
└── Colores adicionales
    └── Se pueden agregar tantos colores y tallas como se requieran
```

### Fase 5.1 - Preparacion Y Respaldo De Datos

Objetivo: proteger el catalogo actual y preparar una migracion controlada.

Tareas:

1. Crear un respaldo del Google Sheets actual.
2. Conservar temporalmente las hojas `Products` y `Variants` existentes.
3. Crear la nueva hoja `ProductColors`.
4. Identificar cuales filas actuales pertenecen al mismo diseno.
5. Preparar primero uno o dos productos de prueba antes de migrar todo el catalogo.
6. Confirmar los nombres comerciales, colores, codigos hexadecimales y orden de aparicion con el cliente.

Criterio de cierre:

- Existe respaldo del Sheet.
- Se identificaron los productos duplicados por frente, espalda y color.
- Hay al menos un producto de prueba listo para migrar.

### Fase 5.2 - Nuevo Modelo En Google Sheets

Objetivo: separar claramente producto, color, imagenes y variantes vendibles.

Hoja `Products`: una fila por diseno.

```txt
id | slug | name | description | category | badge | featured | featured_order | show_home | home_order | status
```

- Las imagenes comerciales no se guardan en `Products`.
- Si un color no tiene imagen trasera ni frontal, el frontend usa el placeholder general del sitio.

Hoja `ProductColors`: una fila por color de cada producto.

```txt
id | product_id | color | color_hex | color_order | back_image | front_image | status
```

- `back_image` contiene el ID de Drive de la vista trasera.
- `front_image` contiene el ID de Drive de la vista frontal.
- Ambas imagenes son opcionales, pero se recomienda cargar por lo menos una.
- `color_order` define el primer color mostrado en cards y modal.

Hoja `Variants`: una fila por combinacion vendible de color y talla.

```txt
id | product_id | color_id | product_size | price | stock | sku | available
```

- `color_id` relaciona la talla con una fila de `ProductColors`.
- Cada SKU representa una combinacion de color y talla.
- Las vistas frente y espalda no forman parte del SKU.

Ejemplo:

```txt
Products
1 | dead-or-alive | Dead or Alive | ... | Camisas | | Nuevo | TRUE | 1 | TRUE | 1 | active

ProductColors
1 | 1 | Negro | #111111 | 1 | drive_back_black | drive_front_black | active
2 | 1 | Gris  | #808080 | 2 | drive_back_grey  | drive_front_grey  | active

Variants
1 | 1 | 1 | S | 20 | 10 | DOA-BLK-S | TRUE
2 | 1 | 1 | M | 20 | 10 | DOA-BLK-M | TRUE
3 | 1 | 2 | S | 20 | 10 | DOA-GRY-S | TRUE
```

Criterio de cierre:

- Cada diseno existe una sola vez en `Products`.
- Sus colores estan relacionados mediante `ProductColors`.
- Sus tallas, precios, stock y SKU estan relacionados mediante `Variants`.

### Fase 5.3 - Migracion Del Catalogo Actual

Objetivo: consolidar las filas actuales sin perder imagenes o variantes.

Tareas:

1. Convertir registros como `Dead or Alive Back Black` y `Dead or Alive Front Black` en un solo producto y un solo color.
2. Mover los IDs de Drive actuales a `back_image` o `front_image`.
3. Repetir el proceso para todos los colores del mismo diseno.
4. Reasignar las variantes existentes al nuevo `product_id` y `color_id`.
5. Actualizar SKU para que representen solo diseno, color y talla.
6. Verificar que no existan IDs duplicados o variantes huerfanas.
7. Mantener el catalogo actual publicado hasta que la nueva API y el frontend esten listos.

Ejemplo de consolidacion:

```txt
Antes:
- Dead or Alive Back Black
- Dead or Alive Front Black
- Dead or Alive Back Grey
- Dead or Alive Front Grey

Despues:
- Producto: Dead or Alive
  - Negro: back_image + front_image
  - Gris: back_image + front_image
```

Criterio de cierre:

- Todos los archivos de Drive estan asociados al color y vista correctos.
- Ningun frente o espalda permanece como producto independiente.
- Las variantes conservan precio, talla, stock y disponibilidad.

### Fase 5.4 - Actualizacion De Apps Script Y JSON

Objetivo: entregar al frontend productos agrupados con colores, vistas y tallas.

Tareas:

1. Agregar `COLORS_SHEET: "ProductColors"` a la configuracion.
2. Crear `transformProductColors()`.
3. Mantener `Products` sin campos de imagen.
4. Actualizar `transformVariants()` para leer `color_id`.
5. Relacionar datos mediante `product_id` y `color_id`.
6. Ordenar colores por `color_order`.
7. Ordenar tallas mediante `naturalSort`.
8. Construir las imagenes de cada color con prioridad `back_image -> front_image`.
9. Mantener un arreglo plano de variantes para filtros y precios.
10. Cambiar la clave de cache a `PRODUCTS_CACHE_V2`.
11. Validar referencias inexistentes y evitar que una fila incorrecta rompa todo el catalogo.
12. Publicar una nueva version de Apps Script y probar el refresh de cache.

Forma esperada del JSON:

```js
{
  id: 1,
  slug: "dead-or-alive",
  name: "Dead or Alive",
  colors: [
    {
      id: 1,
      name: "Negro",
      hex: "#111111",
      order: 1,
      back_image: "drive_back_black",
      front_image: "drive_front_black",
      default_image: "drive_back_black",
      images: [
        { view: "back", image: "drive_back_black" },
        { view: "front", image: "drive_front_black" }
      ],
      variants: [
        {
          id: 1,
          size: "S",
          price: 20,
          stock: 10,
          sku: "DOA-BLK-S",
          available: true
        }
      ]
    }
  ],
  variants: []
}
```

Criterio de cierre:

- El endpoint devuelve un producto por diseno.
- El primer color esta determinado por `color_order`.
- `default_image` usa correctamente espalda o frente.
- Colores y tallas aparecen relacionados correctamente.

### Fase 5.5 - Datos Mock Y Utilidades Del Frontend

Objetivo: poder desarrollar y probar el nuevo flujo sin depender de la API publicada.

Estado: implementada.

Tareas:

1. Actualizar `js/mock-data.js` con productos de uno y varios colores.
2. Incluir casos con:
   - Frente y espalda.
   - Solo espalda.
   - Solo frente.
   - Varias tallas.
   - Tallas agotadas.
3. Actualizar `js/utils.js` para resolver:
   - Primer color configurado.
   - Imagen principal con prioridad trasera.
   - Placeholder general cuando el color no tiene imagenes.
   - Precio minimo entre todas las variantes.
   - Variantes disponibles por color.
4. Mantener el filtro de talla revisando todos los colores del producto.

Criterio de cierre:

- Los casos principales y alternos pueden probarse localmente.
- Cards, precios y filtros funcionan con el nuevo JSON.

### Fase 5.6 - Cards De Home Y Tienda

Objetivo: mostrar un solo card por diseno y abrir su detalle.

Estado: implementada.

Comportamiento:

1. El card usa el primer color activo segun `color_order`.
2. Muestra primero `back_image`.
3. Si no existe espalda, muestra `front_image`.
4. Si no existe ninguna, usa el placeholder general del sitio.
5. El card conserva nombre, descripcion, badge y precio minimo.
6. La seleccion directa de talla se retira del card.
7. El boton principal cambia de `Agregar` a `Ver producto` o `Ver opciones`.
8. Al seleccionar el card se abre el modal del producto.

Criterio de cierre:

- No hay cards duplicados por color, frente o espalda.
- La imagen trasera aparece como portada cuando existe.
- Todos los cards abren el producto correcto.

### Fase 5.7 - Modal De Producto

Objetivo: permitir seleccionar color y talla, y consultar frente y espalda.

Estado: implementada con animacion 3D tipo carta, previews laterales en escritorio y vista compacta en mobile.

Estado sugerido en `js/app.js`:

```txt
isProductModalOpen
activeProduct
activeColorIndex
activeView
selectedModalVariant
```

Comportamiento:

1. El modal abre con el primer color configurado.
2. La vista inicial es la trasera cuando existe.
3. Si no existe vista trasera, abre con la frontal.
4. El selector de color permite cambiar entre todos los colores activos.
5. Al cambiar de color:
   - Se restablece la vista principal.
   - Se limpia la talla seleccionada.
   - Se muestran las tallas correspondientes a ese color.
6. La opcion `Voltear playera` alterna entre espalda y frente.
7. Si solo existe una imagen, no se muestra la opcion de voltear.
8. Las tallas agotadas se muestran deshabilitadas.
9. `Agregar al carrito` permanece deshabilitado hasta seleccionar una variante disponible.
10. El modal debe cerrar con boton, clic exterior y tecla `Escape`.
11. Se debe controlar el foco para navegacion por teclado.

Funciones sugeridas:

```txt
openProductModal(product)
closeProductModal()
activeColor()
selectProductColor(index)
activeProductImage()
canFlipProduct()
flipProductView()
selectModalVariant(variant)
addModalSelectionToCart()
```

Criterio de cierre:

- Color, vista y talla se actualizan sin mezclar datos de otros colores.
- La espalda siempre tiene prioridad al abrir o cambiar de color.
- El producto correcto se agrega al carrito.

### Fase 5.8 - Carrito, Checkout Y WhatsApp

Objetivo: conservar la seleccion real del cliente durante todo el pedido.

Estado: implementada. El carrito usa la clave `rockstar_cart_v2`.

Datos que debe guardar el carrito:

```txt
productId
colorId
variantId
name
selectedColor
selectedColorHex
selectedSize
image
sku
price
stock
quantity
```

Reglas:

1. `image` debe ser la imagen principal del color, priorizando la trasera.
2. Los elementos se agrupan por `variantId`.
3. El carrito y checkout muestran color y talla.
4. Frente o espalda no se guardan como seleccion porque solo son vistas.
5. El mensaje de WhatsApp incluye color, talla, cantidad, precio y subtotal.

Ejemplo:

```txt
- Dead or Alive
  Color: Negro
  Talla: M
  Cantidad: 1
  Precio: USD 20.00
```

Criterio de cierre:

- Dos colores o tallas diferentes generan lineas separadas.
- El resumen visual y el mensaje de WhatsApp coinciden.
- El carrito persistente puede leer correctamente el nuevo formato.

### Fase 5.9 - Pruebas Y Publicacion

Objetivo: validar el flujo completo antes de reemplazar el catalogo actual.

Estado: pendiente.

Pruebas funcionales:

1. Producto con un solo color.
2. Producto con varios colores.
3. Color con frente y espalda.
4. Color con solo espalda.
5. Color con solo frente.
6. Producto sin imagenes de color, usando el placeholder general.
7. Tallas disponibles, agotadas y deshabilitadas.
8. Filtros por categoria y talla.
9. Cards, destacados y productos de home.
10. Modal, cambio de color y opcion de voltear.
11. Carrito, cantidades, checkout y WhatsApp.
12. Persistencia del carrito despues de recargar.

Pruebas visuales:

1. Tema claro y oscuro.
2. Mobile, tablet y desktop.
3. Imagenes de distintas proporciones.
4. Estados de carga, error y catalogo vacio.
5. Navegacion por teclado y foco visible.

Publicacion:

1. Validar primero con mock data.
2. Validar el JSON real de Apps Script.
3. Publicar la nueva version del Web App.
4. Ejecutar refresh de cache.
5. Activar el catalogo migrado.
6. Mantener el respaldo anterior para una posible recuperacion.

Criterio final:

- El cliente puede administrar productos, colores, imagenes y tallas desde Sheets.
- El sitio muestra un card por diseno.
- La imagen trasera tiene prioridad en cards y modal.
- El flujo completo funciona con datos reales hasta el pedido por WhatsApp.

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
