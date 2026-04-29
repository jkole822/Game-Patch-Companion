import { proxyAuthRequest } from "../_utils";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return Response.redirect(
      new URL(
        "/login?error=Please%20provide%20an%20email%20and%20password.",
        request.url,
      ).toString(),
      303,
    );
  }

  return proxyAuthRequest({
    body: JSON.stringify({ email, password }),
    errorRedirectPath: "/login",
    method: "POST",
    request,
    successRedirectPath: "/dashboard",
    upstreamPath: "/auth/login",
  });
}
