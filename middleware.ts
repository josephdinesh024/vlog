
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { auth } from './app/auth'


 
export async function middleware(request: NextRequest) {
  const session = await auth()
  if(!(session && session.user))
    return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
  matcher: ['/posts/newposts','/posts/editpost'],
}