import { AuthForm } from "@/components";

import { loginAction } from "./actions";

export default async function LoginPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundImage: "url(/gpc-landing-background.png)" }}
    >
      <div className="page-margins pt-10 sm:pt-20">
        <AuthForm action={loginAction} title="Login" variant="login" />
      </div>
    </main>
  );
}
