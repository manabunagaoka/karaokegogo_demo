import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ["/", "/signin", "/signup"]
});
 
export const config = {
  // Runs the middleware on all routes except static files and api
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};