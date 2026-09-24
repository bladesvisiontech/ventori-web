'use client'

import { useEffect } from 'react'

const CMS_ORIGIN = process.env.NEXT_PUBLIC_CMS_ORIGIN ?? ''

/**
 * Conecta la página con la vista previa del CMS. Para un visitante normal no
 * hace nada ni descarga nada: solo cuando la página está dentro del iframe del
 * CMS carga `preview.ts`, que resalta lo que se edita y aplica en vivo los
 * textos y fotos sin publicar.
 */
export function CmsPreviewBridge() {
  useEffect(() => {
    if (!CMS_ORIGIN || window.self === window.top) return
    let stop: (() => void) | undefined
    let cancelled = false
    void import('./preview').then(({ startPreview }) => {
      if (!cancelled) stop = startPreview(CMS_ORIGIN)
    })
    return () => {
      cancelled = true
      stop?.()
    }
  }, [])

  return null
}
