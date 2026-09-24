import { fillTokens } from '@/content/data/tokens'

type Incoming =
  | { type: 'focus'; section?: string; field?: string; label?: string }
  | { type: 'content'; file: string; data: unknown }

const TERRACOTA = '#d88b64'
const NAVY = '#010133'

function getAt(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value === null || value === undefined) return undefined
    return (value as Record<string, unknown>)[key]
  }, source)
}

function find(key: string | undefined, attribute: 'data-cms' | 'data-cms-section') {
  if (!key) return null
  const candidates = Array.from(document.querySelectorAll<HTMLElement>(`[${attribute}="${CSS.escape(key)}"]`))
  /* Si hay varias copias (móvil y escritorio), la que se ve. */
  return candidates.find((element) => element.getClientRects().length > 0) ?? candidates[0] ?? null
}

function box(style: Partial<CSSStyleDeclaration>) {
  const element = document.createElement('div')
  Object.assign(element.style, {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: '2147483646',
    transition: 'all 180ms ease-out',
    display: 'none',
    ...style,
  })
  document.body.appendChild(element)
  return element
}

/**
 * Arranca la vista previa dentro del iframe del CMS. Devuelve la función que
 * la desmonta.
 */
export function startPreview(origin: string) {
  const send = (message: Record<string, unknown>) => window.parent.postMessage({ source: 'ventori-site', ...message }, origin)

  /* La sección que se edita queda enmarcada y el resto de la página, en penumbra. */
  const sectionBox = box({
    outline: `6px solid ${TERRACOTA}`,
    outlineOffset: '-6px',
    boxShadow: '0 0 0 100vmax rgba(1, 1, 51, 0.35)',
  })
  const sectionLabel = document.createElement('span')
  Object.assign(sectionLabel.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    background: TERRACOTA,
    color: NAVY,
    font: '700 22px/1 system-ui, sans-serif',
    padding: '12px 18px',
    letterSpacing: '0.02em',
  })
  sectionBox.appendChild(sectionLabel)
  const fieldBox = box({ outline: `4px solid ${NAVY}`, outlineOffset: '6px', boxShadow: `0 0 0 10px ${TERRACOTA}` })
  const hoverBox = box({ outline: `1px dashed ${TERRACOTA}`, outlineOffset: '2px' })

  let current: { section: HTMLElement | null; field: HTMLElement[] } = { section: null, field: [] }

  /** Coloca el recuadro sobre uno o varios elementos (p. ej. todas las líneas de un titular). */
  const place = (overlay: HTMLElement, target: HTMLElement | HTMLElement[] | null) => {
    const rects = (Array.isArray(target) ? target : target ? [target] : [])
      .filter((element) => element.getClientRects().length > 0)
      .map((element) => element.getBoundingClientRect())
    if (rects.length === 0) {
      overlay.style.display = 'none'
      return
    }
    const top = Math.min(...rects.map((rect) => rect.top))
    const left = Math.min(...rects.map((rect) => rect.left))
    const bottom = Math.max(...rects.map((rect) => rect.bottom))
    const right = Math.max(...rects.map((rect) => rect.right))
    Object.assign(overlay.style, {
      display: 'block',
      top: `${top + window.scrollY}px`,
      left: `${left + window.scrollX}px`,
      width: `${right - left}px`,
      height: `${bottom - top}px`,
    })
  }

  /** El campo exacto o, si es un grupo (titular, lista), todas sus partes visibles. */
  const findField = (key: string | undefined) => {
    if (!key) return []
    const exact = find(key, 'data-cms')
    if (exact) return [exact]
    return Array.from(document.querySelectorAll<HTMLElement>(`[data-cms^="${CSS.escape(`${key}.`)}"]`)).filter(
      (element) => element.getClientRects().length > 0,
    )
  }

  const reposition = () => {
    place(sectionBox, current.section)
    place(fieldBox, current.field)
  }

  const onMessage = (event: MessageEvent<Incoming>) => {
    if (event.origin !== origin || event.source !== window.parent) return
    const message = event.data
    if (!message || typeof message !== 'object') return

    if (message.type === 'focus') {
      const field = findField(message.field)
      const section = find(message.section, 'data-cms-section') ?? field[0]?.closest<HTMLElement>('[data-cms-section]') ?? null
      current = { section, field }
      sectionLabel.textContent = message.label ?? ''
      reposition()
      ;(field[0] ?? section)?.scrollIntoView({ behavior: 'smooth', block: field.length ? 'center' : 'start' })
      /* El scroll suave mueve los elementos: se recoloca durante y al final. */
      setTimeout(reposition, 350)
      setTimeout(reposition, 800)
    }

    if (message.type === 'content') {
      const prefix = `${message.file}:`
      const data = fillTokens(message.data)
      document.querySelectorAll<HTMLElement>(`[data-cms^="${CSS.escape(prefix)}"]`).forEach((element) => {
        const value = getAt(data, element.dataset.cms!.slice(prefix.length))
        const kind = element.dataset.cmsKind
        if (kind === 'image') {
          const image = element instanceof HTMLImageElement ? element : element.querySelector('img')
          const media = value as { src?: string; alt?: string } | undefined
          if (image && media?.src && image.getAttribute('data-cms-src') !== media.src) {
            image.removeAttribute('srcset')
            image.src = media.src
            image.setAttribute('data-cms-src', media.src)
          }
          if (image && typeof media?.alt === 'string') image.alt = media.alt
          return
        }
        if (kind === 'video' && element instanceof HTMLVideoElement) {
          const media = value as { src?: string; poster?: string } | undefined
          if (media?.src && element.getAttribute('data-cms-src') !== media.src) {
            element.src = media.src
            element.setAttribute('data-cms-src', media.src)
            void element.play().catch(() => {})
          }
          if (media?.poster) element.poster = media.poster
          return
        }
        const text = typeof value === 'string' ? value : (value as { text?: unknown } | undefined)?.text
        if (typeof text === 'string' && element.textContent !== text) element.textContent = text
      })
      reposition()
    }
  }

  /* En la vista previa los clics no navegan: indican al CMS qué se quiere editar. */
  const onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null
    if (!target) return
    event.preventDefault()
    event.stopPropagation()
    send({
      type: 'select',
      field: target.closest<HTMLElement>('[data-cms]')?.dataset.cms,
      section: target.closest<HTMLElement>('[data-cms-section]')?.dataset.cmsSection,
    })
  }

  const onHover = (event: MouseEvent) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-cms]') ?? null
    place(hoverBox, target)
    document.documentElement.style.cursor = target ? 'pointer' : ''
  }

  const onSubmit = (event: Event) => event.preventDefault()

  window.addEventListener('message', onMessage)
  document.addEventListener('click', onClick, true)
  document.addEventListener('submit', onSubmit, true)
  document.addEventListener('mouseover', onHover)
  window.addEventListener('resize', reposition)
  window.addEventListener('scroll', reposition, { passive: true })
  send({ type: 'ready', path: window.location.pathname })

  return () => {
    window.removeEventListener('message', onMessage)
    document.removeEventListener('click', onClick, true)
    document.removeEventListener('submit', onSubmit, true)
    document.removeEventListener('mouseover', onHover)
    window.removeEventListener('resize', reposition)
    window.removeEventListener('scroll', reposition)
    ;[sectionBox, fieldBox, hoverBox].forEach((element) => element.remove())
  }
}
