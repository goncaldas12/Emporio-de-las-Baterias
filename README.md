# El Emporio de las Baterías — Sitio web V5

Sitio estático multipágina (Inicio, Baterías, Buscá tu batería, Nosotros, Contacto, Privacidad).

## Probar

Extraer el ZIP completo y abrir `index.html` en un navegador. No separar los archivos de la carpeta `assets`.

## Antes de publicar

1. Abrir `config.js` y completar el WhatsApp real en formato internacional (ej. `54911XXXXXXXX`), dirección y horarios confirmados.
2. Confirmar con el negocio los servicios que ofrece y la disponibilidad de marcas y productos.
3. Verificar las referencias de compatibilidad de `data.js`; son orientativas, no equivalencias garantizadas para todas las versiones.
4. Agregar los identificadores de Google Analytics y Google Ads solo cuando estén creados y revisar privacidad / consentimiento antes de activarlos.
5. No se publicaron precios del Excel porque no fueron validados como precios de venta vigentes.

## Publicar

Se puede subir la carpeta a cualquier hosting de archivos estáticos o a Vercel. Para uso comercial, comprobar condiciones del plan elegido. No requiere base de datos ni build.

## Funcionamiento

- Selección de marca y modelo de vehículo.
- Búsqueda de referencias y sugerencias orientativas.
- Filtrado de catálogo por marca y categoría.
- Formulario de contacto: si hay número en `config.js`, abre WhatsApp; si no, prepara texto para copiar.
- Consentimiento para analítica opcional.

La foto del local y fotografías de baterías fueron provistas como materiales del proyecto. Para un lanzamiento comercial verificar los derechos de uso y si representan productos actuales.
