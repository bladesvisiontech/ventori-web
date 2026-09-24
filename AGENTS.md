<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Ventori — reglas del proyecto

## Nada hardcodeado

Ningún literal de negocio vive en JSX. Antes de escribir un string o número que no sea sintaxis:

- **Copy, listas, cifras, fotos y vídeos** → `src/content/data/*.json`, que edita el CMS (`bladesvisiontech/cms-ventori`). Su forma está en `src/content/schema.ts` y se valida en build; los módulos de `src/content/*.ts` solo los leen y reexportan. Si cambias el esquema, copia el archivo a `cms-ventori/src/lib/content-schema.ts` y añade el campo al editor en `cms-ventori/src/lib/pages.ts`.
- **Rutas, navegación, datos de empresa, contacto, límites de formulario** → `src/lib/constants.ts`
- **Secretos** → env var leída con un getter en `src/lib/env.ts` que lanza error si falta

Si el valor no existe todavía, agrégalo primero al módulo que le corresponde y luego impórtalo.

## Color

Tres colores de marca: `navy` (`#010133`), `terracota` (`#d88b64`), blanco. Escalas derivadas en `src/styles/tokens.css`.

**Restricción de contraste, no negociable:** terracota sobre blanco da 2.7:1 y no pasa WCAG AA. La terracota nunca es color de texto sobre fondo claro. Va como fondo de bloque con texto navy encima, como acento sobre navy, o en elementos decorativos sin carga textual.

Ratios válidos: blanco/navy 19.9:1 · terracota/navy 7.4:1 · navy/terracota 7.4:1.

## Dirección de arte

El lenguaje visual sale del isotipo: cuatro vigas en paralelogramo biseladas a 45°.

- **Radio 0 en todo.** La curva no existe en esta marca.
- **El bisel** (`.bevel`, `.bevel-sm`) es el único recorte permitido y va siempre en las mismas dos esquinas: superior derecha e inferior izquierda. Toda la fotografía pasa por `<MediaFrame>` para que sea sistema y no capricho.
- **Retícula técnica** (`<GridPaper>`) como fondo, en lugar de degradados —que serían un cuarto color—.
- **Numeración visible.** Secciones, servicios, sectores y fases van numerados en monoespaciada. El índice sale de la posición en la página, no del contenido.

Tres familias: **Archivo** para titulares (eje de anchura variable, display al 112 %), **Inter** para texto y **JetBrains Mono** para etiquetas e índices.

## Motion

Toda animación pasa por las primitivas de `src/components/motion/`. No se usa `framer-motion` directamente en secciones ni páginas.

Las primitivas respetan `prefers-reduced-motion`: con la preferencia activa el contenido se renderiza visible y estático. El contenido nunca depende de JS para ser legible.

Tres reglas que costaron caro y no hay que volver a romper:

1. **Nunca observar el viewport sobre el elemento que arranca recortado o a escala 0.** Un titular desplazado una caja hacia abajo dentro de un `overflow-hidden`, o una regla en `scaleX(0)`, tiene área visible cero: el navegador no lo da nunca por dentro del viewport y se queda invisible **para siempre**. Quien observa es el envoltorio, que no se transforma — ver `entranceTriggerProps()` en `motion/entrance.ts`.

2. **Nada de margen negativo en `viewport`.** Recortar el viewport por abajo para adelantar el revelado crea una franja donde un elemento puede estar a la vista y sin disparar. El observador va con umbral cero y viewport completo (`ENTRANCE_VIEWPORT`).

3. **Lo que ya está en pantalla al cargar anima al montar, no al entrar en vista** (`trigger="mount"`). En la primera carga no ha habido scroll: el hero y los encabezados de página no pueden esperar a "entrar".

`overflow-hidden` en una sección **anula `position: sticky`** dentro de ella. `<Section>` usa `overflow-clip`, que recorta igual sin crear contenedor de scroll.

## Tailwind

Los tamaños de tipografía propios (`text-display-*`, `text-label`) están registrados en `extendTailwindMerge` en `src/lib/utils.ts`. Sin eso, `tailwind-merge` los toma por colores y `cn('text-display-xl', 'text-white')` descarta el tamaño: el titular se queda en 16 px. **Al añadir un tamaño nuevo a `tokens.css` hay que añadirlo también ahí.**

El extremo inferior de la escala de display está calculado contra el ancho útil de un teléfono de 375 px y la palabra más larga del copy. Los titulares se declaran partidos en líneas fijas, así que un mínimo demasiado alto no refluye: se sale de la pantalla.

## Componentes

Las páginas son Server Components. Solo las primitivas de motion, el header y el formulario llevan `"use client"`, y se mantienen delgadas.
