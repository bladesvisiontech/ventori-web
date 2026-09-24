import { NextResponse } from 'next/server'

/** Commit publicado. El CMS lo consulta para saber cuándo un cambio ya está en vivo. */
export function GET() {
  return NextResponse.json({ commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null })
}
