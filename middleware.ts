import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log which routes are being accessed through middleware
  console.log(`Middleware processing: ${request.nextUrl.pathname}`);
  
  // Special handling for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // No additional middleware processing for API routes
    // This ensures we don't interfere with our custom size limits
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure middleware to run only for API routes
export const config = {
  matcher: ['/api/:path*'],
};