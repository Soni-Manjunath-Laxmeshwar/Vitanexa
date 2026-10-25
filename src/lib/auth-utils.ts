import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function requireAuth(allowedRoles?: string[]) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (allowedRoles && !allowedRoles.includes((session.user as any).role)) {
    redirect('/unauthorized')
  }
  return session
}

export async function getServerSession() {
  return auth()
}
