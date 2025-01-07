import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 


const Middleware = (req:NextRequest) => {
  const authToken = req.cookies.get("authtoken")?.value;
  const loggedInUserNotAccessPaths= req.nextUrl.pathname==="/admin/login";

  if (loggedInUserNotAccessPaths){
    if(authToken){
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    

  }else{
    if(!authToken){
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

 
} 
export const config = {
  matcher: ['/admin/users', '/admin/', '/admin/login', '/admin/transections', '/admin/settings',"/admin/user-post"]
}

export default Middleware