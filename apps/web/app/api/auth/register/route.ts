import { proxyAuthRequest } from "../_utils";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (typeof email !== "string" || typeof password !== "string") {
    return Response.redirect(
      new URL(
        "/register?error=Please%20provide%20an%20email%20and%20password.",
        request.url,
      ).toString(),
      303,
    );
  }

  if (typeof confirmPassword !== "string" || password !== confirmPassword) {
    return Response.redirect(
      new URL("/register?error=Passwords%20do%20not%20match.", request.url).toString(),
      303,
    );
  }

  return proxyAuthRequest({
    body: JSON.stringify({ email, password }),
    errorRedirectPath: "/register",
    method: "POST",
    request,
    successRedirectPath: "/dashboard",
    upstreamPath: "/auth/register",
  });
}
