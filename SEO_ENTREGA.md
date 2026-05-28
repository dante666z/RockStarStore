# SEO Tecnico - RockStar Store

## Implementado

- Titulos y meta descriptions por pagina.
- Meta `robots` con `index, follow`.
- Open Graph completo base: titulo, descripcion, imagen, alt, locale y site name.
- Twitter Card base.
- `theme-color` y `color-scheme`.
- Datos estructurados JSON-LD:
  - `ClothingStore` en home.
  - `CollectionPage` + `ItemList` en tienda.
- Atributos `alt` en imagenes principales.
- `robots.txt` permitiendo rastreo.

## Pendiente Al Tener Dominio Final

Cuando exista el dominio de produccion, agregar:

1. `link rel="canonical"` absoluto en `index.html`.
2. `link rel="canonical"` absoluto en `tienda.html`.
3. `og:url` absoluto por pagina.
4. URLs absolutas en `og:image`, `twitter:image` y JSON-LD.
5. `sitemap.xml` con URLs absolutas.
6. Linea `Sitemap:` en `robots.txt`.

Ejemplo:

```html
<link rel="canonical" href="https://dominio-final.com/">
<meta property="og:url" content="https://dominio-final.com/">
```

```txt
Sitemap: https://dominio-final.com/sitemap.xml
```
