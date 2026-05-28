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
