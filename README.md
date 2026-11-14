# El Emporio de las Baterías — React + Tailwind

Sitio multipágina en React y Tailwind CSS con Vite. Incluye seis páginas, URLs `.html` y URLs limpias de Vercel, búsqueda por vehículo, catálogo, consultas por WhatsApp y mapas configurables de las dos sedes.

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
- `src/data/brands.js`: orden de marcas de baterías, siempre con Vulcano primero.
- `src/inquiries.js`: mensajes de consulta con batería, vehículo y especificaciones disponibles.
- `public/config.js`: configuración pública del comercio; sigue disponible en la URL `config.js`.
- `public/assets/`: imágenes originales, disponibles en las mismas URLs `assets/`.
- Los HTML de entrada conservan el título y los metadatos de cada página.

## Antes de publicar

1. El teléfono y WhatsApp ya están configurados: **+54 9 11 2372-4111**. En `public/config.js` también están cargados los mapas de **Sucursal Merlo** y **Sucursal Moreno**, ambas con atención **de 9 a 18**.
2. Confirmar con el negocio los servicios que ofrece y la disponibilidad de marcas y productos.
3. Verificar las referencias de compatibilidad de `src/data/batteryGuide.js`; son orientativas, no equivalencias garantizadas para todas las versiones.
4. Agregar los identificadores de Google Analytics y Google Ads solo cuando estén creados y revisar privacidad / consentimiento antes de activarlos.
5. No se publicaron precios del Excel porque no fueron validados como precios de venta vigentes.

## Publicar

Publicar el contenido de `dist/` en cualquier hosting de archivos estáticos. En Vercel, usar el preset Vite, comando `npm run build` y directorio de salida `dist`. Se conserva `vercel.json` con `cleanUrls` y `trailingSlash` como estaban. No requiere base de datos.

## Funcionamiento

- Vulcano aparece primero en las marcas, productos y opciones de baterías.
- Selección de marca, modelo y motor desde Inicio; la página del buscador muestra el resultado automáticamente al recibir esos tres datos.
- Búsqueda de referencias y sugerencias orientativas.
- Filtros combinables en la tabla: marca del vehículo, modelo, motor, batería orientativa y medidas; búsqueda libre y botón para limpiar filtros.
- Filtrado de catálogo por marca y categoría.
- “Hacer una consulta” del encabezado y del recuadro “Antes de elegir” abre el formulario de contacto. El recuadro conserva los datos del vehículo seleccionado y sus referencias reales cuando están disponibles. El formulario valida nombre y vehículo (obligatorios y no solo espacios) antes de abrir WhatsApp con todos los datos completados.
- Los mensajes del formulario separan los datos de contacto, el vehículo, la batería y la consulta en bloques con líneas en blanco. No agregan la pregunta final de disponibilidad y compatibilidad.
- Las consultas de productos, resultados y filas de la tabla abren WhatsApp al número oficial con la batería y las especificaciones correspondientes. Las consultas genéricas no eligen ninguna marca ni modelo de batería. Vulcano aparece primero visualmente, pero solo se incluye en el mensaje cuando se selecciona un producto de esa marca. El envío final lo hace el visitante desde WhatsApp.
- Los enlaces del teléfono usan `tel:+5491123724111` para abrir la aplicación de llamadas del dispositivo.
- Si se vacía explícitamente `whatsapp` en la configuración, el formulario conserva la opción de copiar el mensaje.
- Consentimiento para analítica opcional.

La tabla de referencias, los resultados del buscador y sus consultas por WhatsApp utilizan únicamente las referencias cargadas para cada vehículo en `src/data/batteryGuide.js`. No se agrega Vulcano a vehículos sin esa referencia. La prioridad de Vulcano se mantiene en el catálogo y los selectores de baterías.

## Configurar Google Maps para las dos sedes

Las tarjetas de Merlo y Moreno están en **Contacto** y **Nosotros**, con los mapas provistos y el horario de 9 a 18. Si se elimina la URL de un mapa, se muestra “Ubicación próximamente”.

`googleMapsEmbedUrl` se utiliza únicamente dentro del iframe. El botón “Ver en Google Maps” usa `googleMapsUrl`, con enlaces públicos a cada establecimiento. Si ese enlace falta o se pega por error una URL de inserción, se genera un enlace público a partir de la ubicación del mapa o de la dirección; el botón nunca abre una URL `/maps/embed`.

Para cada sede:

1. Abrir la ubicación correcta en Google Maps desde una computadora.
2. Elegir **Compartir → Insertar un mapa → Copiar HTML**.
3. Del código copiado, tomar solo la URL que está dentro de `src="..."`, normalmente `https://www.google.com/maps/embed?pb=...`.
4. En `public/config.js`, pegar esa URL en `branches[0].googleMapsEmbedUrl` para la primera sede y en `branches[1].googleMapsEmbedUrl` para la segunda.
5. En cada objeto, completar `name`, `address` y `hours`. Opcionalmente, pegar el enlace de **Compartir** en `googleMapsUrl` para el botón “Ver en Google Maps”.
6. Ejecutar `npm run build` y publicar nuevamente `dist/`.

Ejemplo de un objeto dentro de `branches` (reemplazar los valores por los reales):

```js
{
  id: "sede-1",
  name: "Nombre de la sede",
  address: "Dirección completa de la sede",
  hours: "Horarios de atención",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=...",
  googleMapsUrl: "https://maps.app.goo.gl/...",
}
```

También se admite el iframe completo como valor de `googleMapsEmbedUrl`, siempre que esté correctamente encerrado en una cadena de JavaScript. La opción más sencilla es pegar solo la URL `src`. El código crea el iframe responsive y no necesita que modifiques los componentes de React. [Ayuda oficial de Google Maps](https://support.google.com/maps/answer/7101463?hl=es).

La foto del local y fotografías de baterías fueron provistas como materiales del proyecto. Para un lanzamiento comercial verificar los derechos de uso y si representan productos actuales.
