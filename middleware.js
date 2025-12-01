export function middleware(request) {
  const url = new URL(request.url);

  // ya autenticado → permitir
  if (request.cookies.get("ppl_auth") === "1") {
    return;
  }

  // permitir el acceso a /login
  if (url.pathname === "/login" || url.pathname.startsWith("/login")) {
    return;
  }

  // redirigir al login
  return Response.redirect(`${url.origin}/login`);
}
