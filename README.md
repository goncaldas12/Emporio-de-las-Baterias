# El Emporio de las Baterías — React + Tailwind

Sitio multipágina migrado a React y Tailwind CSS con Vite. Conserva las seis páginas, las URLs `.html` y las URLs limpias de Vercel, el diseño responsive, los textos, las imágenes y el funcionamiento original.

## Desarrollo

Requiere Node.js 20.19+ o 22.12+ y npm.

```sh
npm ci
npm run dev
```

Abrir la URL que muestra Vite. La aplicación ahora necesita el servidor de desarrollo o una compilación; no se ejecuta abriendo los HTML directamente desde el sistema de archivos.

## Compilar y probar

```sh
npm run build
npm run preview
```

La compilación queda en `dist/`, lista para un hosting de archivos estáticos. Para ejecutar las pruebas de navegador después de compilar:

```sh
npx playwright install chromium
npm test
```

En Linux, si faltan bibliotecas del navegador, Playwright permite instalarlas con `npx playwright install --with-deps chromium`.

## Organización

- `src/pages/`: las seis páginas en React.
- `src/components/`: navegación, pie de página, consentimiento, buscadores, productos y formulario de contacto.
- `src/styles.css`: estilos basados en utilidades Tailwind mediante `@apply`, con los valores y puntos de corte originales. No se carga Preflight para conservar los estilos predeterminados del navegador usados por el sitio.
- `src/data/products.js`: catálogo original.
- `src/data/batteryGuide.js`: referencias de compatibilidad originales.
- `public/config.js`: configuración pública del comercio; sigue disponible en la URL `config.js`.
- `public/assets/`: imágenes originales, disponibles en las mismas URLs `assets/`.
- Los HTML de entrada conservan el título y los metadatos de cada página.

## Antes de publicar

1. Abrir `public/config.js` y completar el WhatsApp real en formato internacional (ej. `54911XXXXXXXX`), dirección y horarios confirmados.
2. Confirmar con el negocio los servicios que ofrece y la disponibilidad de marcas y productos.
3. Verificar las referencias de compatibilidad de `src/data/batteryGuide.js`; son orientativas, no equivalencias garantizadas para todas las versiones.
4. Agregar los identificadores de Google Analytics y Google Ads solo cuando estén creados y revisar privacidad / consentimiento antes de activarlos.
5. No se publicaron precios del Excel porque no fueron validados como precios de venta vigentes.

## Publicar

Publicar el contenido de `dist/` en cualquier hosting de archivos estáticos. En Vercel, usar el preset Vite, comando `npm run build` y directorio de salida `dist`. Se conserva `vercel.json` con `cleanUrls` y `trailingSlash` como estaban. No requiere base de datos.

## Funcionamiento

- Selección de marca y modelo de vehículo.
- Búsqueda de referencias y sugerencias orientativas.
- Filtrado de catálogo por marca y categoría.
- Formulario de contacto: si hay número en `public/config.js`, abre WhatsApp; si no, prepara texto para copiar.
- Consentimiento para analítica opcional.

La foto del local y fotografías de baterías fueron provistas como materiales del proyecto. Para un lanzamiento comercial verificar los derechos de uso y si representan productos actuales.
