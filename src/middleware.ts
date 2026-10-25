import { auth } from '@/auth'
import { NextResponse } from 'next/server'

const protectedRoutes = ['/patient', '/doctor', '/hospital', '/lab', '/pharmacy', '/admin']
const authRoutes = ['/login', '/register', '/forgot-password']

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = (req.auth?.user as any)?.role

  const isProtected = protectedRoutes.some((r) => nextUrl.pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => nextUrl.pathname.startsWith(r))

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  if (isLoggedIn && nextUrl.pathname.startsWith('/admin') && role !== 'SYSTEM_ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', nextUrl))
  }
  if (isLoggedIn && nextUrl.pathname.startsWith('/doctor') && role !== 'DOCTOR') {
    return NextResponse.redirect(new URL('/unauthorized', nextUrl))
  }
  if (isLoggedIn && nextUrl.pathname.startsWith('/patient') && role !== 'PATIENT') {
    return NextResponse.redirect(new URL('/unauthorized', nextUrl))
  }

  if (isAuthRoute && isLoggedIn) {
    const dashboardMap: Record<string, string> = {
      PATIENT: '/patient/dashboard',
      DOCTOR: '/doctor/dashboard',
      HOSPITAL_ADMIN: '/hospital/dashboard',
      LAB_ADMIN: '/lab/dashboard',
      PHARMACY_ADMIN: '/pharmacy/dashboard',
      SYSTEM_ADMIN: '/admin/dashboard',
    }
    return NextResponse.redirect(new URL(dashboardMap[role] || '/', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
