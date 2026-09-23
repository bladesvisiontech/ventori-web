import { Hero } from '@/components/sections/Hero'
import { ProjectsMap } from '@/components/sections/ProjectsMap'

/**
 * Home.
 *
 * Solo dos piezas: el hero y la cobertura de proyectos. El resto del
 * argumento de empresa —sectores, quiénes somos, cómo trabajamos, servicios,
 * por qué elegirnos— vive en su interna correspondiente, con el mismo diseño
 * que traía aquí y el contenido propio de esa página.
 *
 * El hero no lleva cabecera numerada, así que la numeración visible arranca
 * en `<ProjectsMap>`.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ProjectsMap index={0} />
    </>
  )
}
