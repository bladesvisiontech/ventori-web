import { PROYECTOS } from '@/content/data/proyectos'

/**
 * Cifras de la barra de indicadores. Vacío hasta que el cliente las entregue:
 * `<StatsBar />` no se renderiza mientras no haya ninguna.
 */
export const STATS = PROYECTOS.stats

export const HAS_STATS = STATS.length > 0
