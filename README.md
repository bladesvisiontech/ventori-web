# Ventori — sitio web corporativo

Sitio de Ventori, empresa colombiana de **ingeniería, consultoría e interventoría** para proyectos de infraestructura pública y privada.

Next.js 16 · React 19 · TypeScript · Tailwind v4 · Framer Motion

## Arrancar

```bash
npm install
cp .env.example .env.local   # completar las variables
npm run dev
```

`npm run build` compila y verifica tipos. `npm run lint` corre ESLint.

## Estructura

```
src/
├── app/          rutas (home, 5 internas, 3 legales, 404), metadatos, iconos y route handler
├── components/
│   ├── layout/   Header, Footer, Logo
│   ├── motion/   entrance, Reveal, Headline, Rule, Stagger, Counter,
│   │             Parallax, PinnedSequence, Marquee, ScrollProgress
│   ├── sections/ secciones compuestas por las páginas
│   └── ui/       primitivas de diseño
├── content/      TODO el copy y los datos, tipados
├── lib/          constants, env, seo, utils, validación
├── styles/       tokens de marca
└── types/
```

## Dirección de arte

Se llama **Estructura** y sale del isotipo: vigas biseladas a 45°, cero esquinas redondeadas. De ahí salen el bisel de marca en todo marco y botón, la retícula técnica de fondo y la numeración en monoespaciada que recorre el sitio.

Paleta: navy `#010133`, terracota `#d88b64`, blanco. Tipografía: Archivo (titulares, anchura variable), Inter (texto), JetBrains Mono (etiquetas).

El scroll tiene tres momentos propios: el revelado de titulares línea a línea, la secuencia de fases con la fotografía fijada al viewport, y la banda de términos que reacciona a la velocidad del scroll.

## Reglas del proyecto

Están en [AGENTS.md](AGENTS.md). Las que más pesan:

1. **Nada hardcodeado.** El copy vive en `src/content/`, todo lo demás en `src/lib/constants.ts`, los secretos en env con getter que falla si falta.
2. **La terracota nunca es texto sobre blanco** (2.7:1, no pasa AA). Va como fondo de bloque con texto navy, o como acento sobre navy.
3. **Toda animación pasa por `src/components/motion/`.** Respetan `prefers-reduced-motion` vía `MotionProvider`, y el `<noscript>` del layout mantiene el contenido visible sin JavaScript.
4. **Nunca observar el viewport sobre un elemento que arranca recortado o a escala 0** — se queda invisible para siempre. El detalle y los otros dos escollos del sistema de motion están en AGENTS.md.
5. **Todo tamaño de tipografía nuevo hay que registrarlo en `extendTailwindMerge`** (`src/lib/utils.ts`), o `cn()` lo descarta al fusionarlo con un color.

## Verificado

Build y ESLint limpios. Auditado a 375 / 768 / 1024 / 1440 px: sin scroll horizontal, todas las áreas táctiles ≥ 44 px, un solo `h1` por página, jerarquía de encabezados sin saltos, ningún enlace o imagen sin nombre accesible.

Con `prefers-reduced-motion` no queda contenido invisible en ninguna ruta, no se descarga ningún vídeo y se retiran la barra de progreso y la marquesina. El menú móvil retiene el foco, cierra con Escape y lo devuelve al botón; el formulario anuncia errores con `role="alert"` y lleva el foco al primer campo inválido.

## Seguridad

- Cabeceras HTTP en `next.config.ts`: CSP (solo recursos propios), HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP.
- `/api/contact`: solo mismo origen (403), solo JSON (415), cuerpo ≤ 16 KB (413), 3 envíos por minuto por IP (429), validación Zod en servidor, sin saltos de línea en nombre/entidad, campo trampa para bots, `no-store` y `noindex`.
- Dependencias sin vulnerabilidades conocidas (`npm audit`, Next 16.3.6). Repetir `npm audit` antes de cada entrega.
- Los secretos solo viven en variables de entorno (`.env*` está en `.gitignore`).

## Legal (Colombia)

- `/politica-de-privacidad`: Ley 1581 de 2012 y Decreto 1377 de 2013 (compilado en el 1074 de 2015). El formulario exige la casilla de autorización, validada también en servidor, y cada correo recibido lleva la constancia con fecha.
- `/terminos-y-condiciones`: propiedad intelectual (Ley 23 de 1982, Decisión Andina 351), uso permitido, ley aplicable.
- `/politica-de-cookies`: el sitio **no usa cookies ni almacenamiento local**, así que no necesita aviso de consentimiento. Si algún día se añade analítica (Google Analytics, Meta Pixel, etc.), hay que implementar un aviso con consentimiento previo **antes** de activarla y actualizar esta política.
- Las fotos de ambientación son de Pexels/Unsplash (uso comercial sin atribución, ver `public/media/CREDITS.md`). Los términos aclaran que no representan proyectos propios. Las fotos de proyectos y el vídeo del hero los entregó el cliente.

## SEO

Metadatos y canonical por página, Open Graph y Twitter con imagen generada (`app/opengraph-image.tsx`), JSON-LD de organización, migas de pan y proyectos, `sitemap.xml` con las fotos de proyectos, `robots.txt`, `manifest.webmanifest`, favicon `.ico` + SVG + `apple-icon`.

## Pendiente del cliente

| Qué falta | Dónde va | Impacto |
|---|---|---|
| **Cuenta de Resend con dominio verificado** y buzón de destino | Variables `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` en Vercel (Settings → Environment Variables) | **Sin ellas el formulario no envía correos** (responde con error controlado) |
| Dominio propio | Vercel → Domains, y `NEXT_PUBLIC_SITE_URL` | Canonical, sitemap y Open Graph usan la URL de Vercel mientras tanto |
| NIT de la empresa | `SITE.nit` en `src/lib/constants.ts` | Aparece solo en las páginas legales |
| Correo, teléfono, dirección, ciudad, LinkedIn | `CONTACT`, `SOCIAL` en `src/lib/constants.ts` | Se muestran en pie, contacto y páginas legales al cargarlos |
| Fotos de Timbío y El Tambo | `images` en `src/content/projects-map.ts` + archivos en `public/proyectos/` | Hoy muestran "Registro fotográfico próximamente" |
| Cifras de la barra de indicadores | `src/content/stats.ts` | La barra no aparece mientras esté vacío |
| Revisión jurídica de los textos legales | `src/content/legal.ts` | Redactados según la norma, pero conviene que los valide un abogado |

Los canales de contacto sin dato se omiten en lugar de aparecer en blanco.
