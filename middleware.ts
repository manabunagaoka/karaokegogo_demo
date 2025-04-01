// This is an empty middleware file that doesn't enforce authentication
export const config = {
  matcher: [] // Empty matcher means middleware won't run on any routes
};

export default function middleware() {
  return;
}