import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 


const Middleware = (req:NextRequest) => {
  const authToken = req.cookies.get("authtoken")?.value;
  const loggedInUserNotAccessPaths= req.nextUrl.pathname==="/login";

  if (loggedInUserNotAccessPaths){
    if(authToken){
      return NextResponse.redirect(new URL('/', req.url))
    }
    

  }else{
    if(!authToken){
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

 
} 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|\\.png$).*)', '/users', '/', '/login', '/transections', '/settings',"/user-post"]
}

export default Middleware