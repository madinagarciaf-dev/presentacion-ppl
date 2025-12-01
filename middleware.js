export function middleware(req) {
  const url = new URL(req.url);

  // Si ya está autenticado
  if (req.cookies.get("ppl_auth") === "1") {
    return;
  }

  // Permitir ver la página login
  if (url.pathname === "/login" || url.pathname.startsWith("/login")) {
    return;
  }

  // Redirigir al login
  return Response.redirect(`${url.origin}/login`);
}
